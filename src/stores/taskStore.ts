import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task, Subtask } from "./types"; // Giả sử bạn sẽ tạo file types.ts
import { getTaskSuggestions } from "../utils/api";

// Di chuyển type ra file riêng để dễ quản lý
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
  priority: "high" | "medium" | "low";
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
  suggestions: string;
  isSuggestionsLoading: boolean;
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
  fetchSuggestions: (task: Task) => Promise<void>;
  clearSuggestions: () => void;
  sortByDeadline: () => void;
  sortByPriority: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      aiConfig: { url: "", apiKey: "", model: "gpt-4o" },
      focusedTaskId: null,
      isAiSettingsModalOpen: false,
      isTaskModalOpen: false,
      editingTask: null,
      suggestions: '',
      isSuggestionsLoading: false,
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
          suggestions: '', // Xóa gợi ý cũ khi mở modal
        }),
      closeTaskModal: () =>
        set({
          isTaskModalOpen: false,
          editingTask: null,
          suggestions: '', // Xóa gợi ý khi đóng modal
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
      fetchSuggestions: async (task) => {
        set({ isSuggestionsLoading: true, suggestions: '' });
        try {
          const { aiConfig } = get();
          const suggestions = await getTaskSuggestions(task, aiConfig.apiKey, aiConfig.url, aiConfig.model);
          set({ suggestions, isSuggestionsLoading: false });
        } catch (error: any) {
          console.error(error);
          set({ isSuggestionsLoading: false, suggestions: `Lỗi: ${error.message}` });
        }
      },
      clearSuggestions: () => set({ suggestions: '' }),
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
          newTasks.sort((a: Task, b: Task) => {
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
