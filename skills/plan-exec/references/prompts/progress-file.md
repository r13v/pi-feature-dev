# Progress file

The orchestrator maintains a progress file at `/tmp/progress-<plan-name>.txt`,
derived from the plan filename stem. The file carries context across task,
review, fixer, finalizer, and summary phases.

## When to write

Use `PLAN_EXEC_ROOT/scripts/append-progress.sh` for all appends. Do not write
directly to the progress file.

At start, `init-progress.sh` writes:

```text
# progress
Plan: <plan-file-path>
Branch: <branch-name>
Started: <timestamp>
---
```

After each task completes:

```text
[task] Task N: <title> - completed
```

After each task fails:

```text
[task] Task N: <title> - FAILED (retry N)
```

Before each review phase:

```text
--- review phase N: <type> ---
```

After review workers return, before the fixer:

```text
[review] phase N iteration M findings:
<full worker output>
```

After a fixer completes:

```text
[fixer] phase N iteration M:
<fixer report>
```

After finalize:

```text
[finalize]
<finalizer report>
```

At completion:

```text
---
Completed: <timestamp>
```

## How to pass it

- Pass the progress file path to task, fixer, finalizer, and summary workers.
- Review workers may read the progress file for context, but must remain
  read-only.
- The summary worker uses it to derive portable run statistics.
