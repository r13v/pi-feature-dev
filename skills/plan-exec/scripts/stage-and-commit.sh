#!/bin/bash
# stage explicit files and commit with a message
# usage: stage-and-commit.sh <message> <file1> [file2 ...]

set -e

if [ $# -lt 2 ]; then
    echo "error: usage: stage-and-commit.sh <message> <file1> [file2 ...]" >&2
    exit 1
fi

if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "error: not a git repository" >&2
    exit 1
fi

msg="$1"
shift

git add -- "$@"
git commit -m "$msg"
