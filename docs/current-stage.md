# Current Stage Guide

This document explains the repository as it exists today and how to evaluate it as an example `genxapi.dev` project.

## Purpose

The goal of this repository is to show a realistic local feedback loop around `genxapi`:

1. backend services define and expose contracts
2. `genxapi` turns those contracts into SDKs
3. a consumer application uses the generated SDKs
4. Nx coordinates the workflow so the whole system can run locally

This is intentionally more useful than a generator-only example because it shows where `genxapi` sits in a real developer workflow.

## What The Example Covers Today

The current demo includes:

- `users-service`
  - NestJS service exposing users endpoints and Swagger
- `payments-service`
  - NestJS service exposing payments endpoints and Swagger
- `users-sdk`
  - generated from the users Swagger contract
- `payments-sdk`
  - generated from the payments Swagger contract
- `web-app`
  - React consumer that uses the generated SDKs to render a real UI

The current demo does not yet include:

- `backoffice-app` wired to the generated SDKs
- `mobile-app` wired to the generated SDKs
- broader examples like version negotiation, publish promotion, or multiple environments

That is deliberate. The current stage proves the main loop first.

## Core Logic And Reasoning

### Why `genxapi` Is Central

The repo is meant to demonstrate `genxapi`, not to hide it behind generic monorepo tooling.

That is why SDK generation is still owned by `genxapi` itself:

- each SDK has a `genxapi` config
- each config uses `beforeGenerate`
- `beforeGenerate` refreshes the relevant Swagger JSON before generation

This matters because the value being demonstrated is not only "we can run commands in order". The value is that `genxapi` can own the contract-to-SDK workflow.

### Why Nx Is Still Important

Nx is used as the workspace orchestrator:

- it defines projects and targets
- it wires the consumer app to SDK generation
- it provides a single local command for the end-to-end demo

This is a good boundary:

- `genxapi` owns SDK generation behavior
- Nx owns local developer orchestration

### Why Local SDK Dependencies Are Used

The root workspace depends on:

- `@genxapi/ecosystem-users-sdk` via `file:sdk/users-sdk`
- `genxapi-ecosystem-payments-sdk` via `file:sdk/payments-sdk`

That choice keeps the repository self-contained. Someone trying the demo does not need published packages in a registry to make the local flow work.

## How The Current Flow Works

When you run:

```bash
npm run serve:demo
```

the system behaves like this:

1. Nx starts the local demo projects.
2. `web-app` depends on the SDK generate targets.
3. each SDK target runs `genxapi generate`
4. `genxapi` executes `beforeGenerate`
5. `beforeGenerate` refreshes Swagger via the Nx Swagger export targets
6. `genxapi` generates the SDK output
7. `web-app` starts and consumes the generated SDK packages

That gives you a concrete local story:

- service contracts exist
- SDKs are regenerated from those contracts
- a consumer uses the output

## How To Try The Example

Recommended:

- Node.js `20+`

Install dependencies:

```bash
npm install
```

Run the integrated demo:

```bash
npm run serve:demo
```

Open:

- `http://localhost:4200`
- `http://localhost:3001/swagger`
- `http://localhost:3002/swagger`

Suggested walkthrough:

1. Open the dashboard in `web-app` and confirm both services report healthy.
2. Open the users page and navigate into a specific user.
3. Confirm that user details and user payments are composed from the two service domains.
4. Open the payments page and explore filtering.
5. Visit both Swagger UIs to connect the UI behavior back to the contracts.

## Commands You Will Likely Use

Run the full local demo:

```bash
npm run serve:demo
```

Regenerate both SDKs:

```bash
npm run gen:sdks
```

Run only the currently integrated path:

```bash
nx serve users-service
nx serve payments-service
nx serve web-app
```

Inspect the project graph:

```bash
nx graph
```

## What Someone Evaluating `genxapi.dev` Should Notice

- The SDKs are not mocked or manually written.
- The consumer app imports the generated SDK packages directly.
- `genxapi` still owns the SDK generation workflow through its config and hooks.
- Nx adds local orchestration but does not replace the role of `genxapi`.
- The example is runnable on a laptop without needing a package publish step first.

That makes this repository a useful example for teams evaluating whether `genxapi` can fit into an existing monorepo or multi-service workflow.

## Current Limitations

- Only `web-app` is integrated with the generated SDKs right now.
- The repository currently shows a local-first workflow more strongly than a publish/promote workflow.
- Development mode in React can show canceled first requests because of React Strict Mode remounting.
- The current dependency set is happiest on Node `20+`.

## What A Next Stage Could Add

- integrate `backoffice-app` with the same generated SDKs
- integrate `mobile-app`
- demonstrate environment-specific base URLs
- demonstrate SDK publishing as a separate stage after local validation
- show how contract changes propagate through the whole loop
