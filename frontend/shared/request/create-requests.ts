import { ofetch, type FetchOptions } from "ofetch";

type CreateRequestParams = FetchOptions & {
  url: string;
};

type Fn<P> = (params: P) => CreateRequestParams;

type Payload<P> = CreateRequestParams | Fn<P>;

type CreateRequestInstanceParams<P> = CreateRequestParams & {
  withTokenInHeaders?: boolean;
  payload: Payload<P>;
};

type CreateRequestFxParams = Omit<
  CreateRequestInstanceParams<CreateRequestParams>,
  "payload" | "url"
>;

function getConfig<P>(payload: Payload<P>, params: P): CreateRequestParams {
  return typeof payload === "function" ? payload(params) : payload;
}

const createRequestInstance =
  <P = CreateRequestParams, R = void>({
    baseURL,
    headers,
    payload,
    withTokenInHeaders,
  }: CreateRequestInstanceParams<P>) =>
  (params: P): Promise<R> => {
    const { url, ...fetchOptions } = getConfig(payload, params);

    const newHeaders = new Headers(headers);

    if (withTokenInHeaders) {
      const accessToken = JSON.parse(localStorage.getItem("access_token")!);

      newHeaders.append("Authorization", `Bearer ${accessToken}`);
    }

    return ofetch(url, {
      ...fetchOptions,
      headers: newHeaders,
      baseURL,
    });
  };

export const createRequestFx =
  (params: CreateRequestFxParams) =>
  <P = CreateRequestParams, R = void>(payload: Payload<P>) =>
    createRequestInstance<P, R>({
      ...(params as CreateRequestParams),
      payload,
    });
