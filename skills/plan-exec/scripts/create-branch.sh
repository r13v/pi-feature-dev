#!/bin/bash
# create a feature branch from a plan file name if currently on the default branch
# usage: create-branch.sh <plan-file-path>
# exits 0 if a branch was created or an existing feature branch is already active
# outputs the branch name to stdout
#
# strips leading YYYYMMDD- or YYYY-MM-DD- date prefixes from branch names

set -e

if [ -z "${1:-}" ]; then
    echo "error: plan file path required" >&2
    exit 1
fi

if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "error: not a git repository" >&2
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

derive_branch_name() {
    local name
    name=$(basename "$1" .md)
    name=$(echo "$name" | sed 's/^[0-9]\{4\}-\{0,1\}[0-9]\{2\}-\{0,1\}[0-9]\{2\}-//')
    echo "$name"
}

current_branch=$(git branch --show-current)
default_branch=$(bash "$SCRIPT_DIR/detect-branch.sh")

if [ -n "$current_branch" ] && [ "$current_branch" != "$default_branch" ]; then
    echo "$current_branch"
    exit 0
fi

branch_name=$(derive_branch_name "$1")

if git show-ref --verify --quiet "refs/heads/$branch_name" 2>/dev/null; then
    git checkout "$branch_name"
else
    git checkout -b "$branch_name"
fi

echo "$branch_name"
