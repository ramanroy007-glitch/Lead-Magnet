// /// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const process: {
  env: {
    [key: string]: string | undefined;
    API_KEY?: string;
  }
}
