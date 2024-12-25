# Contributing to VSCode Pretty Home

Thank you for considering contributing to **VSCode Pretty Home**! We value your contributions and aim to make the process as seamless as possible.

## Getting Started

1. **Fork the Repository**: Start by forking the repository to your GitHub account.
2. **Clone the Repository**: Clone your fork to your local machine:
   ```bash
   git clone https://github.com/<your-username>/vscode-pretty-home.git
   cd vscode-pretty-home
   ```
3. **Set Up the Environment**:
   - Ensure you have Node.js installed.
   - Run `npm install` to install dependencies.
4. **Run the Extension**:
   - Open the project in VSCode.
   - Press `F5` to launch the extension in the VSCode development host.

## Contribution Workflow

1. **Create a Branch**:
   - Create a feature or bugfix branch:
     ```bash
     git checkout -b feature/your-feature-name
     ```
2. **Make Your Changes**:
   - Follow the code style and conventions used in the project.
   - Test your changes thoroughly.
3. **Commit Your Changes**:
   - Write meaningful commit messages:
     ```bash
     git commit -m "feat: add your feature description"
     ```
4. **Push Your Changes**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request (PR)**:
   - Go to your fork on GitHub and click on `Compare & Pull Request`.
   - Fill out the PR template provided (see below).

## Pull Request Guidelines

- **Base Branch**: Always create PRs targeting the `master` branch.
- **Descriptive Titles**: Use concise and descriptive titles for PRs.
- **Explain Your Changes**: Provide a clear description of the changes in the PR description.
- **Lint Your Code**: Ensure your code adheres to the project’s linting standards:
  ```bash
  npm run lint
  ```
- **Add Tests** (if applicable): Include tests for new features or bug fixes.

## PR Template

When creating a pull request, use the following template:

```markdown
## Description

Describe the changes made in this PR.

## Related Issues

List any related issues (e.g., Fixes #123).

## Checklist

- [ ] Code adheres to the project's coding standards.
- [ ] Linting and testing completed successfully.
- [ ] New or modified functionality is documented.
- [ ] Relevant tests are added or updated.

## Screenshots (if applicable)

Provide screenshots or videos if your changes include UI updates.
```

## Reporting Issues

If you encounter bugs or have feature requests, please [open an issue](https://github.com/sefatanam/vscode-pretty-home/issues).

## Code of Conduct

By contributing to this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

Thank you for helping make **VSCode Pretty Home** better for everyone! If you have any questions, feel free to reach out via [Discussions](https://github.com/sefatanam/vscode-pretty-home/discussions).

