import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { ProjectForm } from "../components/ProjectForm";
import { Select } from "../components/Select";
import { useToast } from "../state/uiStore";
import type { ProjectValues } from "../forms/schemas";
import { projectStatusOptions } from "../forms/schemas";
import { QueryState } from "../components/QueryState";
import {
  createProjectApi,
  listProjects,
  type ProjectRecord,
} from "../api/projects";
import { getErrorMessage } from "../api/client";
import { useDebouncedValue } from "../utils/useDebouncedValue";

export default function Projects() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryInput, setQueryInput] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebouncedValue(queryInput.trim(), 400);
  const statusParam = searchParams.get("status") ?? "all";
  const pageParam = Number(searchParams.get("page") ?? "1");
  const pageSize = 6;
  const {
    data: projects = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  useEffect(() => {
    const currentQuery = searchParams.get("q") ?? "";
    if (currentQuery === debouncedQuery) return;
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (debouncedQuery) {
        next.set("q", debouncedQuery);
      } else {
        next.delete("q");
      }
      next.set("page", "1");
      return next;
    });
  }, [debouncedQuery, searchParams, setSearchParams]);

  const normalizedQuery = debouncedQuery.toLowerCase();
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus =
        statusParam === "all" ? true : project.status === statusParam;
      const matchesQuery = normalizedQuery
        ? `${project.name} ${project.description}`
            .toLowerCase()
            .includes(normalizedQuery)
        : true;
      return matchesStatus && matchesQuery;
    });
  }, [projects, normalizedQuery, statusParam]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const currentPage =
    Number.isFinite(pageParam) && pageParam > 0
      ? Math.min(pageParam, totalPages)
      : 1;

  useEffect(() => {
    if (currentPage === pageParam) return;
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set("page", String(currentPage));
      return next;
    });
  }, [currentPage, pageParam, setSearchParams]);

  const pagedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [currentPage, filteredProjects]);

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

  const handleStatusChange = (value: string) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value === "all") {
        next.delete("status");
      } else {
        next.set("status", value);
      }
      next.set("page", "1");
      return next;
    });
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set("page", String(nextPage));
      return next;
    });
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

      <Card className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Search</p>
          <h3 className="text-lg font-semibold">Find projects</h3>
          <p className="mt-1 text-sm text-slate-500">
            Filter by name, summary, and status.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Search
            </span>
            <Input
              type="search"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Search projects"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Status
            </span>
            <Select
              value={statusParam}
              onChange={(event) => handleStatusChange(event.target.value)}
            >
              <option value="all">All</option>
              {projectStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </label>
        </div>
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
        ) : filteredProjects.length === 0 ? (
          <QueryState
            title={projects.length === 0 ? "No projects yet" : "No matching projects"}
            description={
              projects.length === 0
                ? "Create your first project to get started."
                : "Try adjusting your search or filters."
            }
            className="md:col-span-2"
          />
        ) : (
          pagedProjects.map((project: ProjectRecord) => (
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

      {!isLoading && !isError && filteredProjects.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Showing page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}