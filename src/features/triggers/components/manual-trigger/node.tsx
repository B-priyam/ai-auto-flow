import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenSettings = () => setOpen(true);
  const nodeStatus = "initial";
  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        name="When clicking 'Execute workflow'"
        icon={MousePointerIcon}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
