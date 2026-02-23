import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card } from "../components/Card";
import { ProjectForm } from "../components/ProjectForm";
import { QueryState } from "../components/QueryState";
import { useToast } from "../state/uiStore";
import type { ProjectValues } from "../forms/schemas";
import { getProject, updateProjectApi } from "../api/projects";
import { getErrorMessage } from "../api/client";

export default function ProjectDetail() {
  const { id } = useParams();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id as string),
    enabled: Boolean(id),
  });

  const updateMutation = useMutation({
    mutationFn: (values: ProjectValues) => updateProjectApi(id as string, values),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["project", updatedProject.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      addToast({
        title: "Project updated",
        description: "Edits are saved in this mock flow.",
        tone: "success",
      });
    },
    onError: (mutationError) => {
      addToast({
        title: "Unable to update project",
        description: getErrorMessage(mutationError),
        tone: "error",
      });
    },
  });

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
    if (!id) return;
    await updateMutation.mutateAsync(values);
  };

  const headingName = isLoading ? "Loading..." : project?.name ?? id ?? "Unknown";

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Project</p>
        <h2 className="text-2xl font-semibold">{headingName}</h2>
        <p className="mt-2 text-sm text-slate-500">
          Project detail routes.
        </p>
      </div>

      {!id ? (
        <QueryState
          tone="error"
          title="Missing project id"
          description="Open the project from the projects list."
        />
      ) : isLoading ? (
        <QueryState
          title="Loading project"
          description="Fetching the latest status update."
        />
      ) : isError ? (
        <QueryState
          tone="error"
          title="Unable to load project"
          description={getErrorMessage(error)}
        />
      ) : project ? (
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
      ) : (
        <QueryState
          title="Project not found"
          description="Check the link or return to the projects list."
        />
      )}

      {id && !isError && !isLoading ? (
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
      ) : null}

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