import '@testing-library/jest-dom';

// Polyfill fetch si absent (jsdom ne l’injecte pas)
if (typeof globalThis.fetch === 'undefined') {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('whatwg-fetch'); // ajoute window.fetch / global.fetch
    } catch {
        // pas grave : certains environnements Node >=18 ont déjà fetch
    }
}

// matchMedia polyfill pour tests
if (!window.matchMedia) {
    // @ts-ignore
    window.matchMedia = () => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    });
}
