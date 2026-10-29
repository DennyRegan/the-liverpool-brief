import { spawn } from 'node:child_process';

if (process.env.VERCEL || process.env.CI) throw new Error('The history prototype is local-only.');
const mode = process.argv[2];
if (!['dev', 'build', 'start'].includes(mode)) throw new Error('Use dev, build or start.');
const args = mode === 'build' ? ['build', '--webpack']
  : [mode, ...(mode === 'dev' ? ['--webpack'] : []), '--hostname', '127.0.0.1', '--port', '3147'];
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', ...args], {
  stdio: 'inherit', env: { ...process.env, LIVERPOOL_HISTORY_PROTOTYPE: '1' },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', error => { console.error(error); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
