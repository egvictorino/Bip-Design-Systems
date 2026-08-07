#!/usr/bin/env bash
# Runs the visual regression suite (packages/ui-components/visual/) inside the exact
# Playwright Docker image CI uses, so local runs and CI produce byte-identical
# screenshots regardless of host OS (macOS/Apple Silicon included, via --platform).
#
# The image tag is pinned to the @playwright/test version in
# packages/ui-components/package.json — bump both together, never independently
# (a version drift here is exactly the kind of silent failure this script exists
# to prevent).
#
# Usage:
#   ./scripts/visual-docker.sh                     # verify against committed baselines
#   ./scripts/visual-docker.sh --update-snapshots   # regenerate baselines
#   ./scripts/visual-docker.sh -g "RTL"             # any playwright test CLI flag passes through
set -euo pipefail

PLAYWRIGHT_VERSION="1.62.1"
IMAGE="mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-jammy"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

INSTALLED_VERSION=$(node -p "require('$REPO_ROOT/packages/ui-components/package.json').devDependencies['@playwright/test']" 2>/dev/null || echo "")
if [ "$INSTALLED_VERSION" != "$PLAYWRIGHT_VERSION" ]; then
  echo "⚠️  This script is pinned to Playwright ${PLAYWRIGHT_VERSION} but package.json declares ${INSTALLED_VERSION:-<not found>}." >&2
  echo "    Update PLAYWRIGHT_VERSION in scripts/visual-docker.sh to match before continuing." >&2
  exit 1
fi

echo "▶ Running visual regression in ${IMAGE} (linux/amd64)…"

docker run --rm \
  --platform linux/amd64 \
  -v "${REPO_ROOT}:/work" \
  -v /work/node_modules \
  -v /work/packages/ui-components/node_modules \
  -v /work/packages/shared-utils/node_modules \
  -w /work \
  -e CI=true \
  "$IMAGE" \
  bash -c "
    set -e
    corepack enable
    corepack prepare pnpm@9.15.9 --activate
    pnpm install --frozen-lockfile
    pnpm --filter @bip-design-systems/shared-utils build
    cd packages/ui-components
    pnpm exec playwright test --config=playwright.visual.config.ts $*
  "
