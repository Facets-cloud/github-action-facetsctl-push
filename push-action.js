const path = require('path');
const core = require('@actions/core');
const { exec } = require('child_process');

async function run() {
  try {
    const facetsctlBinary = path.join(__dirname, 'node_modules/@facets-cloud/facetsctl/bin/run');
    
    const username = core.getInput('username');
    const token = core.getInput('token');
    const cpUrl = core.getInput('cp-url');
    
    const facetsctlLoginCommand = `node ${facetsctlBinary} login -u ${username} -t ${token} -c ${cpUrl}`;
    await executeCommand(facetsctlLoginCommand);

    const dockerImage = core.getInput('docker-image');
    const artifactName = core.getInput('artifact-name');
    const externalId = core.getInput('external-id');
    const description = core.getInput('description') || '';
    const artifactory = core.getInput('artifactory') || '';
    const debug = core.getInput('debug') || 'false';
    const autodetectGitRef = core.getInput('autodetect-git-ref') === 'true';

    if (!dockerImage || !artifactName || !externalId) {
      throw new Error('Required inputs are missing.');
    }

    let gitRef = core.getInput('git-ref');
    if (autodetectGitRef) {
      gitRef = await getCurrentGitRef();
    }

    let pushCommand = `node ${facetsctlBinary} push -i ${dockerImage} -a ${artifactName} -e ${externalId}`;
    
    // Conditional options
    if (description) pushCommand += ` -d "${description}"`;
    if (artifactory) pushCommand += ` --artifactory ${artifactory}`;
    if (debug !== 'false') pushCommand += ` --debug ${debug}`;

    // Handle registration or git ref
    const registrationType = core.getInput('registration-type');
    const registrationValue = core.getInput('registration-value');

    if (registrationType && registrationValue) {
      if (gitRef) {
        throw new Error('Cannot specify both git-ref and registration type/value.');
      }
      pushCommand += ` --registration-type ${registrationType} --registration-value ${registrationValue}`;
    } else if (gitRef) {
      pushCommand += ` --git-ref ${gitRef}`;
    } else {
      throw new Error('Either registration type/value or git-ref must be provided.');
    }

    await executeCommand(pushCommand);

    console.log('Image pushed successfully.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function getCurrentGitRef() {
  const gitRefCommand = 'git rev-parse --abbrev-ref HEAD || git describe --tags';
  return new Promise((resolve, reject) => {
    exec(gitRefCommand, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || stdout));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || stdout));
      } else {
        resolve(stdout);
      }
    });
  });
}

run();
