# ProcureWatch Frontend

React-based frontend for the ProcureWatch system — a platform for analyzing 
public procurement data and detecting suspicious patterns.

## About

ProcureWatch helps analysts and auditors identify high-risk procurement contracts
by combining rule-based risk scoring, lifecycle tracking, and AI-generated explanations.

## Features

- **Dashboard** — Overview of procurement data with KPIs and trends
- **High Risk Queue** — Working list of flagged contracts sorted by priority
- **Contract Detail** — Full analysis with Risk Score, Triggered Flags, Lifecycle timeline and AI Explanation
- **Contracts** — Advanced search and filtering
- **Institutions** — Contracting authorities with plans, notices and contracts
- **Risk Analysis** — Run and manage risk assessments

## Tech Stack

- React + Vite
- JavaScript 
- REST API integration with Spring Boot backend

## Getting Started

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` and connects to the backend at `http://localhost:8080`.
