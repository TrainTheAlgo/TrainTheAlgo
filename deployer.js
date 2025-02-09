const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node'); 
const fs = require('fs');
const process = require('process');
require('dotenv').config();

async function stageChanges() {
  const statusMatrix = await git.statusMatrix({ fs, dir: process.cwd() });
  for (const [filepath, head, workdir, stage] of statusMatrix) {
    if (workdir !== stage) {
      console.log(`Staging ${filepath}`);
      await git.add({ fs, dir: process.cwd(), filepath });
    }
  }
}

async function commitChanges() {
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

async function pushChanges() {
  await git.push({
    fs,
    http,
    dir: process.cwd(),
    remote: 'origin',
    url: 'https://github.com/TrainTheAlgo/TrainTheAlgo/',
    ref: 'main',
    onAuth: () => ({
      username: 'TrainTheAlgo',
      publicKey: process.env.SSH_PUBLIC_KEY,
      privateKey: process.env.SSH_PRIVATE_KEY,
      passphrase: undefined,
    }),
  });
  console.log('Push successful');
}

async function manageRepository() {
  try {
    console.log('Staging changes...');
    await stageChanges();

    console.log('Committing changes...');
    await commitChanges();

    console.log('Pushing changes...');
    await pushChanges();
  } catch (error) {
    console.error('Error managing repository:', error);
  }
}

manageRepository();
