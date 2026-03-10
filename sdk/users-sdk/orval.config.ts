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
      "baseUrl": "",
      "mock": false,
      "prettier": true,
      "clean": true,
      "override": {
        "mutator": {
          "path": "../runtime.ts",
          "name": "sdkFetch"
        }
      }
    }
  }
});
