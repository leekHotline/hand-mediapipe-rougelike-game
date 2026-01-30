# Contributing to Hand MediaPipe Roguelike Game

First off, thank you for considering contributing to Hand MediaPipe Roguelike Game! 🎉 It's people like you that make this project such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include screenshots or animated GIFs if possible**
- **Include your environment details** (OS, browser, webcam model, etc.)

#### Bug Report Template

```markdown
**Description:**
A clear description of what the bug is.

**Steps to Reproduce:**
1. Go to '...'
2. Make gesture '...'
3. See error

**Expected Behavior:**
What you expected to happen.

**Actual Behavior:**
What actually happened.

**Environment:**
- OS: [e.g., Windows 10, macOS 12.0, Ubuntu 20.04]
- Browser: [e.g., Chrome 96, Firefox 94]
- Webcam: [e.g., Built-in, Logitech C920]
- Lighting Conditions: [e.g., Good, Poor, Artificial]

**Screenshots:**
If applicable, add screenshots to help explain the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

#### Enhancement Template

```markdown
**Feature Description:**
A clear description of the feature you'd like to see.

**Use Case:**
Describe the problem this feature would solve.

**Proposed Solution:**
How you think this could be implemented.

**Alternatives Considered:**
Other solutions you've thought about.

**Additional Context:**
Any other context, screenshots, or examples.
```

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our style guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write meaningful commit messages**
6. **Submit a pull request** with a clear description

#### Pull Request Guidelines

- Follow the existing code style
- Write clear, concise commit messages
- Include tests for new features
- Update documentation as needed
- Link related issues in the PR description
- Keep PRs focused - one feature/fix per PR

## Development Setup

### Prerequisites

- Python 3.7+ or Node.js 14+
- Git
- Webcam for testing
- Virtual environment (recommended)

### Setup Steps

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/hand-mediapipe-rougelike-game.git
   cd hand-mediapipe-rougelike-game
   ```

2. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   
   For Python:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   pip install -r requirements-dev.txt  # Development dependencies
   ```
   
   For JavaScript:
   ```bash
   npm install
   ```

4. **Run tests**
   ```bash
   # Python
   pytest
   
   # JavaScript
   npm test
   ```

5. **Start development server**
   ```bash
   # Python
   python main.py --debug
   
   # JavaScript
   npm run dev
   ```

## Style Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

Examples:
```
Add hand gesture calibration feature

- Implement gesture training mode
- Add visual feedback for gesture detection
- Update documentation

Fixes #123
```

### Python Style Guide

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Use 4 spaces for indentation
- Maximum line length of 100 characters
- Use meaningful variable names
- Add docstrings to all functions and classes

### JavaScript Style Guide

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use 2 spaces for indentation
- Use semicolons
- Use ES6+ features when appropriate
- Add JSDoc comments for functions

### Documentation Style

- Use Markdown for all documentation
- Keep line length under 100 characters
- Use clear, concise language
- Include code examples where appropriate
- Add screenshots or GIFs for visual features

## Testing Guidelines

### Unit Tests

- Write tests for all new features
- Maintain or improve code coverage
- Use descriptive test names
- Test edge cases and error conditions

### Integration Tests

- Test gesture recognition accuracy
- Test game mechanics interactions
- Test cross-browser compatibility

### Manual Testing Checklist

Before submitting a PR, test:
- [ ] Gesture recognition in different lighting conditions
- [ ] Game performance with various hardware
- [ ] All game mechanics work as expected
- [ ] No console errors
- [ ] Documentation is up to date

## Areas to Contribute

Here are some areas where contributions are especially welcome:

### 🎨 Game Design
- New enemy types and behaviors
- Level generation algorithms
- Item and power-up designs
- Visual effects and animations

### 🤚 Gesture Recognition
- Improve detection accuracy
- Add new gesture patterns
- Optimize performance
- Support for two-hand gestures

### 🎮 Game Mechanics
- Combat system enhancements
- Inventory management
- Character progression
- Difficulty balancing

### 📚 Documentation
- Tutorial improvements
- API documentation
- Code examples
- Translation to other languages

### 🐛 Bug Fixes
- Fix reported issues
- Improve error handling
- Performance optimizations

### 🧪 Testing
- Write unit tests
- Integration tests
- Cross-browser testing
- Accessibility testing

## Community

- Join discussions in GitHub Issues
- Share your feedback and ideas
- Help other contributors
- Spread the word about the project

## Recognition

Contributors will be recognized in:
- README.md acknowledgments section
- Release notes
- Project documentation

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

---

Thank you for contributing! 🎮✨
