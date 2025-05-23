# CI/CD Setup Guide for @thuantan2060/technicalindicators

This guide explains how to set up the continuous integration and deployment pipeline for the technical indicators project.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository at `https://github.com/thuantan2060/technicalindicators`
2. **NPM Account**: You need an NPM account to publish packages
3. **GitHub Account**: Admin access to the GitHub repository

## Required Secrets

### 1. NPM Token

To publish packages to NPM, you need to create an NPM access token:

1. Log in to [npmjs.com](https://www.npmjs.com/)
2. Go to your profile → Access Tokens
3. Click "Generate New Token"
4. Choose "Automation" type for CI/CD usage
5. Copy the generated token

Add this token to your GitHub repository secrets:
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Your NPM access token

### 2. Snyk Token (Optional)

For security scanning with Snyk:

1. Sign up at [snyk.io](https://snyk.io/)
2. Go to your account settings
3. Copy your API token
4. Add it as `SNYK_TOKEN` in GitHub secrets

## Workflow Overview

### 1. CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

This workflow runs on:
- **Push** to main/master/develop branches
- **Pull requests** to main/master
- **Releases** (for publishing)

**Jobs:**
- **Test**: Runs tests on Node.js 16.x, 18.x, and 20.x
- **Build**: Creates build artifacts (only on releases)
- **Publish**: Publishes to NPM (only on releases)

### 2. Security Checks (`.github/workflows/security.yml`)

This workflow runs:
- **Weekly** (Sundays at 00:00 UTC)
- **On push/PR** to main/master

**Jobs:**
- **Security Audit**: Runs `npm audit`
- **Dependency Check**: Uses Snyk for vulnerability scanning
- **CodeQL Analysis**: GitHub's code analysis

### 3. Release Management (`.github/workflows/release.yml`)

This is a **manual workflow** that:
- Bumps version numbers
- Creates Git tags
- Generates changelogs
- Creates GitHub releases

## How to Use

### Publishing a New Version

#### Method 1: Using GitHub UI (Recommended)

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Release Management" workflow
4. Click "Run workflow"
5. Choose:
   - **Version type**: patch/minor/major/prerelease
   - **Prerelease**: Check if this is a beta/alpha release
6. Click "Run workflow"

This will:
- Run tests and build
- Bump version in `package.json`
- Create a git tag
- Create a GitHub release
- Trigger the CI/CD pipeline to publish to NPM

#### Method 2: Manual Release

1. Create a git tag manually:
   ```bash
   git tag v3.1.1
   git push origin v3.1.1
   ```

2. Create a GitHub release from this tag

3. The CI/CD pipeline will automatically publish to NPM

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "feat: add new technical indicator"
   ```

3. **Push and create PR**:
   ```bash
   git push origin feature/my-new-feature
   ```

4. **Create a Pull Request** on GitHub

5. **CI will run automatically** on your PR:
   - Tests on multiple Node.js versions
   - Security checks
   - Build verification

6. **Merge PR** after approval and successful CI

## Package Information

- **Package Name**: `@thuantan2060/technicalindicators`
- **Scope**: `@thuantan2060`
- **Registry**: npm public registry
- **Access**: Public (configured in `package.json`)

## Installation for Users

Once published, users can install your package:

```bash
# Latest version
npm install @thuantan2060/technicalindicators

# Specific version
npm install @thuantan2060/technicalindicators@3.1.0

# Using yarn
yarn add @thuantan2060/technicalindicators
```

## Usage Example

```javascript
// ES6 imports
import { SMA, RSI, MACD } from '@thuantan2060/technicalindicators';

// CommonJS
const { SMA, RSI, MACD } = require('@thuantan2060/technicalindicators');

// Calculate Simple Moving Average
const sma = SMA.calculate({
  period: 10,
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
});

console.log(sma); // [5.5, 6.5, 7.5]
```

## Troubleshooting

### Build Failures

1. **System Dependencies**: The project requires Cairo libraries for canvas rendering:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
   
   # macOS
   brew install cairo pango libpng jpeg giflib librsvg
   ```

2. **Node Version**: Ensure you're using Node.js 16.x or higher

3. **NPM Cache**: Clear npm cache if you encounter installation issues:
   ```bash
   npm cache clean --force
   ```

### Publishing Issues

1. **NPM Token**: Ensure your NPM token is valid and has publish permissions
2. **Version Conflicts**: Make sure you're not trying to publish a version that already exists
3. **Scope Permissions**: Ensure your NPM account has permission to publish to the `@thuantan2060` scope

### Security Warnings

1. **Dependency Vulnerabilities**: Run `npm audit fix` to automatically fix issues
2. **Outdated Dependencies**: Use `npm update` to update dependencies

## Monitoring

- **GitHub Actions**: Monitor workflow runs in the Actions tab
- **NPM Downloads**: Check package statistics on npmjs.com
- **Security Alerts**: GitHub will create issues for security vulnerabilities

## Support

If you encounter issues with the CI/CD pipeline:
1. Check the GitHub Actions logs
2. Verify all required secrets are set
3. Ensure your NPM token has correct permissions
4. Check that your GitHub repository settings allow Actions to run

For technical indicator issues, refer to the main README.md file. 