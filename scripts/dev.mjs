// Keep normal `npm run dev` behaviour while accepting the supervised preview flags.
import { spawn } from 'node:child_process';

const args = process.argv.slice(2)
  .filter(arg => arg !== '--strictPort')
  .map(arg => arg === '--host' ? '--hostname' : arg);
// Next already fails on a busy explicitly selected --port, so strictPort is implicit.
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', ...args], { stdio: 'inherit' });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', error => { console.error(error); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
