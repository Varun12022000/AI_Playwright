AI-Driven Playwright Test Automation Framework
An end-to-end web testing automation framework leveraging Playwright Test Agents (Planner, Generator, and Healer) and GitHub Copilot within VS Code to autonomously plan, generate, and maintain robust test scripts in TypeScript.

Features
🧠 AI Test Planner: Automatically explores target application UIs to discover test workflows and generate structured Markdown test plans.

⚡ Automated Test Generator: Converts test plans into clean, maintainable TypeScript test scripts following the Page Object Model (POM).

🩹 Self-Healing Test Engine: Detects test execution failures, analyzes broken selectors or UI changes, and dynamically repairs scripts to ensure long-term stability.

🔄 CI/CD Ready: Integrates with GitHub Actions and Model Context Protocol (MCP) servers for continuous automated regression testing.

Tech Stack
Language: TypeScript

Testing Framework: Playwright

AI Integration: GitHub Copilot / Playwright Test Agents

Environment: Visual Studio Code (VS Code)

Project Structure
Plaintext
├── .github/
│   └── agents/           # Playwright Test Agent configurations
├── tests/                # Playwright test scripts
├── pages/                # Page Object Model classes
├── playwright.config.ts  # Playwright configuration file
└── package.json          # Project dependencies and scripts
Getting Started
Prerequisites
Node.js installed on your machine

Visual Studio Code

GitHub Copilot extension configured and authenticated in VS Code

Installation & Setup
Clone the repository:

Bash
git clone https://github.com/Varun12022000/AI_Playwright.git
cd your-repo-name
Install dependencies:

Bash
npm install
Initialize Playwright Test Agents:

Bash
npx playwright init --agents
Running Tests
Run all tests:

Bash
npx playwright test
Run tests with UI mode:

Bash
npx playwright test --ui
