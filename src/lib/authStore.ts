/**
 * Módulo de memoria para almacenar el token de autenticación
 * No usa localStorage, solo memoria en tiempo de ejecución
 */

let token: string | null = null;

export const authStore = {
  getToken: (): string | null => {
    return token;
  },

  setToken: (newToken: string): void => {
    token = newToken;
  },

  clearToken: (): void => {
    token = null;
  },

  hasToken: (): boolean => {
    return token !== null;
  },
};

