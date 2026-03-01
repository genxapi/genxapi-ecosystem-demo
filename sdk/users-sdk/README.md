# @genxapi/ecosystem-users-sdk

This package contains generated API clients produced by `@genxapi/cli` using the Orval toolchain.

## Clients

| Client | OpenAPI Source | Base URL | Description |
| ------ | -------------- | -------- | ----------- |
| users | [Users Service](./docs/swagger/users-service.json) | http://localhost:3001 | Users service API for the genxapi ecosystem demo |

## Usage

Install dependencies and regenerate clients:

```bash
npm install
npm run generate-clients
```

The generated Orval configuration is available at `orval.config.ts`.

