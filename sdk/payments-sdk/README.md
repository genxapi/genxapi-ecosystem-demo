# genxapi-ecosystem-payments-sdk

This package contains generated API clients produced by `@genxapi/cli` using the Orval toolchain.

## Clients

| Client | OpenAPI Source | Base URL | Description |
| ------ | -------------- | -------- | ----------- |
| payments | [Payments Service](./docs/contracts/payments-service/latest.json) | http://localhost:3002 | Payments service API for the genxapi ecosystem demo |

## Usage

Install dependencies and regenerate clients:

```bash
npm install
npm run generate-clients
```

The generated Orval configuration is available at `orval.config.ts`.

