import Masonry from 'react-masonry-css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import TaskCard from './TaskCard';
import CalendarView from '../../../components/CalendarView';
import { useTaskStore, type Task } from '../../../stores/taskStore';

type ViewMode = 'grid' | 'calendar';

interface TaskViewProps {
  viewMode: ViewMode;
}

const TaskView = ({ viewMode }: TaskViewProps) => {
  const { tasks, setTasks, focusedTaskId, openTaskModal } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
    focusedTaskId: state.focusedTaskId,
    openTaskModal: state.openTaskModal,
  }));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
    500: 1
  };

  return (
    <main>
      {viewMode === 'grid' ? (
        <div className="tasks-grid-container">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tasks} strategy={rectSortingStrategy}>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    onEdit={() => openTaskModal(task)}
                    isFocused={task.id === focusedTaskId}
                    isUnfocused={!!focusedTaskId && task.id !== focusedTaskId}
                    {...task}
                  />
                ))}
              </Masonry>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <CalendarView tasks={tasks} onTaskClick={(task) => openTaskModal(task)} />
      )}
    </main>
  );
};

export default TaskView;