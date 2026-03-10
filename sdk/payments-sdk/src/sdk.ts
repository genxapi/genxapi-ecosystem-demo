import {
  healthControllerGetHealth,
  paymentsControllerGetMyPayments,
  paymentsControllerGetPayment,
  paymentsControllerGetPayments,
  paymentsControllerGetUserPayments,
} from './payments';
import {
  createSdkRequestOptions,
  mergeSdkRequestOptions,
  unwrapResponse,
  type SdkClientConfig,
} from './runtime';

export type PaymentsSdkConfig = SdkClientConfig;

export const createPaymentsSdk = (config: PaymentsSdkConfig) => {
  const sdkOptions = createSdkRequestOptions(config);

  return {
    getHealth: async (requestOptions?: RequestInit) =>
      unwrapResponse(await healthControllerGetHealth(mergeSdkRequestOptions(sdkOptions, requestOptions))),
    getMyPayments: async (requestOptions?: RequestInit) =>
      unwrapResponse(
        await paymentsControllerGetMyPayments(mergeSdkRequestOptions(sdkOptions, requestOptions))
      ),
    getPayments: async (requestOptions?: RequestInit) =>
      unwrapResponse(
        await paymentsControllerGetPayments(mergeSdkRequestOptions(sdkOptions, requestOptions))
      ),
    getPayment: async (paymentId: number, requestOptions?: RequestInit) =>
      unwrapResponse(
        await paymentsControllerGetPayment(paymentId, mergeSdkRequestOptions(sdkOptions, requestOptions))
      ),
    getUserPayments: async (userId: number, requestOptions?: RequestInit) =>
      unwrapResponse(
        await paymentsControllerGetUserPayments(
          userId,
          mergeSdkRequestOptions(sdkOptions, requestOptions)
        )
      ),
  };
};

export type PaymentsSdk = ReturnType<typeof createPaymentsSdk>;
