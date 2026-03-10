# genxapi-ecosystem-payments-sdk

This package contains generated API clients produced by `@genxapi/cli` using the Orval toolchain.

## Clients

| Client | OpenAPI Source | Base URL | Description |
| ------ | -------------- | -------- | ----------- |
| payments | [Payments Service](./docs/contracts/payments-service/latest.json) |  | Payments service API for the genxapi ecosystem demo. Protected routes use a demo HS256 bearer JWT. customer can read only /me/payments. support and admin can read internal /payments routes and user payment lookups. |

## Usage

Install dependencies and regenerate clients:

```bash
npm install
npm run generate-clients
```

The generated Orval configuration is available at `orval.config.ts`.

