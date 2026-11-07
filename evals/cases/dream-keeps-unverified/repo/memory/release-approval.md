Ask the user before you run `scripts/release.sh`.

**Why:** the script pushes a tag, and a tag starts the publish to npm. An
unplanned release once went out with a broken build.
**How to apply:** stop and ask before a release, also when the task says to
finish the work.
