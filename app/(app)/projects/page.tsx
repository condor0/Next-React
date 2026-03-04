import type { Metadata } from "next";
import ProjectsContent from "./ProjectsContent";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse and manage research projects.",
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
