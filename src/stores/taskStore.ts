import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Priority = "high" | "medium" | "low";

export interface Task {
  id: number;
  title: string;
  description: string;
  tags: string[];
  deadline: string;
  priority: Priority;
  completedAt?: string | null;
  createdAt: string;
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
  isAiSettingsModalOpen: boolean; // Thêm trạng thái cho modal
  addTask: (task: Omit<Task, "id" | "createdAt">) => void; // Không cần createdAt khi thêm
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  toggleTaskStatus: (id: number) => void;
  setTasks: (tasks: Task[]) => void;
  setAiConfig: (config: AiConfig) => void;
  setFocusedTask: (id: number | null) => void;
  toggleAiSettingsModal: () => void; // Thêm hàm toggle
  sortByDeadline: () => void;
  sortByPriority: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      aiConfig: { url: "", apiKey: "", model: "gpt-4o" }, // Đặt giá trị mặc định cho model
      focusedTaskId: null,
      isAiSettingsModalOpen: false, // Giá trị mặc định
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
