# Contribution Guidelines

- [Українська версія](../CONTRIBUTING.md)

Thank you for wanting to contribute to our project!  
To ensure smooth collaboration, please follow the rules and recommendations outlined below.

---

## Prerequisites

Before you start working, please make sure that you:
- Are familiar with Git and GitFlow basics
- Can run the project locally and run tests
- Are familiar with the code style guidelines
- Use the latest stable version of Node.js and npm/yarn

## 1. Git Strategy

We use **GitFlow** as the main branching model:

- `main` — stable production version  
- `develop` — main integration branch  
- `feature/name` — new functionality  
- `bugfix/name` — bug fixes  
- `hotfix/name` — urgent production fixes  
- `docs/name` — documentation changes only

### Branch Naming

- Use lowercase letters and hyphens, for example: `feature/quiz-builder`, `bugfix/fix-login-error`
- Avoid spaces, special characters, and long names

### Example of creating a branch:

```bash
git checkout develop
git pull
git checkout -b feature/quiz-builder
```

---

## 2. Pull Requests (PRs)

After finishing your feature, create a pull request **to the `develop` branch**, not to `main`.

### PR Review

- Each pull request must be reviewed by at least one team member
- Before merging, the PR must pass all tests and have no conflicts
- Discussions on PRs should happen in comments; all important decisions must be documented

### What the PR should include:
- A brief description of the changes made
- A link or the name of the related issue/task
- A clear explanation of how the changes affect functionality
- A designation of the type of changes (new feature, bug fix, documentation changes, etc.)

### Before creating a PR, make sure to:
- [ ] Check your code for syntax errors
- [ ] Ensure all tests pass
- [ ] Verify there are no conflicts with `develop`
- [ ] Update relevant documentation if needed

### Mandatory Pull Request Template

Please use a template for describing changes (create a `.github/pull_request_template.md` file) that should include:

- A brief summary of the changes
- Link to the related issue or task
- Type of changes (feature, fix, docs, etc.)
- Step-by-step instructions to verify the changes (if necessary)
- Screenshots or logs (if needed)

> Note: We expect detailed and well-structured pull requests. This will speed up their review and reduce the need for revisions.


---

## 3. Commit Naming

To ensure clear commit history and enable automatic changelog generation, follow a standardized commit message format.

### Format

Use the following types:

- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation changes
- `style` — code formatting, whitespace, missing semicolons, etc.
- `refactor` — code refactoring without changing functionality
- `test` — adding or modifying tests
- `chore` — maintenance tasks (e.g. dependency updates, config changes)

### Examples

- feat: add soft skills test component  
- fix: resolve crash when submitting answers  
- docs: update README with setup instructions  
- style: unify CSS formatting across components

> Keep your commits short, informative, and focused on a single change.

---

## 4. Code Style

- **JavaScript/React**: Follow [ESLint](https://eslint.org/) rules to ensure consistent and clean code.
- **CSS**: You may use plain CSS, CSS Modules, or Tailwind CSS – pick the approach that fits your task and team.
- **Naming conventions**: Use English for all variable and component names, using camelCase for variables and PascalCase for components.
- **Avoid magic numbers**: Replace unexplained numeric values with named constants where appropriate.
- **Comment when needed**: Add comments if they clarify complex logic or non-obvious parts of the code.
- **Clean & readable**: Write code that others can easily read, understand, and maintain.

---

## 5. Documentation

- Whenever you add new functionality, update the corresponding `.md` files located in `READMEFILES/ua/` or `READMEFILES/eng/`.
- Each new component should be briefly documented with its purpose and how it works (when needed).
- All documentation-related changes should be made in a dedicated branch: `docs/your-description`.

---

## 6. Communication

- For general questions or task discussion, contact us via email: [a.petrykovych@gmail.com](mailto:a.petrykovych@gmail.com)
- All pull requests must clearly explain what changes were made and why.
- For urgent issues, contact the responsible developer or project lead directly.







