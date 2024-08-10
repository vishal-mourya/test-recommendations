process.removeAllListeners('warning');

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: "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" });

const USE_MOCK_DATA = true; // Set this to false when you want to use the real API

// Mock functions
async function mockAnalyzeCodeChanges(changedFiles) {
    return ["Module1", "Module2"];
}

async function mockMapDependencies(affectedModules) {
    return {
        "Module1": ["Dependency1", "Dependency2"],
        "Module2": ["Dependency3"]
    };
}

async function mockIdentifyTestSuites(dependencyGraph) {
    return ["TestSuite1", "TestSuite2", "TestSuite3"];
}

async function mockPrioritizeTestSuites(testSuites) {
    return ["TestSuite2", "TestSuite1", "TestSuite3"];
}

// Function to analyze code changes using GenAI
async function analyzeCodeChanges(changedFiles) {
    if (USE_MOCK_DATA) return mockAnalyzeCodeChanges(changedFiles);
    
    const fileContents = changedFiles.map(file => fs.readFileSync(file, 'utf8'));
    const prompt = `Analyze the following code changes and identify affected modules/components:

${fileContents.join('\n\n')}

Provide a JSON array of affected modules/components.`;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content);
}

// Function to map dependencies using GenAI
async function mapDependencies(affectedModules) {
    if (USE_MOCK_DATA) return mockMapDependencies(affectedModules);
    
    const prompt = `Given the following affected modules/components:

${JSON.stringify(affectedModules, null, 2)}

Generate a JSON representation of the dependency graph, showing how these modules are interconnected with other parts of the codebase.`;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content);
}

// Function to identify relevant test suites using GenAI
async function identifyTestSuites(dependencyGraph) {
    if (USE_MOCK_DATA) return mockIdentifyTestSuites(dependencyGraph);
    
    const prompt = `Based on the following dependency graph:

${JSON.stringify(dependencyGraph, null, 2)}

Identify and list the most relevant test suites that should be run. Provide the result as a JSON array of test suite names.`;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content);
}

// Function to prioritize test suites using GenAI
async function prioritizeTestSuites(testSuites) {
    if (USE_MOCK_DATA) return mockPrioritizeTestSuites(testSuites);
    
    const prompt = `Given the following list of test suites:

${JSON.stringify(testSuites, null, 2)}

Prioritize these test suites based on their likely importance and impact. Consider factors such as critical functionality, frequency of past issues, and potential for regressions. Provide a JSON array of test suite names in order of priority (highest to lowest).`;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content);
}

// Main function to orchestrate the process
async function getTestSuitesToRun(changedFiles) {
    const affectedModules = await analyzeCodeChanges(changedFiles);
    const dependencyGraph = await mapDependencies(affectedModules);
    const relevantTestSuites = await identifyTestSuites(dependencyGraph);
    const prioritizedTestSuites = await prioritizeTestSuites(relevantTestSuites);
    return prioritizedTestSuites;
}

async function main() {
    const changedFiles = ['./code-changes/file1.js', './code-changes/file2.js'];
    try {
        const testSuitesToRun = await getTestSuitesToRun(changedFiles);
        console.log('Test suites to run:', testSuitesToRun);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('OpenAI API error:', error.response.data);
        }
    }
}

main();