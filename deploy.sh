#!/bin/zsh
# Deploy the portfolio to Cloudflare Pages (https://bhaskarjgoswami.pages.dev)
# Auth comes from wrangler's saved OAuth login - no secrets stored in this file.
# If it fails with a 401/auth error, run: npx wrangler login
set -e
cd "$(dirname "$0")"

export CLOUDFLARE_ACCOUNT_ID=8c992f68d84a2a5f5d7372d1bddf06c3
TOKEN=$(grep '^oauth_token' ~/Library/Preferences/.wrangler/config/default.toml | cut -d'"' -f2)
if [ -n "$TOKEN" ]; then
  export CLOUDFLARE_API_TOKEN=$TOKEN
fi

# Cloudflare Pages rejects files over 25 MiB - fail early with a clear message
BIG=$(find . -type f -size +25M -not -path "./.git/*")
if [ -n "$BIG" ]; then
  echo "These files exceed Cloudflare's 25MB limit - move them out of the project first:"
  echo "$BIG"
  exit 1
fi

npx wrangler pages deploy . --project-name=bhaskarjgoswami --commit-dirty=true
