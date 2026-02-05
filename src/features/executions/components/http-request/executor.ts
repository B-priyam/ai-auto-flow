import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as kyOptions } from "ky";
import Handlebars from "handlebars";
import { HttpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const HttpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  nodeId,
  step,
  publish,
}) => {
  await publish(
    HttpRequestChannel().status({
      nodeId,
      status: "loading",
    }),
  );
  if (!data.endpoint) {
    await publish(
      HttpRequestChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }
  if (!data.variableName) {
    await publish(
      HttpRequestChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Variable name not configured");
  }

  // const result = await step.fetch(data.endPoint);

  try {
    const result = await step.run("http-request", async () => {
      const endPoint = Handlebars.compile(data.endpoint)(context);
      const method = data.method || "GET";

      const options: kyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        const resolved = Handlebars.compile(data.body || "{}")(context);
        JSON.parse(resolved);
        options.body = resolved;
        options.headers = {
          "Content-Type": "application/json",
        };
      }

      const response = await ky(endPoint, options);
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responsePayload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    });

    await publish(
      HttpRequestChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      HttpRequestChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
