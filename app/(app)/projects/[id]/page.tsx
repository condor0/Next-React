import type { Metadata } from "next";
import { getProjectById } from "@/lib/data/projects";
import ProjectDetailContent from "./ProjectDetailContent";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id);
  return {
    title: project?.name ?? "Project Detail",
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  return <ProjectDetailContent id={id} />;
}
