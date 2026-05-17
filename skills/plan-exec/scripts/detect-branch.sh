#!/bin/bash
# detect the default branch name of the current Git repository
# outputs the branch name to stdout
# avoids network calls when possible

set -e

if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "error: not a git repository" >&2
    exit 1
fi

branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@')

if [ -z "$branch" ]; then
    for candidate in main master trunk develop; do
        if git show-ref --verify --quiet "refs/heads/$candidate" 2>/dev/null; then
            branch="$candidate"
            break
        fi
    done
fi

if [ -z "$branch" ]; then
    branch=$(git remote show origin 2>/dev/null | grep 'HEAD branch' | sed 's/.*: //')
fi

if [ -z "$branch" ]; then
    branch="main"
fi

echo "$branch"
