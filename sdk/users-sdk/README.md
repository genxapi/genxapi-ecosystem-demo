# @genxapi/ecosystem-users-sdk

This package contains generated API clients produced by `@genxapi/cli` using the Orval toolchain.

## Clients

| Client | OpenAPI Source | Base URL | Description |
| ------ | -------------- | -------- | ----------- |
| users | [Users Service](./docs/contracts/users-service/latest.json) |  | Users service API for the genxapi ecosystem demo. Protected routes use a demo HS256 bearer JWT. customer can read only /me. support and admin can read the internal /users routes. |

## Usage

Install dependencies and regenerate clients:

```bash
npm install
npm run generate-clients
```

The generated Orval configuration is available at `orval.config.ts`.

