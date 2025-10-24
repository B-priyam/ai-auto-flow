"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { requireAuth } from "@/lib/auth-utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

const page = () => {
  // await requireAuth();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.getWorkflows.queryOptions());
      },
    })
  );
  // const { data } = authClient.useSession();
  return (
    <div className="lowercase">
      protected page
      {JSON.stringify(data)}
      {data && <Button onClick={() => create.mutate()}>Create</Button>}
    </div>
  );
};

export default page;
