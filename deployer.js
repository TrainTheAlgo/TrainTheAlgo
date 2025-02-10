const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const process = require('process');
require('dotenv').config();

const deploy = {};

deploy.stageChanges = async () => {
  const statusMatrix = await git.statusMatrix({ fs, dir: process.cwd() });
  for (const [filepath, head, workdir, stage] of statusMatrix) {
    if (workdir !== stage) {
      console.log(`Staging ${filepath}`);
      await git.add({ fs, dir: process.cwd(), filepath });
    }
  }
}

deploy.commitChanges = async () => {
  const commitMessage = process.argv[2] || 'Automated commit';
  const sha = await git.commit({
    fs,
    dir: process.cwd(),
    message: commitMessage,
    author: {
      name: 'Anon',
      email: 'anon@example.com',
    },
  });
  console.log('Commit successful, SHA:', sha);
}

deploy.pushChanges = async () => {
  await git.push({
    fs,
    http,
    dir: process.cwd(),
    remote: 'origin',
    url: 'https://github.com/TrainTheAlgo/TrainTheAlgo.git',
    ref: 'main',
    onAuth: () => ({
      username: 'x-access-token',
      password: process.env.GIT_OAUTH,
    }),
  });
  console.log('Push successful');
}

deploy.update = async () => {
  try {
    console.log('Staging changes...');
    await deploy.stageChanges();
    console.log('Committing changes...');
    await deploy.commitChanges();
    console.log('Pushing changes...');
    await deploy.pushChanges();
    console.log('Repository updated :)')
  } catch (error) {
    console.error('Error managing repository:', error);
  }
}

module.exports = deploy;
