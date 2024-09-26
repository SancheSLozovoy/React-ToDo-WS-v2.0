import React from 'react';
import './Task.css';
import { TaskProps } from '../../types/Task.type';

const Task: React.FC<TaskProps> = ({ id, title, completed, onToggle, onDelete, onEdit }) => {

    const handleEdit = () => {
        const newTitle = prompt("Edit task title", title);
        if (newTitle && newTitle.trim() !== "") {
            onEdit(id, newTitle.trim());
        }
    };

    const titleClass = completed ? 'task-title completed' : 'task-title';

    return (
        <div className="task-container">
            <div className="task-content">
                <span className={titleClass}>{title}</span>
                <div className="button-container">
                    <input type="checkbox" checked={completed} onChange={() => onToggle(id)} />
                    <button onClick={() => onDelete(id)}>Delete</button>
                    <button className="change-button" onClick={handleEdit}>Change</button>
                </div>
            </div>
        </div>
    );
};

export default Task;
