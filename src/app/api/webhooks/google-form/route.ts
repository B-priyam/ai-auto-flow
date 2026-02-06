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
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      responses: body.responses,
      row: body,
    };

    await sendWorkflowExecution({
      workflowId,
      initialData: {
        googleForm: formdata,
      },
    });
  } catch (error) {
    console.error("Google form webhook error", error);
    return NextResponse.json(
      {
        success: false,
        error: "failed to process Google Form submission",
      },
      {
        status: 500,
      },
    );
  }
}
