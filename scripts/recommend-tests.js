const fs = require('fs');
const { execSync } = require('child_process');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getChangedFiles() {
  const diffOutput = execSync('git diff --name-only origin/main...HEAD').toString();
  return diffOutput.split('\n').filter(file => file.trim() !== '');
}

async function analyzeCodeChanges(changedFiles) {
  const fileContents = changedFiles.map(file => fs.readFileSync(file, 'utf8'));
  const prompt = `Analyze the following code changes and recommend test suites:

${fileContents.join('\n\n')}

Provide a JSON array of recommended test suite names.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(response.choices[0].message.content);
}

async function main() {
  try {
    const changedFiles = await getChangedFiles();
    const recommendations = await analyzeCodeChanges(changedFiles);
    fs.writeFileSync('test-recommendations.json', JSON.stringify(recommendations, null, 2));
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();