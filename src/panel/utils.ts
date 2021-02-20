import { FormatType, RequestInfo } from "./types";

const formatMswHandler = (requestInfo: RequestInfo): string => {
  const formatter = requestInfo.contentType.includes("json") ? "json" : "body";

  return `
      rest.${requestInfo.method.toLowerCase()}('${
    requestInfo.url
  }', (req, res, ctx) => {
        return res(
          ctx.status(${requestInfo.status}),
          ctx.${formatter}(${JSON.stringify(requestInfo.body, null, 2)}),
        )
      })
    `;
};

const formatJson = (requestInfo: RequestInfo): string => {
  const newJson = {
    ...requestInfo,
  };

  // @ts-ignore
  delete newJson.id;
  // @ts-ignore
  delete newJson.checked;

  return JSON.stringify(newJson, null, 2);
};

export const getFormatter = (formatType: FormatType) => {
  return formatType === "msw" ? formatMswHandler : formatJson;
};
