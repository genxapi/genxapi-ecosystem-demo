import { users } from '@genxapi/ecosystem-users-sdk';
import { payments } from 'genxapi-ecosystem-payments-sdk';
import { createMobileSdks, type MobileAccessTokenProvider } from '../../runtime';
import { useAuthSession } from '../auth/AuthSessionContext';

const withSignal = (signal?: AbortSignal): RequestInit | undefined => (signal ? { signal } : undefined);

export type CustomerProfile = users.User;
export type CustomerPayment = payments.Payment;

export const createCustomerMobileApi = (accessToken: MobileAccessTokenProvider) => {
  const sdks = createMobileSdks(accessToken);

  return {
    getMyProfile: (signal?: AbortSignal) => sdks.users.getMe(withSignal(signal)),
    getMyPayments: (signal?: AbortSignal) => sdks.payments.getMyPayments(withSignal(signal)),
  };
};

export const useCustomerMobileApi = () => {
  const { accessToken } = useAuthSession();

  return createCustomerMobileApi(accessToken);
};
