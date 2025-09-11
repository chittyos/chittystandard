#!/usr/bin/env node

import { execSync } from 'child_process';
import chalk from 'chalk';
import semver from 'semver';

const requiredDependencies = {
  node: '>=18.0.0',
  npm: '>=9.0.0',
  git: '>=2.0.0',
};

function checkDependency(name, versionRequirement) {
  try {
    let version;
    
    switch (name) {
      case 'node':
        version = process.version;
        break;
      case 'npm':
        version = execSync('npm -v', { encoding: 'utf8' }).trim();
        version = `v${version}`;
        break;
      case 'git':
        version = execSync('git --version', { encoding: 'utf8' })
          .match(/\d+\.\d+\.\d+/)[0];
        version = `v${version}`;
        break;
      default:
        throw new Error(`Unknown dependency: ${name}`);
    }
    
    if (semver.satisfies(version, versionRequirement)) {
      console.log(chalk.green(`✓ ${name}: ${version}`));
      return true;
    } else {
      console.log(chalk.red(`✗ ${name}: ${version} (requires ${versionRequirement})`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`✗ ${name}: not found`));
    return false;
  }
}

console.log(chalk.cyan.bold('\n🔍 Checking ChittyOS Standard dependencies...\n'));

let allDependenciesMet = true;

for (const [name, requirement] of Object.entries(requiredDependencies)) {
  if (!checkDependency(name, requirement)) {
    allDependenciesMet = false;
  }
}

if (allDependenciesMet) {
  console.log(chalk.green.bold('\n✨ All dependencies are satisfied!\n'));
  process.exit(0);
} else {
  console.log(chalk.red.bold('\n❌ Some dependencies are missing or outdated.\n'));
  console.log(chalk.yellow('Please install the required dependencies and try again.\n'));
  process.exit(1);
}