import type { Metadata } from "next";
import ProjectDetailContent from "./ProjectDetailContent";

export const metadata: Metadata = {
  title: "Project Detail",
};

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  return <ProjectDetailContent id={id} />;
}
