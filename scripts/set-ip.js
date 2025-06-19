const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ipRegex = /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/;

rl.question('Enter your backend IP address (e.g., 192.168.1.100): ', (ip) => {
  if (!ipRegex.test(ip)) {
    console.error('❌ Invalid IP address format.');
    rl.close();
    return;
  }

  const platform = process.platform;
  const pingCommand = platform === 'win32' ? `ping -n 1 ${ip}` : `ping -c 1 ${ip}`;

  exec(pingCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ IP is not reachable. Please check your backend server or network.');
      rl.close();
      return;
    }

    const envPath = path.join(__dirname, '../.env.local');
    fs.writeFileSync(envPath, `VITE_BACKEND_IP=${ip}\n`);
    console.log(`✔️ Saved backend IP to .env.local: ${ip}`);
    console.log('✅ IP is reachable and ready to use.');
    rl.close();
  });
});