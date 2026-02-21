# DEF Corp Website Baseline (GOLDEN STATE)

## Status: STABLE & VERIFIED
**Last Updated:** 2026-02-16
**Version:** 1.2.0 (Consolidated JS Engine)

## Overview
The DEF Corp website (defcorp.xyz) has been fully refactored to resolve critical interactivity bugs, syntax errors, and scoping issues. The codebase is now in a "Golden State" and should not be modified without explicit functional requirements.

## Key Architecture Decisions
1. **Unified Scripting**: All JavaScript is consolidated into a single IIFE block at the end of the `<body>`.
2. **Explicit Global Exports**: Interactive functions (`toggleDarkMode`, `toggleChat`, `toggleLoginModal`) are explicitly attached to the `window` object for HTML handler compatibility.
3. **Vanilla Integration**: Uses Tailwind CSS (CDN), Material Icons, and Google Fonts (Outfit/Syne) without build steps.
4. **Security**: `config.js` contains client-side API keys and is excluded from git tracking.

## Core Functionality Checklist
- [x] **Dark Mode**: High-contrast dark/light toggle with local storage persistence.
- [x] **AI Chatbot**: Gemini 2.5 Flash powered widget with auto-focus and suggested prompts.
- [x] **Client Portal**: Firebase Auth modal for Google and Email/Password sign-in.
- [x] **Smooth Scroll**: Navigation links work for all sections.
- [x] **Responsive**: Mobile menu verified via `mobileBtn` toggle.

## Maintenance Notes
- **Hosting**: GitHub Pages (Main branch).
- **Git Repo**: alexshark23/defcorp-website.
- **Critical File**: `index.html` (Lines 2160+ contain the core logic).
