// PM2 ecosystem config for Advancia Trainings (Next.js on Windows).
//
// Used by deploy.bat / deploy.ps1:
//   pm2 start ecosystem.config.cjs
//
// Manage with:
//   pm2 status
//   pm2 logs advancia-trainings
//   pm2 reload advancia-trainings   # zero-downtime
//   pm2 stop advancia-trainings

const path = require("path");

module.exports = {
  apps: [
    {
      name: "advancia-trainings",
      // Run "next start" through node directly - avoids npm wrapper issues on Windows.
      script: path.join("node_modules", "next", "dist", "bin", "next"),
      args: "start --hostname 0.0.0.0 --port 3000",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "0.0.0.0",
      },
      out_file: path.join(__dirname, "logs", "out.log"),
      error_file: path.join(__dirname, "logs", "error.log"),
      merge_logs: true,
      time: true,
    },
  ],
};
