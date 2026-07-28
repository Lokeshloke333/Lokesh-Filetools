/**
 * Logger for AI Runtime.
 * Detailed logging during development, suppressed in production.
 */

const isDev = process.env.NODE_ENV === "development";

export const AILogger = {
  log: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(`[AI Runtime] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.warn(`[AI Runtime] ${message}`, ...args);
    }
  },

  error: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.error(`[AI Runtime] ${message}`, ...args);
    }
  },
  
  time: (label: string) => {
    if (isDev) {
      console.time(`[AI Runtime] ${label}`);
    }
  },
  
  timeEnd: (label: string) => {
    if (isDev) {
      console.timeEnd(`[AI Runtime] ${label}`);
    }
  }
};
