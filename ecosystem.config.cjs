// PM2 process config for Conference Stream.
//   pm2 start ecosystem.config.cjs   # start
//   pm2 save                         # persist across reboots
//   pm2 logs conference-stream       # view logs
//   pm2 restart conference-stream    # after a deploy
//
// IMPORTANT: single instance / fork mode. The app keeps live conference state
// (playback position, participants, viewer counts) in memory and uses Socket.io,
// so it must NOT run in cluster mode or with multiple instances.
module.exports = {
  apps: [
    {
      name: "conference-stream",
      script: "server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
