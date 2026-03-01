import { defineConfig } from "orval";

export default defineConfig({
  "users": {
    "input": {
      "target": "swagger-spec.json"
    },
    "output": {
      "target": "client.ts",
      "workspace": "src/users",
      "schemas": "model",
      "mode": "split",
      "client": "fetch",
      "httpClient": "fetch",
      "baseUrl": "http://localhost:3001",
      "mock": false,
      "prettier": true,
      "clean": true
    }
  }
});
