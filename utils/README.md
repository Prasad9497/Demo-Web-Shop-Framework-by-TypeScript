# Utilities

- `environment.ts` loads `.env.dev`, `.env.stg`, or `.env.prod`.
- Select an environment with `TEST_ENV=stg npm test`.
- Keep passwords and tokens out of committed `.env` files. Use CI secret variables for real environments.