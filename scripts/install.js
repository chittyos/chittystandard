#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { execSync } from 'child_process';
import detectPackageManager from 'detect-package-manager';
import validateNpmPackageName from 'validate-npm-package-name';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ChittyStandardInstaller {
  constructor() {
    this.spinner = ora();
    this.config = {};
    this.packageManager = 'npm';
  }

  async run() {
    console.log(chalk.cyan.bold('\n🚀 ChittyOS Standard Framework Installer\n'));
    
    try {
      await this.detectEnvironment();
      await this.promptConfiguration();
      await this.checkExistingInstallation();
      await this.installFramework();
      await this.setupSharedDependencies();
      await this.configureIntegration();
      await this.finalizeInstallation();
      
      this.showSuccessMessage();
    } catch (error) {
      this.spinner.fail(chalk.red('Installation failed'));
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  }

  async detectEnvironment() {
    this.spinner.start('Detecting environment...');
    
    try {
      this.packageManager = await detectPackageManager();
      const nodeVersion = process.version;
      
      if (!nodeVersion.match(/^v(1[89]|[2-9]\d)/)) {
        throw new Error('Node.js 18.0.0 or higher is required');
      }
      
      this.spinner.succeed(`Environment detected (Node ${nodeVersion}, ${this.packageManager})`);
    } catch (error) {
      this.spinner.fail('Failed to detect environment');
      throw error;
    }
  }

  async promptConfiguration() {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-chittyapp',
        validate: (input) => {
          const validation = validateNpmPackageName(input);
          if (!validation.validForNewPackages) {
            return 'Invalid project name';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'installationType',
        message: 'Installation type:',
        choices: [
          { name: 'Standard Framework (Recommended)', value: 'standard' },
          { name: 'Minimal (Core dependencies only)', value: 'minimal' },
          { name: 'Full (All ChittyApps components)', value: 'full' },
          { name: 'Custom (Select components)', value: 'custom' }
        ],
        default: 'standard'
      },
      {
        type: 'checkbox',
        name: 'apps',
        message: 'Select ChittyApps to include:',
        choices: [
          { name: 'ChittyResolution', value: 'chittyresolution', checked: true },
          { name: 'ChittyChronicle', value: 'chittychronicle', checked: true },
          { name: 'ChittyEvidence', value: 'chittyevidence' },
          { name: 'ChittyFlow', value: 'chittyflow' },
          { name: 'ChittyIntel', value: 'chittyintel' },
          { name: 'ChittyTrace', value: 'chittytrace' },
          { name: 'ChittyCloude', value: 'chittycloude-mcp' }
        ],
        when: (answers) => answers.installationType === 'custom'
      },
      {
        type: 'confirm',
        name: 'includeDatabase',
        message: 'Include database setup (Neon/PostgreSQL)?',
        default: true
      },
      {
        type: 'confirm',
        name: 'includeAuth',
        message: 'Include authentication system?',
        default: true
      },
      {
        type: 'confirm',
        name: 'includeDocker',
        message: 'Generate Docker configuration?',
        default: false
      }
    ]);

    this.config = answers;
    
    if (answers.installationType === 'full') {
      this.config.apps = [
        'chittyresolution',
        'chittychronicle',
        'chittyevidence',
        'chittyflow',
        'chittyintel',
        'chittytrace',
        'chittycloude-mcp'
      ];
    } else if (answers.installationType === 'standard') {
      this.config.apps = ['chittyresolution', 'chittychronicle'];
    } else if (answers.installationType === 'minimal') {
      this.config.apps = [];
    }
  }

  async checkExistingInstallation() {
    this.spinner.start('Checking for existing installation...');
    
    const projectPath = path.join(process.cwd(), this.config.projectName);
    
    try {
      await fs.access(projectPath);
      this.spinner.warn('Directory already exists');
      
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Directory ${this.config.projectName} already exists. Overwrite?`,
          default: false
        }
      ]);
      
      if (!overwrite) {
        throw new Error('Installation cancelled');
      }
      
      await fs.rm(projectPath, { recursive: true, force: true });
    } catch (error) {
      if (error.code !== 'ENOENT' && !error.message.includes('cancelled')) {
        throw error;
      }
    }
    
    this.spinner.succeed('Ready to install');
  }

  async installFramework() {
    this.spinner.start('Installing ChittyOS Standard Framework...');
    
    const projectPath = path.join(process.cwd(), this.config.projectName);
    
    try {
      await fs.mkdir(projectPath, { recursive: true });
      
      const packageJson = {
        name: this.config.projectName,
        version: '1.0.0',
        type: 'module',
        scripts: {
          'dev': 'vite',
          'build': 'tsc && vite build',
          'preview': 'vite preview',
          'lint': 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
          'typecheck': 'tsc --noEmit'
        },
        dependencies: {},
        devDependencies: {}
      };
      
      await fs.writeFile(
        path.join(projectPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );
      
      process.chdir(projectPath);
      
      const installCmd = this.packageManager === 'yarn' ? 'yarn add' : `${this.packageManager} install`;
      
      execSync(`${installCmd} @chittyos/shared`, { stdio: 'ignore' });
      
      this.spinner.succeed('Framework installed');
    } catch (error) {
      this.spinner.fail('Framework installation failed');
      throw error;
    }
  }

  async setupSharedDependencies() {
    this.spinner.start('Setting up shared dependencies...');
    
    try {
      const templatesPath = path.join(__dirname, '..', 'templates');
      const projectPath = process.cwd();
      
      const filesToCopy = [
        'tsconfig.json',
        'vite.config.ts',
        'tailwind.config.js',
        'postcss.config.js',
        '.eslintrc.json',
        '.prettierrc'
      ];
      
      for (const file of filesToCopy) {
        const templateFile = path.join(templatesPath, file);
        const targetFile = path.join(projectPath, file);
        
        try {
          await fs.copyFile(templateFile, targetFile);
        } catch (error) {
          if (error.code !== 'ENOENT') {
            throw error;
          }
        }
      }
      
      await fs.mkdir(path.join(projectPath, 'src'), { recursive: true });
      await fs.mkdir(path.join(projectPath, 'public'), { recursive: true });
      
      this.spinner.succeed('Shared dependencies configured');
    } catch (error) {
      this.spinner.fail('Failed to setup dependencies');
      throw error;
    }
  }

  async configureIntegration() {
    this.spinner.start('Configuring ChittyApps integration...');
    
    try {
      const projectPath = process.cwd();
      
      if (this.config.apps && this.config.apps.length > 0) {
        const installCmd = this.packageManager === 'yarn' ? 'yarn add' : `${this.packageManager} install`;
        
        for (const app of this.config.apps) {
          try {
            execSync(`${installCmd} @chittyapps/${app}`, { stdio: 'ignore' });
          } catch (error) {
            console.warn(chalk.yellow(`\n⚠ Could not install ${app}, it may need manual setup`));
          }
        }
      }
      
      const configContent = `export const chittyConfig = {
  framework: 'standard',
  version: '1.0.0',
  apps: ${JSON.stringify(this.config.apps || [], null, 2)},
  features: {
    database: ${this.config.includeDatabase},
    authentication: ${this.config.includeAuth},
    docker: ${this.config.includeDocker}
  },
  api: {
    baseUrl: process.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 30000
  },
  ui: {
    theme: 'system',
    components: '@chittyos/shared/ui'
  }
};`;
      
      await fs.writeFile(
        path.join(projectPath, 'src', 'chitty.config.ts'),
        configContent
      );
      
      if (this.config.includeDatabase) {
        await this.setupDatabase();
      }
      
      if (this.config.includeAuth) {
        await this.setupAuthentication();
      }
      
      if (this.config.includeDocker) {
        await this.generateDockerConfig();
      }
      
      this.spinner.succeed('Integration configured');
    } catch (error) {
      this.spinner.fail('Integration configuration failed');
      throw error;
    }
  }

  async setupDatabase() {
    const envContent = `DATABASE_URL=postgresql://user:password@localhost:5432/chittydb
DIRECT_URL=postgresql://user:password@localhost:5432/chittydb`;
    
    await fs.writeFile('.env', envContent);
    
    const drizzleConfig = `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});`;
    
    await fs.writeFile('drizzle.config.ts', drizzleConfig);
  }

  async setupAuthentication() {
    const authConfig = `import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'chitty-secret-key',
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};`;
    
    await fs.mkdir('src/auth', { recursive: true });
    await fs.writeFile('src/auth/config.ts', authConfig);
  }

  async generateDockerConfig() {
    const dockerfile = `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]`;
    
    const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
    depends_on:
      - db
  
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=chittydb
      - POSTGRES_USER=chittyuser
      - POSTGRES_PASSWORD=chittypass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:`;
    
    await fs.writeFile('Dockerfile', dockerfile);
    await fs.writeFile('docker-compose.yml', dockerCompose);
  }

  async finalizeInstallation() {
    this.spinner.start('Finalizing installation...');
    
    try {
      const installCmd = this.packageManager === 'yarn' ? 'yarn' : `${this.packageManager} install`;
      execSync(installCmd, { stdio: 'ignore' });
      
      const gitignoreContent = `node_modules
dist
.env
.env.local
*.log
.DS_Store
.vscode
.idea
*.swp
*.swo
coverage
.nyc_output`;
      
      await fs.writeFile('.gitignore', gitignoreContent);
      
      try {
        execSync('git init', { stdio: 'ignore' });
      } catch (error) {
        console.warn(chalk.yellow('\n⚠ Could not initialize git repository'));
      }
      
      this.spinner.succeed('Installation complete');
    } catch (error) {
      this.spinner.fail('Finalization failed');
      throw error;
    }
  }

  showSuccessMessage() {
    console.log(chalk.green.bold('\n✨ ChittyOS Standard Framework installed successfully!\n'));
    console.log(chalk.cyan('📁 Project created:'), chalk.white(this.config.projectName));
    console.log(chalk.cyan('📦 Framework:'), chalk.white('ChittyOS Standard'));
    
    if (this.config.apps && this.config.apps.length > 0) {
      console.log(chalk.cyan('🔌 Installed apps:'), chalk.white(this.config.apps.join(', ')));
    }
    
    console.log(chalk.yellow('\n🚀 Get started:\n'));
    console.log(chalk.white(`  cd ${this.config.projectName}`));
    console.log(chalk.white(`  ${this.packageManager === 'yarn' ? 'yarn dev' : `${this.packageManager} run dev`}`));
    
    console.log(chalk.gray('\n📚 Documentation: https://docs.chittyos.com'));
    console.log(chalk.gray('💬 Support: https://github.com/ChittyOS/support\n'));
  }
}

const installer = new ChittyStandardInstaller();
installer.run().catch(console.error);