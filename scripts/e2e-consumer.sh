#!/usr/bin/env bash
# Builds ui-components, packs it into a real tarball (not a pnpm workspace link), installs
# that tarball into e2e/consumer-app as an independent, non-workspace project, builds that
# app with Vite, serves the static output, and runs e2e/consumer.spec.ts against it.
#
# This exists because a workspace link (the usual `pnpm --filter` dev loop) can't catch bugs
# in what actually ships — package.json's `exports`/`files` fields, whether dist/style.css is
# really in the tarball, whether the ESM-only build resolves outside the monorepo. That
# exact class of bug already happened once (see `hotfix/design-tokens-not-bundled` in git
# history) with nothing to catch it before a consumer did.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONSUMER_DIR="${REPO_ROOT}/e2e/consumer-app"
VENDOR_DIR="${CONSUMER_DIR}/vendor"
PREVIEW_PORT=4173
PREVIEW_PID=""

cleanup() {
  if [ -n "$PREVIEW_PID" ] && kill -0 "$PREVIEW_PID" 2>/dev/null; then
    kill "$PREVIEW_PID" 2>/dev/null || true
    wait "$PREVIEW_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "▶ Building @bip-design-systems/ui-components…"
pnpm --filter @bip-design-systems/shared-utils build
pnpm --filter @bip-design-systems/ui-components build

echo "▶ Packing the tarball…"
rm -rf "$VENDOR_DIR"
mkdir -p "$VENDOR_DIR"
# `pnpm --filter X pack` fails ("Unknown option: 'recursive'") — --filter puts pnpm in
# recursive mode, which `pack` doesn't support. Run it from inside the package instead.
PACK_JSON=$(cd "${REPO_ROOT}/packages/ui-components" && pnpm pack --pack-destination "$VENDOR_DIR" --json)
TARBALL_PATH=$(node -p "JSON.parse(process.argv[1]).filename" "$PACK_JSON")
mv "$TARBALL_PATH" "${VENDOR_DIR}/ui-components.tgz"

echo "▶ Installing the tarball into e2e/consumer-app (independent project, not a workspace link)…"
cd "$CONSUMER_DIR"
rm -rf node_modules dist pnpm-lock.yaml
pnpm install --no-frozen-lockfile

echo "▶ Building the consumer app…"
pnpm run build

echo "▶ Serving the built app on :${PREVIEW_PORT}…"
pnpm run preview &
PREVIEW_PID=$!

for i in $(seq 1 30); do
  if curl -sf "http://localhost:${PREVIEW_PORT}" -o /dev/null 2>/dev/null; then
    break
  fi
  sleep 1
done

echo "▶ Running the e2e smoke test…"
cd "$REPO_ROOT"
pnpm exec playwright test --config=e2e/playwright.e2e.config.ts "$@"
