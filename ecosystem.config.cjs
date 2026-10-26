module.exports = {
  apps: [
    {
      name: 'webapp',
      script: 'npx',
      // The D1 binding comes from wrangler.jsonc (binding "DB" ->
      // roark-orthodontics-production). Do not pass --d1 here: the old
      // --d1=webapp-production named a database that does not exist in this
      // account, and a second source of truth would silently diverge from
      // the deployed config.
      args: 'wrangler pages dev dist --local --ip 0.0.0.0 --port 3000',
      env: { NODE_ENV: 'development', PORT: 3000 },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
