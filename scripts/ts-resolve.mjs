import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

/**
 * Lets Node import the project's TypeScript modules by their extensionless
 * specifiers, the way Vite and Vercel's bundler already do.
 *
 * Node runs `.ts` on its own (type stripping), but its resolver will not guess
 * an extension — so `import '../data/verticals'` fails under plain `node` while
 * being correct everywhere the code actually ships. This hook closes that one
 * gap so `npm run test:quote` can exercise the real handler.
 */
register(
  'data:text/javascript,' +
    encodeURIComponent(`
      import { existsSync } from 'node:fs';
      import { fileURLToPath } from 'node:url';
      export async function resolve(spec, ctx, next) {
        if (spec.startsWith('.') && !/\\.[cm]?[jt]sx?$/.test(spec)) {
          const url = new URL(spec + '.ts', ctx.parentURL);
          if (existsSync(fileURLToPath(url))) return { url: url.href, shortCircuit: true };
        }
        return next(spec, ctx);
      }
    `),
  pathToFileURL('./')
);
