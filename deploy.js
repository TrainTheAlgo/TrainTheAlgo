const fs = require('fs');
const { execFile } = require('child_process');
const os = require('os');
const path = require('path');
const process = require('process');
const { promisify } = require('util');
require('dotenv').config();

const deploy = {};
const execFileAsync = promisify(execFile);
let askPassPath = null;

const ensureAskPass = () => {
  if (askPassPath || !process.env.GIT_OAUTH) {
    return askPassPath;
  }
  askPassPath = path.join(os.tmpdir(), `git-askpass-${process.pid}.sh`);
  const script = [
    '#!/bin/sh',
    'case "$1" in',
    '*Username*) echo "x-access-token" ;;',
    '*Password*) echo "$GIT_OAUTH" ;;',
    '*) echo "$GIT_OAUTH" ;;',
    'esac',
    '',
  ].join('\n');
  fs.writeFileSync(askPassPath, script, { mode: 0o700 });
  return askPassPath;
};

const getGitEnv = () => {
  const env = { ...process.env };
  const askPass = ensureAskPass();
  if (askPass) {
    env.GIT_ASKPASS = askPass;
    env.GIT_TERMINAL_PROMPT = '0';
  }
  return env;
};

const execGit = async (args) => {
  await execFileAsync('git', args, {
    cwd: process.cwd(),
    env: getGitEnv(),
    maxBuffer: 1024 * 1024 * 10,
  });
};

deploy.pullChanges = async () => {
  console.log('Pulling changes from remote...');
  await execGit(['pull', 'origin', 'main', '--ff-only']);
  console.log('Git pull successful');
};

deploy.stageChanges = async () => {
  await execGit(['add', '-A']);
};

deploy.commitChanges = async () => {
  const commitMessage = process.argv[2] || 'Automated commit';
  try {
    await execGit(['diff', '--cached', '--quiet']);
    console.log('No staged changes to commit.');
  } catch (error) {
    await execGit(['commit', '-m', commitMessage]);
    console.log('Commit successful.');
  }
};

deploy.pushChanges = async () => {
  await execGit(['push', 'origin', 'main', '--force']);
  console.log('Push successful');
};

deploy.update = async () => {
  try {
    console.log('Pulling changes...');
    await deploy.pullChanges();
    console.log('Staging changes...');
    await deploy.stageChanges();
    console.log('Committing changes...');
    await deploy.commitChanges();
    console.log('Pushing changes...');
    await deploy.pushChanges();
    console.log('Repository updated :)');
  } catch (error) {
    console.error('Error managing repository:', error);
  }
};

module.exports = deploy;
