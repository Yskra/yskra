export type NavigationGuardReturn = void | Error | boolean;

/**
 * Navigation Guard.
 */
export type NavigationGuard<T = any, F = T> = (to: T, from: F) => NavigationGuardReturn;
