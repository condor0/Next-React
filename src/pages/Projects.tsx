import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { Card } from "../components/Card";
import { ProjectForm } from "../components/ProjectForm";
import { useToast } from "../state/uiStore";
import type { ProjectValues } from "../forms/schemas";
import {
  createProject,
  loadProjects,
  type ProjectRecord,
} from "../state/projectsStore";

export default function Projects() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectRecord[]>(() => loadProjects());

  const handleCreate = async (values: ProjectValues) => {
    const { project, projects: nextProjects } = createProject(values, projects);
    setProjects(nextProjects);
    await new Promise((resolve) => setTimeout(resolve, 500));
    addToast({
      title: "Project created",
      description: "Ready to edit the details.",
      tone: "success",
    });
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Portfolio</p>
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="mt-2 text-sm text-slate-500">
          Select a project to view details.
        </p>
      </div>

      <Card className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Create</p>
          <h3 className="text-lg font-semibold">New project</h3>
          <p className="mt-1 text-sm text-slate-500">
            Capture a new project and keep the summary short.
          </p>
        </div>
        <ProjectForm submitLabel="Create project" onSubmit={handleCreate} resetOnSubmit />
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                {project.status}
              </span>
            </div>
            <Link
              to={`/projects/${project.id}`}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              View details
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}