// Node validation has no client graph. Keep Next's real server-only boundary in
// application builds, and neutralise only its marker for command-line checks.
import { registerHooks } from 'node:module';
export const serverOnlyHook = registerHooks({
  resolve(specifier, context, next) {
    return specifier === 'server-only'
      ? { url: 'data:text/javascript,export {}', shortCircuit: true }
      : next(specifier, context);
  },
});
