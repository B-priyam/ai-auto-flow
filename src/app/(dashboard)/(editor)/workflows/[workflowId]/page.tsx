interface PageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const { workflowId } = await params;
  return (
    <div>
      <p>workflow id : {workflowId}</p>
    </div>
  );
};

export default page;
