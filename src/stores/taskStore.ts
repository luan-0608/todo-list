import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: number;
  title: string;
  description: string;
  tags: string[];
  deadline: string;
  progress: number;
  priority: Priority;
  completedAt?: string | null;
}

interface AiConfig {
  url: string;
  apiKey: string;
}

interface TaskState {
  tasks: Task[];
  aiConfig: AiConfig;
  focusedTaskId: number | null;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  toggleTaskStatus: (id: number) => void;
  setTasks: (tasks: Task[]) => void;
  setAiConfig: (config: AiConfig) => void;
  setFocusedTask: (id: number | null) => void;
  sortByDeadline: () => void;
  sortByPriority: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      aiConfig: { url: '', apiKey: '' },
      focusedTaskId: null,
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: Date.now() }],
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
                  progress: task.progress === 100 ? 0 : 100,
                  completedAt: task.progress === 100 ? null : new Date().toISOString().split('T')[0],
                }
              : task
          ),
        })),
      setTasks: (tasks) => set({ tasks }),
      setAiConfig: (config) => set({ aiConfig: config }),
      setFocusedTask: (id) => set({ focusedTaskId: id }),
      sortByDeadline: () =>
        set((state) => ({
          tasks: [...state.tasks].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()),
        })),
      sortByPriority: () =>
        set((state) => {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return {
            tasks: [...state.tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]),
          };
        }),
    }),
    {
      name: 'task-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks, aiConfig: state.aiConfig }),
    }
  )
);