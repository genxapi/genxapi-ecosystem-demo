import { authServiceBaseUrl } from '../auth/client';

export interface AuthHealth {
  status: 'ok';
  service: 'auth-service';
}

export const getAuthHealth = async (signal?: AbortSignal): Promise<AuthHealth> => {
  const response = await fetch(`${authServiceBaseUrl}/health`, {
    signal,
    headers: {
      accept: 'application/json',
    },
  });

  const payload = (await response.json()) as AuthHealth | { message?: string };

  if (!response.ok) {
    throw new Error(payload && typeof payload === 'object' && payload.message ? payload.message : 'Auth service request failed.');
  }

  return payload as AuthHealth;
};
