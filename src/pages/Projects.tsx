import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Card } from "../components/Card";
import { ProjectForm } from "../components/ProjectForm";
import { useToast } from "../state/uiStore";
import type { ProjectValues } from "../forms/schemas";
import { QueryState } from "../components/QueryState";
import {
  createProjectApi,
  listProjects,
  type ProjectRecord,
} from "../api/projects";
import { getErrorMessage } from "../api/client";

export default function Projects() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: projects = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProjectApi,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
      addToast({
        title: "Project created",
        description: "Ready to edit the details.",
        tone: "success",
      });
      navigate(`/projects/${project.id}`);
    },
    onError: (mutationError) => {
      addToast({
        title: "Unable to create project",
        description: getErrorMessage(mutationError),
        tone: "error",
      });
    },
  });

  const handleCreate = async (values: ProjectValues) => {
    await createMutation.mutateAsync(values);
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
        {isLoading ? (
          <QueryState
            title="Loading projects"
            description="Fetching the latest portfolio list."
            className="md:col-span-2"
          />
        ) : isError ? (
          <QueryState
            tone="error"
            title="Unable to load projects"
            description={getErrorMessage(error)}
            className="md:col-span-2"
          />
        ) : projects.length === 0 ? (
          <QueryState
            title="No projects yet"
            description="Create your first project to get started."
            className="md:col-span-2"
          />
        ) : (
          projects.map((project: ProjectRecord) => (
            <Card key={project.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {project.name}
                </h3>
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
          ))
        )}
      </div>
    </div>
  );
}