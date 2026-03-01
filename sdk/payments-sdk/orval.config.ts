import { defineConfig } from "orval";

export default defineConfig({
  "payments": {
    "input": {
      "target": "swagger-spec.json"
    },
    "output": {
      "target": "client.ts",
      "workspace": "src/payments",
      "schemas": "model",
      "mode": "split",
      "client": "fetch",
      "httpClient": "fetch",
      "baseUrl": "http://localhost:3002",
      "mock": false,
      "prettier": true,
      "clean": true
    }
  }
});
