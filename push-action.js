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
    const registrationType = core.getInput('registration-type');
    const registrationValue = core.getInput('registration-value') || '';
    const description = core.getInput('description') || '';
    const artifactory = core.getInput('artifactory') || '';
    const debug = core.getInput('debug') || 'false';
    const gitRef = core.getInput('git-ref') || '';

    if (!dockerImage || !artifactName || !externalId || !registrationType) {
      throw new Error('Required inputs are missing.');
    }

    // Push Docker image
    const pushCommand = `node ${facetsctlBinary} push -i ${dockerImage} -a ${artifactName} -e ${externalId} --registration-type ${registrationType} --registration-value ${registrationValue} -d "${description}" --artifactory ${artifactory} --debug ${debug} --git-ref ${gitRef}`;
    await executeCommand(pushCommand);

    console.log('Image pushed successfully.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
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
