# Deploy

1. Run `npm run verify`.
2. Run `./deploy.sh --env staging`.
3. Monitor the dashboard for 10 minutes.
4. If the error rate stays below 1%, run `./deploy.sh --env production`.

To roll back, run `./deploy.sh --rollback`. Rollback works only for 24 hours
after the deploy.
