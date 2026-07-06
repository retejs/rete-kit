#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
GH_MIRROR_ROOT="${GH_MIRROR_ROOT:-$WORKSPACE_ROOT/gh-mirror}"
ISSUES_ROOT="${ISSUES_ROOT:-$GH_MIRROR_ROOT/issues}"

issue_count=0
pr_count=0

while IFS= read -r file; do
  state=$(jq -r '.state // empty' "$file")
  [ "$state" = "open" ] || continue
  printf '%s\n' "$file"
  issue_count=$((issue_count + 1))
done < <(find "$ISSUES_ROOT" -path '*/issues/issue-*.json' -type f | sort)

while IFS= read -r file; do
  state=$(jq -r '.metadata.state // empty' "$file")
  [ "$state" = "open" ] || continue
  printf '%s\n' "$file"
  pr_count=$((pr_count + 1))
done < <(find "$ISSUES_ROOT" -path '*/pulls/pull-*.json' -type f | sort)

printf 'summary: %s issues, %s prs\n' "$issue_count" "$pr_count" >&2
