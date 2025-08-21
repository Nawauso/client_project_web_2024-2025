// Utility to require a module at runtime and tolerate absence or export shape
export function tryRequire(path: string): { mod: any | null, error?: any } {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const m = require(path);
    return { mod: m };
  } catch (e) {
    return { mod: null, error: e };
  }
}

export function pickExport(mod: any, names: string[], fallback?: any) {
  if (!mod) return null;
  for (const n of names) {
    if (mod && mod[n]) return mod[n];
  }
  return mod && mod.__esModule && mod.default ? mod.default : (fallback ?? null);
}
