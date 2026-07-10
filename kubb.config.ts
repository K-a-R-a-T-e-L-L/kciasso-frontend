import { defineConfig } from "kubb";
import { pluginClient } from "@kubb/plugin-client";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";
import { configDotenv } from "dotenv";

configDotenv({ path: ".env.local", override: false });
configDotenv({ path: ".env", override: false });

const schemaUrl = process.env.OPENAPI_SCHEMA_URL || "http://localhost:3000/api/docs-json";

export default defineConfig({
  input: {
    path: schemaUrl,
  },
  output: {
    path: "./src/shared/api/generated",
    clean: true,
    extension: {
      ".ts": "",
    },
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: {
        path: "./types",
        barrelType: "named",
      },
    }),
    pluginClient({
      output: {
        path: "./clients",
        barrelType: "named",
      },
      group: {
        type: "tag",
      },
      operations: true,
      pathParamsType: "inline",
      paramsType: "inline",
      dataReturnType: "data",
      importPath: "@/shared/api/client",
    }),
  ],
});
