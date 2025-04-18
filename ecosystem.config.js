module.exports = {
  apps: [
    {
      name: "sp-webhook",
      script: "index.js",
      env: {
        PORT: 3007,
        CLIENT_STATE: "1234567890abcdef"
      },
      watch: true,           // Tự restart khi code thay đổi (dev mode)
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/error.log",
      out_file: "./logs/output.log",
      merge_logs: true,
    }
  ]
}
