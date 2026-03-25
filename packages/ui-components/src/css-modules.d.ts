/// <reference types="vite/client" />

/**
 * Ambient type declaration for CSS Modules.
 * Allows TypeScript to resolve `import styles from './Foo.module.css'`
 * and treat every exported class name as a string.
 */
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
