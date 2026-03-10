import {
  healthControllerGetHealth,
  usersControllerGetMe,
  usersControllerGetUser,
  usersControllerGetUsers,
} from './users';
import {
  createSdkRequestOptions,
  mergeSdkRequestOptions,
  unwrapResponse,
  type SdkClientConfig,
} from './runtime';

export type UsersSdkConfig = SdkClientConfig;

export const createUsersSdk = (config: UsersSdkConfig) => {
  const sdkOptions = createSdkRequestOptions(config);

  return {
    getHealth: async (requestOptions?: RequestInit) =>
      unwrapResponse(await healthControllerGetHealth(mergeSdkRequestOptions(sdkOptions, requestOptions))),
    getMe: async (requestOptions?: RequestInit) =>
      unwrapResponse(await usersControllerGetMe(mergeSdkRequestOptions(sdkOptions, requestOptions))),
    getUsers: async (requestOptions?: RequestInit) =>
      unwrapResponse(await usersControllerGetUsers(mergeSdkRequestOptions(sdkOptions, requestOptions))),
    getUser: async (userId: number, requestOptions?: RequestInit) =>
      unwrapResponse(
        await usersControllerGetUser(userId, mergeSdkRequestOptions(sdkOptions, requestOptions))
      ),
  };
};

export type UsersSdk = ReturnType<typeof createUsersSdk>;
