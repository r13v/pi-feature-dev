#!/bin/bash
# stage explicit files and commit only those files with a message
# usage: stage-and-commit.sh <message> <file1> [file2 ...]

set -e

if [ $# -lt 2 ]; then
    echo "error: usage: stage-and-commit.sh <message> <file1> [file2 ...]" >&2
    exit 1
fi

# an empty git pathspec matches everything under the current directory
for arg in "${@:2}"; do
    if [ -z "$arg" ]; then
        echo "error: empty file argument" >&2
        exit 1
    fi
done

if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "error: not a git repository" >&2
    exit 1
fi

msg="$1"
shift

# literal pathspecs keep names with '*', '?' or '[...]' from matching other files
listed=()
for path in "$@"; do
    listed+=(":(literal)$path")
done

git add -- "${listed[@]}"
# a path-scoped commit leaves unrelated staged work out of this commit
git commit -m "$msg" -- "${listed[@]}"

# path-scoped commits run hooks against a temporary index, so files a hook
# restages never reach the real index. reset every recorded path to HEAD;
# :(top) anchors repository-root paths when called from a subdirectory.
committed=()
while IFS= read -r -d '' path; do
    committed+=(":(top,literal)$path")
done < <(git diff-tree --no-commit-id --name-only -r --root -z HEAD)
if [ ${#committed[@]} -gt 0 ]; then
    git reset -q -- "${committed[@]}"
fi
