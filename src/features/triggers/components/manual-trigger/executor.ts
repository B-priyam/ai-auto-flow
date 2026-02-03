import type { NodeExecutor } from "@/features/executions/types";

type manualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<manualTriggerData> = async ({
  context,
  nodeId,
  step,
}) => {
  const result = await step.run("manual-trigger", async () => context);

  return result;
};
