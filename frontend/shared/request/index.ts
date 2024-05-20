import { createRequestFx } from "./create-requests";

export const createInternalRequest = createRequestFx({
  baseURL: `${process.env.API_URL}/api/`,
  withTokenInHeaders: true,
});

export const createAuthlessRequest = createRequestFx({
  baseURL: `${process.env.API_URL}/api/`,
  withTokenInHeaders: false,
});
