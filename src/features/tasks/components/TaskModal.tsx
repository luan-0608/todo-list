import React from 'react';
import Modal from 'react-modal';
import TaskForm from './TaskForm';
import type { Task } from '../../../stores/taskStore';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

Modal.setAppElement('#root');

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Task Modal"
      closeTimeoutMS={50}
    >
      <TaskForm task={task} onClose={onClose} />
    </Modal>
  );
};

export default TaskModal;