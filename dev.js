import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting MAG Plant development servers...');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Start Express backend
const serverProcess = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// 2. Start Vite frontend
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, 'client')
});

function cleanup() {
  console.log('\n🛑 Stopping servers...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
