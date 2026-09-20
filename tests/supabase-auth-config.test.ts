import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

test("local Supabase enables bounded Solana Web3 Auth on the canonical route", () => {
  const config = read("supabase/config.toml");
  assert.match(config, /site_url = "http:\/\/localhost:3100"/);
  assert.match(
    config,
    /additional_redirect_urls = \["http:\/\/localhost:3100\/sign-in"\]/,
  );
  assert.match(config, /web3 = 30/);
  assert.match(config, /\[auth\.web3\.solana\]\nenabled = true/);
  assert.doesNotMatch(config, /\[auth\.captcha\]\nenabled = true/);
});

test("database-only and Auth-enabled local startup remain separate", () => {
  const packageJson = JSON.parse(read("package.json")) as {
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
  };

  assert.match(packageJson.scripts["db:start"], /gotrue/);
  assert.doesNotMatch(packageJson.scripts["auth:start"], /gotrue/);
  assert.doesNotMatch(packageJson.scripts["auth:start"], /kong/);
  assert.match(packageJson.scripts["auth:status"], /API_URL\|ANON_KEY/);
  assert.doesNotMatch(packageJson.scripts["auth:status"], /SERVICE_ROLE/);
  assert.equal(packageJson.dependencies["@supabase/supabase-js"], "2.116.0");
  assert.equal(packageJson.dependencies["@supabase/ssr"], "0.12.7");
});

test("server Auth verifies claims and never promotes editable metadata", () => {
  const session = read("src/server/auth/session.ts");
  const proxy = read("src/server/auth/proxy.ts");

  assert.match(session, /auth\.getClaims\(\)/);
  assert.match(session, /auth\.getUser\(\)/);
  assert.match(proxy, /auth\.getClaims\(\)/);
  assert.doesNotMatch(session, /getSession\(/);
  assert.doesNotMatch(proxy, /getSession\(/);
  assert.doesNotMatch(session, /user_metadata|app_metadata/);
});
