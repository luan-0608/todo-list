import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Priority = "high" | "medium" | "low";

export interface Subtask {
  title: string;
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  tags: string[];
  deadline: string;
  priority: Priority;
  completedAt?: string | null;
  createdAt: string;
  subtasks: Subtask[];
}

interface AiConfig {
  url: string;
  apiKey: string;
  model: string;
}

interface TaskState {
  tasks: Task[];
  aiConfig: AiConfig;
  focusedTaskId: number | null;
  isAiSettingsModalOpen: boolean;
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  toggleTaskStatus: (id: number) => void;
  setTasks: (tasks: Task[]) => void;
  setAiConfig: (config: AiConfig) => void;
  setFocusedTask: (id: number | null) => void;
  toggleAiSettingsModal: () => void;
  openTaskModal: (task?: Task) => void;
  closeTaskModal: () => void;
  toggleSubtaskStatus: (taskId: number, subtaskTitle: string) => void;
  sortByDeadline: () => void;
  sortByPriority: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      aiConfig: { url: "", apiKey: "", model: "gpt-4o" },
      focusedTaskId: null,
      isAiSettingsModalOpen: false,
      isTaskModalOpen: false,
      editingTask: null,
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Date.now(),
              createdAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),
      updateTask: (updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      toggleTaskStatus: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completedAt: task.completedAt
                    ? null
                    : new Date().toISOString().split("T")[0],
                }
              : task
          ),
        })),
      setTasks: (tasks) => set({ tasks }),
      setAiConfig: (config) => set({ aiConfig: config }),
      setFocusedTask: (id) => set({ focusedTaskId: id }),
      toggleAiSettingsModal: () =>
        set((state) => ({
          isAiSettingsModalOpen: !state.isAiSettingsModalOpen,
        })),
      openTaskModal: (task) =>
        set({
          isTaskModalOpen: true,
          editingTask: task ? task : null,
        }),
      closeTaskModal: () =>
        set({
          isTaskModalOpen: false,
          editingTask: null,
        }),
      toggleSubtaskStatus: (taskId, subtaskTitle) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.title === subtaskTitle
                      ? { ...subtask, completed: !subtask.completed }
                      : subtask
                  ),
                }
              : task
          ),
        })),
      sortByDeadline: () =>
        set((state) => {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          const newTasks = Array.from(state.tasks);
          newTasks.sort((a, b) => {
            const aIsCompleted = !!a.completedAt;
            const bIsCompleted = !!b.completedAt;
            if (aIsCompleted !== bIsCompleted) {
              return aIsCompleted ? 1 : -1;
            }
            if (a.deadline !== b.deadline) {
              return a.deadline.localeCompare(b.deadline);
            }
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          });
          return { tasks: newTasks };
        }),
      sortByPriority: () =>
        set((state) => {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          const newTasks = Array.from(state.tasks);
          newTasks.sort((a, b) => {
            const aIsCompleted = !!a.completedAt;
            const bIsCompleted = !!b.completedAt;
            if (aIsCompleted !== bIsCompleted) {
              return aIsCompleted ? 1 : -1;
            }
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          });
          return { tasks: newTasks };
        }),
    }),
    {
      name: "task-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks, aiConfig: state.aiConfig }),
    }
  )
);
