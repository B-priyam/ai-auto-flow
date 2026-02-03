import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky from "ky";
import Ky, { type Options as kyOptions } from "ky";

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const HttpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  nodeId,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }

  // const result = await step.fetch(data.endPoint);

  const result = await step.run("http-request", async () => {
    const endPoint = data.endpoint!;
    const method = data.method || "GET";

    const options: kyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      if (data.body) {
        options.body = data.body;
      }
    }

    const response = await ky(endPoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  return result;
};
