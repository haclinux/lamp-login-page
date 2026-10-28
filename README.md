# Afterglow — Lamp Login Page

A responsive lamp-themed login page made with plain HTML, CSS, and JavaScript. No framework or build tools are required.

## Run it in VS Code

1. Extract `lamp-login-vscode.zip`.
2. Open the extracted `lamp-login-vscode` folder in VS Code.
3. Open `index.html` in your browser.

**Recommended:** Install the **Live Server** extension in VS Code, right-click `index.html`, and choose **Open with Live Server**.

## Interactions included

- Pull the lamp's small physical switch down to reveal the login interface; pull it again to dim and hide it. Keyboard users can focus the switch and press Enter or Space.
- Switch between sign-in and account-creation forms without reloading.
- Show/hide passwords and validate required fields, email addresses, password length, and confirmation.
- Remember-me is a visual checkbox and does not persist data.
- Google/GitHub buttons open clearly labeled, local demo account choosers with sample `.test` profiles.
- Toast messages explain where secure sign-in, registration, password reset, and help integrations belong.
- Responsive layout for desktop and mobile.
- Animated fireflies, warm ambient lighting, and reduced-motion support.

## Important

This project contains only the front-end. It validates form input but does **not** create accounts, save passwords, or authenticate users. The Google/GitHub-style account choosers are local visual demos, not official provider interfaces; their sample profiles cannot sign in and no password is requested. Real provider sign-in requires a secure backend and OAuth configuration.

The page loads Google Fonts from the internet; fallback system fonts are included.
