const fs = require('fs');
const { execSync } = require('child_process');

function getChangedFiles() {
  try {
    // First, try to get the default branch name
    const defaultBranch = execSync('git remote show origin | sed -n \'/HEAD branch/s/.*: //p\'').toString().trim();
    console.log('Default branch:', defaultBranch);

    // Then, use the default branch name in the diff command
    const diffCommand = `git diff --name-only origin/${defaultBranch}...HEAD`;
    console.log('Diff command:', diffCommand);

    const diffOutput = execSync(diffCommand).toString();
    const files = diffOutput.split('\n').filter(file => file.trim() !== '');
    console.log('Changed files:', files);
    return files;
  } catch (error) {
    console.error('Error getting changed files:', error);
    // Fallback: return all files in the repository
    const allFiles = execSync('git ls-files').toString().split('\n').filter(file => file.trim() !== '');
    console.log('Fallback: Using all files:', allFiles);
    return allFiles;
  }
}

function mockAnalyzeCodeChanges(changedFiles) {
  console.log('Changed files:', changedFiles);
  
  // Mock recommendation based on file types
  const recommendations = [];
  if (changedFiles.some(file => file.endsWith('.js'))) {
    recommendations.push('JavaScript Unit Tests');
  }
  if (changedFiles.some(file => file.endsWith('.css'))) {
    recommendations.push('UI Tests');
  }
  if (changedFiles.some(file => file.includes('api'))) {
    recommendations.push('API Integration Tests');
  }
  
  // Always include these general tests
  recommendations.push('Smoke Tests');
  recommendations.push('Regression Tests');
  
  return recommendations;
}

function main() {
  try {
    const changedFiles = getChangedFiles();
    const recommendations = mockAnalyzeCodeChanges(changedFiles);
    fs.writeFileSync('test-recommendations.json', JSON.stringify(recommendations, null, 2));
    console.log('Mock test recommendations generated:', recommendations);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();