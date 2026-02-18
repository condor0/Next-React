import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";

import { Card } from "../components/Card";
import { ProjectForm } from "../components/ProjectForm";
import { useToast } from "../state/uiStore";
import type { ProjectValues } from "../forms/schemas";
import {
  getProjectById,
  loadProjects,
  updateProject,
  type ProjectRecord,
} from "../state/projectsStore";

export default function ProjectDetail() {
  const { id } = useParams();
  const { addToast } = useToast();
  const [projects, setProjects] = useState<ProjectRecord[]>(() => loadProjects());
  const [project, setProject] = useState<ProjectRecord | null>(() =>
    getProjectById(id),
  );

  const defaultValues = useMemo<Partial<ProjectValues>>(() => {
    if (project) {
      return {
        name: project.name,
        status: project.status,
        ownerEmail: project.ownerEmail,
        description: project.description,
      };
    }

    const label = id
      ? id.replace(/(^.|-.)/g, (match: string) => match.replace("-", " ").toUpperCase())
      : "";
    return {
      name: label || "Untitled project",
      status: "In progress",
      ownerEmail: "owner@company.com",
      description: "Outline the next milestone and key risks for this project.",
    };
  }, [id, project]);

  const handleSave = async (values: ProjectValues) => {
    if (id) {
      const nextProjects = updateProject(id, values, projects);
      setProjects(nextProjects);
      setProject(nextProjects.find((item) => item.id === id) ?? null);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    addToast({
      title: "Project updated",
      description: "Edits are saved in this mock flow.",
      tone: "success",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Project</p>
        <h2 className="text-2xl font-semibold">{project?.name ?? id ?? "Unknown"}</h2>
        <p className="mt-2 text-sm text-slate-500">
          Project detail routes.
        </p>
      </div>

      {project ? (
        <Card className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Summary</p>
              <h3 className="text-lg font-semibold">Current snapshot</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              {project.status}
            </span>
          </div>
          <div className="grid gap-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-700">Owner:</span> {project.ownerEmail}
            </p>
            <p>{project.description}</p>
            <p className="text-xs text-slate-400">
              Updated {new Date(project.updatedAt).toLocaleString()}
            </p>
          </div>
        </Card>
      ) : null}

      <Card className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Edit</p>
          <h3 className="text-lg font-semibold">Project details</h3>
          <p className="mt-1 text-sm text-slate-500">
            Update status and summary before sharing with stakeholders.
          </p>
        </div>
        <ProjectForm
          key={project?.id ?? id}
          submitLabel="Save changes"
          onSubmit={handleSave}
          defaultValues={defaultValues}
        />
      </Card>

      <Card className="space-y-2">
        <p className="text-sm text-slate-600">
          This is a placeholder detail view. Wire it to your data source next.
        </p>
        <Link
          to="/projects"
          className="text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          Back to projects
        </Link>
      </Card>
    </div>
  );
}