import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  await requireAuth();
  const { credentialId } = await params;
  return (
    <div>
      <p>credential id : {credentialId}</p>
    </div>
  );
};

export default page;
