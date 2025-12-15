import { test as base, expect } from "@playwright/test";

// Re-export base test and expect - no proxy needed since backend supports CORS
export const test = base;
export { expect };
