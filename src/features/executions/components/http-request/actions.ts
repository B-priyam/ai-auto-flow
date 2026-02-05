"use server";

import { HttpRequestChannel } from "@/inngest/channels/http-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type HttpRequestToken = Realtime.Token<
  typeof HttpRequestChannel,
  ["status"]
>;

export async function fetchHttpRequestRealtimeToken(): Promise<HttpRequestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: HttpRequestChannel(),
    topics: ["status"],
  });

  return token;
}
