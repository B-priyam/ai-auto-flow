import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { requireAuth } from "@/lib/auth-utils";
import React from "react";

const page = async () => {
  await requireAuth();
  // const { data } = authClient.useSession();
  return (
    <div className="lowercase">
      protected page
      {/* {JSON.stringify(data)}
      {data && <Button onClick={() => authClient.signOut()}>Logout</Button>} */}
    </div>
  );
};

export default page;
