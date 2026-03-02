"use client";

import { Suspense, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { ProjectForm } from "@/components/ProjectForm";
import { QueryState } from "@/components/QueryState";
import { Select } from "@/components/Select";
import { TaskForm } from "@/components/TaskForm";
import { useToast } from "@/state/uiStore";
import type {
  ProjectValues,
  TaskStatus,
  TaskValues,
} from "@/forms/schemas";
import { taskStatusOptions } from "@/forms/schemas";
import { getProject, updateProjectApi } from "@/api/projects";
import {
  createTaskApi,
  listTasks,
  moveTaskStatusApi,
  updateTaskApi,
  type TaskRecord,
} from "@/api/tasks";
import { getErrorMessage } from "@/api/client";
import { useDebouncedValue } from "@/utils/useDebouncedValue";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

function ProjectDetailContent({ id }: { id: string }) {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
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
    queryFn: () => getProject(id),
    enabled: Boolean(id),
  });

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErrorDetails,
  } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => listTasks(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    const currentQuery = searchParams.get("tq") ?? "";
    if (currentQuery === debouncedTaskQuery) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedTaskQuery) {
      params.set("tq", debouncedTaskQuery);
    } else {
      params.delete("tq");
    }
    router.push(`/projects/${id}?${params.toString()}`);
  }, [debouncedTaskQuery, searchParams, id, router]);

  const updateMutation = useMutation({
    mutationFn: (values: ProjectValues) => updateProjectApi(id, values),
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
    mutationFn: (values: TaskValues) => createTaskApi(id, values),
    onMutate: async (values) => {
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
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, values }: { taskId: string; values: TaskValues }) =>
      updateTaskApi(taskId, values),
    onMutate: async ({ taskId, values }) => {
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
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      moveTaskStatusApi(taskId, status),
    onMutate: async ({ taskId, status }) => {
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
      queryClient.setQueryData<TaskRecord[]>(["tasks", id], (current = []) =>
        current.map((item) => (item.id === task.id ? task : item)),
      );
    },
    onError: (mutationError, _values, context) => {
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
      ? id.replace(/(^.|-.)/g, (match: string) =>
          match.replace("-", " ").toUpperCase(),
        )
      : "";
    return {
      name: label || "Untitled project",
      status: "In progress",
      ownerEmail: "owner@company.com",
      description: "Outline the next milestone and key risks for this project.",
    };
  }, [id, project]);

  const handleSave = async (values: ProjectValues) => {
    await updateMutation.mutateAsync(values);
  };

  const handleCreateTask = async (values: TaskValues) => {
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
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("tstatus");
    } else {
      params.set("tstatus", value);
    }
    router.push(`/projects/${id}?${params.toString()}`);
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
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Project
        </p>
        <h2 className="text-2xl font-semibold">{headingName}</h2>
        <p className="mt-2 text-sm text-slate-500">Project detail routes.</p>
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
        <>
          <Card className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Summary
                </p>
                <h3 className="text-lg font-semibold">Current snapshot</h3>
              </div>
            </div>
            <ProjectForm
              defaultValues={defaultValues}
              submitLabel="Save project"
              onSubmit={handleSave}
            />
          </Card>

          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Create
              </p>
              <h3 className="text-lg font-semibold">New task</h3>
              <p className="mt-1 text-sm text-slate-500">
                Add a task to this project and categorize it by status.
              </p>
            </div>
            <TaskForm submitLabel="Create task" onSubmit={handleCreateTask} />
          </Card>

          <Card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Filter
                </p>
                <h3 className="text-lg font-semibold">Find tasks</h3>
              </div>
              <label className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Status</span>
                <Select
                  value={taskStatusParam}
                  onChange={(event) =>
                    handleTaskStatusChange(event.target.value)
                  }
                >
                  <option value="all">All</option>
                  {taskStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
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
          </Card>

          {tasksLoading ? (
            <QueryState
              title="Loading tasks"
              description="Fetching the task list for this project."
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
                  ? "Create your first task to get started."
                  : "Try adjusting your search or status filter."
              }
            />
          ) : (
            <div className="grid gap-4">
              {taskStatusOptions.map((status) => {
                const statusTasks = tasksByStatus[status] ?? [];
                if (statusTasks.length === 0) return null;
                return (
                  <Card key={status} className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {status}
                      </p>
                      <h4 className="text-sm font-semibold">
                        {statusTasks.length}{" "}
                        {statusTasks.length === 1 ? "task" : "tasks"}
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {statusTasks.map((task) => (
                        <div
                          key={task.id}
                          className="rounded-lg bg-slate-50 p-3 flex flex-wrap items-center justify-between gap-2"
                        >
                          <div className="flex-1">
                            <button
                              type="button"
                              onClick={() => openTaskModal(task)}
                              className="text-sm font-semibold text-slate-900 hover:text-slate-600"
                            >
                              {task.title}
                            </button>
                            {task.description ? (
                              <p className="mt-1 text-xs text-slate-500">
                                {task.description}
                              </p>
                            ) : null}
                          </div>
                          {status !== "done" && (
                            <Select
                              value={status}
                              onChange={(event) =>
                                handleMoveTask(task.id, event.target.value as TaskStatus)
                              }
                              className="text-xs"
                            >
                              {taskStatusOptions.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </Select>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <Modal
            open={isTaskModalOpen}
            id="task-detail-modal"
            title={activeTask ? "Edit task" : "View task"}
            onClose={closeTaskModal}
            footer={
              activeTask && (
                <Button onClick={() => handleUpdateTask(activeTask)}>
                  Save task
                </Button>
              )
            }
          >
            {activeTask ? (
              <TaskForm
                defaultValues={{
                  title: activeTask.title,
                  description: activeTask.description,
                  status: activeTask.status,
                }}
                submitLabel="Save task"
                onSubmit={handleUpdateTask}
              />
            ) : null}
          </Modal>
        </>
      ) : null}
    </div>
  );
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params);
  return (
    <Suspense>
      <ProjectDetailContent id={id} />
    </Suspense>
  );
}
