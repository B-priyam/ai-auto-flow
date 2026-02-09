import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter : WorkflowId",
        },
        {
          status: 400,
        },
      );
    }

    const body = await req.json();

    const formdata = {
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
      raw: body.data?.object,
    };

    await sendWorkflowExecution({
      workflowId,
      initialData: {
        stripe: formdata,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error", error);
    return NextResponse.json(
      {
        success: false,
        error: "failed to process Stripe event",
      },
      {
        status: 500,
      },
    );
  }
}
