# Contributing to OKVE

Thank you for your interest in contributing to OKVE! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Code of Conduct

Please be respectful and considerate in all interactions. We expect contributors to be kind and constructive.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/OKVE.git
   cd OKVE
   ```
3. **Add the upstream remote** so you can pull in future changes:
   ```bash
   git remote add upstream https://github.com/Biki-dev/OKVE.git
   ```

## Development Setup

This is an npm workspaces monorepo. Install dependencies from the root:

```bash
npm install
```

Build all packages and the demo:

```bash
npm run build
```

### Project Structure

```
packages/
  okve/        # The @biki-dev/okve component library
demo/          # Demo application
docs/          # Documentation assets
```

## Making Changes

1. **Create a new branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
2. Make your changes in the relevant package(s).
3. Ensure the project **builds without errors**:
   ```bash
   npm run build
   ```
4. Update documentation (README, JSDoc, etc.) if your change affects the public API or component props.
5. Update `CHANGELOG.md` with a brief description of your change under an `Unreleased` section.

## Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a **Pull Request** against the `main` branch of `Biki-dev/OKVE`.
3. Fill in the PR template completely.
4. Link any related issues using keywords like `Closes #<issue-number>`.
5. Wait for a review. Address any requested changes promptly.

## Reporting Bugs

Use the **Bug Report** issue template and include:
- A clear description of the problem.
- Steps to reproduce.
- Expected vs. actual behaviour.
- Your environment (browser, Node version, `@biki-dev/okve` version).

## Requesting Features

Use the **Feature Request** issue template and include:
- The problem you are trying to solve.
- A description of your proposed solution.
- Any alternatives you considered.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
