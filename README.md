# Personal Expense Tracker API

A secure, well-structured Node.js REST API providing personal transaction ledger tracking with data-level validation and complete user insulation features.

## Architecture & Tech Stack Justification

- **Node.js & Express.js**: Lightweight runtime providing high performance for standard I/O bound application endpoints.
- **MongoDB & Mongoose**: Perfect choice for document handling layouts where application filtering, category strings, and analytic data mapping can change schemas seamlessly over execution.
- **JWT Authentication**: Keeps our requests completely stateless without sacrificing strict multi-tenant route protection rules.

## Local Configuration Setup Instructions

1. Clone this repository locally.
2. Install missing packages run: `npm install`
3. Clone `.env.example` to a new custom local `.env` configuration file.
4. Start your local environment database engine, then execute: `npm run dev`

## Live Target Endpoints

- **Application Deployment Base Link**: `https://your-deployed-app.railway.app`
- **Swagger Documentation Hub UI**: `https://your-deployed-app.railway.app/docs`
