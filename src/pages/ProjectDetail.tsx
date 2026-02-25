import { Link, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Modal } from "../components/Modal";
import { ProjectForm } from "../components/ProjectForm";
import { QueryState } from "../components/QueryState";
import { Select } from "../components/Select";
import { TaskForm } from "../components/TaskForm";
import { useToast } from "../state/uiStore";
import type { ProjectValues, TaskStatus, TaskValues } from "../forms/schemas";
import { taskStatusOptions } from "../forms/schemas";
import { getProject, updateProjectApi } from "../api/projects";
import {
  createTaskApi,
  listTasks,
  moveTaskStatusApi,
  updateTaskApi,
  type TaskRecord,
} from "../api/tasks";
import { getErrorMessage } from "../api/client";
import {
  getAdjacentTaskStatuses,
  getAllowedTaskStatuses,
  taskStatusLabels,
} from "../utils/taskRules";
import { useDebouncedValue } from "../utils/useDebouncedValue";

export default function ProjectDetail() {
  const { id } = useParams();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [taskQueryInput, setTaskQueryInput] = useState(
    searchParams.get("tq") ?? "",
  );
  const debouncedTaskQuery = useDebouncedValue(taskQueryInput.trim(), 350);
  const taskStatusParam = searchParams.get("tstatus") ?? "all";
  const [activeTask, setActiveTask] = useState<TaskRecord | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
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

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErrorDetails,
    isFetching: tasksFetching,
  } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => listTasks(id as string),
    enabled: Boolean(id),
  });

  useEffect(() => {
    const currentQuery = searchParams.get("tq") ?? "";
    if (currentQuery === debouncedTaskQuery) return;
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (debouncedTaskQuery) {
        next.set("tq", debouncedTaskQuery);
      } else {
        next.delete("tq");
      }
      return next;
    });
  }, [debouncedTaskQuery, searchParams, setSearchParams]);

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

  const createTaskMutation = useMutation({
    mutationFn: (values: TaskValues) => createTaskApi(id as string, values),
    onMutate: async (values) => {
      if (!id) return undefined;
      await queryClient.cancelQueries({ queryKey: ["tasks", id] });
      const previous = queryClient.getQueryData<TaskRecord[]>(["tasks", id]) ?? [];
      const optimisticTask: TaskRecord = {
        id: `temp-${Date.now()}`,
        projectId: id,
        title: values.title,
        description: values.description,
        status: values.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<TaskRecord[]>(["tasks", id], [
        optimisticTask,
        ...previous,
      ]);
      return { previous, optimisticId: optimisticTask.id };
    },
    onSuccess: (task, _values, context) => {
      if (!id) return;
      queryClient.setQueryData<TaskRecord[]>(["tasks", id], (current = []) =>
        current.map((item) => (item.id === context?.optimisticId ? task : item)),
      );
      addToast({
        title: "Task created",
        description: "Ready for the next step.",
        tone: "success",
      });
    },
    onError: (mutationError, _values, context) => {
      if (!id) return;
      if (context?.previous) {
        queryClient.setQueryData(["tasks", id], context.previous);
      }
      addToast({
        title: "Unable to create task",
        description: getErrorMessage(mutationError),
        tone: "error",
      });
    },
    onSettled: () => {
      if (!id) return;
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, values }: { taskId: string; values: TaskValues }) =>
      updateTaskApi(taskId, values),
    onMutate: async ({ taskId, values }) => {
      if (!id) return undefined;
      await queryClient.cancelQueries({ queryKey: ["tasks", id] });
      const previous = queryClient.getQueryData<TaskRecord[]>(["tasks", id]) ?? [];
      queryClient.setQueryData<TaskRecord[]>(["tasks", id], (current = []) =>
        current.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...values,
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      );
      return { previous };
    },
    onSuccess: (task) => {
      if (!id) return;
      queryClient.setQueryData<TaskRecord[]>(["tasks", id], (current = []) =>
        current.map((item) => (item.id === task.id ? task : item)),
      );
      addToast({
        title: "Task updated",
        description: "Changes are saved.",
        tone: "success",
      });
    },
    onError: (mutationError, _values, context) => {
      if (!id) return;
      if (context?.previous) {
        queryClient.setQueryData(["tasks", id], context.previous);
      }
      addToast({
        title: "Unable to update task",
        description: getErrorMessage(mutationError),
        tone: "error",
      });
    },
    onSettled: () => {
      if (!id) return;
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      moveTaskStatusApi(taskId, status),
    onMutate: async ({ taskId, status }) => {
      if (!id) return undefined;
      await queryClient.cancelQueries({ queryKey: ["tasks", id] });
      const previous = queryClient.getQueryData<TaskRecord[]>(["tasks", id]) ?? [];
      queryClient.setQueryData<TaskRecord[]>(["tasks", id], (current = []) =>
        current.map((task) =>
          task.id === taskId
            ? { ...task, status, updatedAt: new Date().toISOString() }
            : task,
        ),
      );
      return { previous };
    },
    onSuccess: (task) => {
      if (!id) return;
      queryClient.setQueryData<TaskRecord[]>(["tasks", id], (current = []) =>
        current.map((item) => (item.id === task.id ? task : item)),
      );
    },
    onError: (mutationError, _values, context) => {
      if (!id) return;
      if (context?.previous) {
        queryClient.setQueryData(["tasks", id], context.previous);
      }
      addToast({
        title: "Unable to move task",
        description: getErrorMessage(mutationError),
        tone: "error",
      });
    },
    onSettled: () => {
      if (!id) return;
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
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

  const handleCreateTask = async (values: TaskValues) => {
    if (!id) return;
    await createTaskMutation.mutateAsync(values);
  };

  const handleUpdateTask = async (values: TaskValues) => {
    if (!activeTask) return;
    await updateTaskMutation.mutateAsync({ taskId: activeTask.id, values });
    setIsTaskModalOpen(false);
    setActiveTask(null);
  };

  const handleMoveTask = (taskId: string, status: TaskStatus) => {
    moveTaskMutation.mutate({ taskId, status });
  };

  const handleTaskStatusChange = (value: string) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value === "all") {
        next.delete("tstatus");
      } else {
        next.set("tstatus", value);
      }
      return next;
    });
  };

  const openTaskModal = (task: TaskRecord) => {
    setActiveTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setActiveTask(null);
    setIsTaskModalOpen(false);
  };

  const headingName = isLoading ? "Loading..." : project?.name ?? id ?? "Unknown";
  const canShowTasks = Boolean(id) && Boolean(project) && !isLoading && !isError;
  const normalizedTaskQuery = debouncedTaskQuery.toLowerCase();
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        taskStatusParam === "all" ? true : task.status === taskStatusParam;
      const matchesQuery = normalizedTaskQuery
        ? `${task.title} ${task.description}`
            .toLowerCase()
            .includes(normalizedTaskQuery)
        : true;
      return matchesStatus && matchesQuery;
    });
  }, [tasks, normalizedTaskQuery, taskStatusParam]);
  const tasksByStatus = useMemo(() => {
    const grouped = taskStatusOptions.reduce(
      (acc, status) => ({ ...acc, [status]: [] }),
      {} as Record<TaskStatus, TaskRecord[]>,
    );
    filteredTasks.forEach((task) => {
      grouped[task.status].push(task);
    });
    return grouped;
  }, [filteredTasks]);

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

      {canShowTasks ? (
        <div className="space-y-4">
          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tasks</p>
              <h3 className="text-lg font-semibold">Create a task</h3>
              <p className="mt-1 text-sm text-slate-500">
                Track next steps and keep the flow moving.
              </p>
            </div>
            <TaskForm
              submitLabel="Add task"
              onSubmit={handleCreateTask}
              resetOnSubmit
            />
          </Card>

          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Search</p>
              <h3 className="text-lg font-semibold">Find tasks</h3>
              <p className="mt-1 text-sm text-slate-500">
                Filter by title, details, and status.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Search
                </span>
                <Input
                  type="search"
                  value={taskQueryInput}
                  onChange={(event) => setTaskQueryInput(event.target.value)}
                  placeholder="Search tasks"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Status
                </span>
                <Select
                  value={taskStatusParam}
                  onChange={(event) => handleTaskStatusChange(event.target.value)}
                >
                  <option value="all">All</option>
                  {taskStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {taskStatusLabels[status]}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Task board
              </p>
              <h3 className="text-lg font-semibold">Status flow</h3>
            </div>
            {tasksFetching ? (
              <span className="text-xs text-slate-400">Syncing...</span>
            ) : null}
          </div>

          {tasksLoading ? (
            <QueryState
              title="Loading tasks"
              description="Fetching the latest task list."
            />
          ) : tasksError ? (
            <QueryState
              tone="error"
              title="Unable to load tasks"
              description={getErrorMessage(tasksErrorDetails)}
            />
          ) : filteredTasks.length === 0 ? (
            <QueryState
              title={tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
              description={
                tasks.length === 0
                  ? "Add the first task to get started."
                  : "Try adjusting your search or filters."
              }
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-3" aria-busy={tasksFetching}>
              {taskStatusOptions.map((status) => (
                <Card key={status} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {taskStatusLabels[status]}
                      </p>
                      <h4 className="text-lg font-semibold">
                        {tasksByStatus[status].length} tasks
                      </h4>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {tasksByStatus[status].length === 0 ? (
                      <p className="text-sm text-slate-500">No tasks in this lane.</p>
                    ) : (
                      tasksByStatus[status].map((task) => {
                        const moves = getAdjacentTaskStatuses(task.status)
                        return (
                          <div
                            key={task.id}
                            className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-sm"
                          >
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-900">{task.title}</p>
                              <p className="text-xs text-slate-500">
                                {task.description}
                              </p>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openTaskModal(task)}
                              >
                                Edit
                              </Button>
                              {moves.map((nextStatus) => (
                                <Button
                                  key={nextStatus}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMoveTask(task.id, nextStatus)}
                                  disabled={moveTaskMutation.isPending}
                                >
                                  Move to {taskStatusLabels[nextStatus]}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
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

      <Modal
        open={isTaskModalOpen}
        title="Edit task"
        onClose={closeTaskModal}
        footer={
          <Button variant="ghost" onClick={closeTaskModal}>
            Close
          </Button>
        }
      >
        {activeTask ? (
          <TaskForm
            submitLabel="Save task"
            onSubmit={handleUpdateTask}
            defaultValues={activeTask}
            statusOptions={getAllowedTaskStatuses(activeTask.status)}
          />
        ) : null}
      </Modal>
    </div>
  );
}