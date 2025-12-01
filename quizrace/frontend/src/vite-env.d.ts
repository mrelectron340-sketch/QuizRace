/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QUESTION_SERVICE_URL?: string;
  readonly VITE_LINERA_SERVICE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


