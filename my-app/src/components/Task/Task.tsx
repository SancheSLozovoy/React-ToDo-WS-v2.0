import React from 'react';
import './Task.css'
import { TaskProps } from '../../types/Task.type';

class Task extends React.Component<TaskProps> {

    handleEdit = () => {
        const newTitle = prompt("edit task title", this.props.title);
        if(newTitle && newTitle.trim() !== ""){
            this.props.onEdit(this.props.id, newTitle.trim())
        }
    }

    render(){

        const { title, completed, onToggle, onDelete, id} = this.props;

        const titleClass = completed ? 'task-title completed' : 'task-title';

        return(
            <div className="task-container">
                <div className="task-content">
                    <span className={titleClass}>{title}</span>
                    <div className="button-container">
                        <input type="checkbox" checked={completed} onChange={() => onToggle(id)}></input>
                        <button onClick={() => onDelete(id)}>Delete</button>
                        <button className='change-button' onClick={this.handleEdit}>Change</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Task;