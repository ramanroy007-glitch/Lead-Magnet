/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// FIX: Replaced NodeJS namespace with a direct declaration for `process` to avoid potential type resolution conflicts.
declare var process: {
  env: {
    API_KEY?: string;
    [key: string]: string | undefined;
  }
}
