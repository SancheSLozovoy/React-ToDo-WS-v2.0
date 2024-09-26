import React, { useEffect, useState } from 'react';
import Task from '../Task/Task';
import './TaskList.css';
import UserSelect from '../TaskSelectUser/TaskSelectUser';
import { TaskService } from '../../service/TaskService';
import { TaskProps } from '../../types/Task.type';
import { TasksContainer, TasksList, ListTitle, ButtonContainer } from './TaskListStyle';

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const [filterTasks, setFilterTasks] = useState<TaskProps[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            const tasks = await TaskService.loadTasks();
            setTasks(tasks);
            setFilterTasks(tasks);
        };
        fetchTasks();
    }, []);

    const filterTasksByUser = (userId: number | null) => {
        if (userId === null) {
            setFilterTasks(tasks);
        } else {
            setFilterTasks(tasks.filter(task => task.userId === userId));
        }
    };

    const handleUserChange = (userId: number | null) => {
        setSelectedUserId(userId);
        filterTasksByUser(userId);
    };

    const deleteTask = async (id: number) => {
        try {
            await TaskService.deleteTask(id);
            setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
            setFilterTasks(prevFilterTasks => prevFilterTasks.filter(task => task.id !== id))
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const markAllTasks = () => {
        const updatedTasks = tasks.map(task => {
            if (!selectedUserId || task.userId === selectedUserId) {
                return { ...task, completed: true };
            }
            return task;
        });

        setTasks(updatedTasks);

        if (selectedUserId) {
            setFilterTasks(updatedTasks.filter(task => task.userId === selectedUserId));
        } else {
            setFilterTasks(updatedTasks);
        }
    };

    const deleteMarks = async () => {
        const tasksToDelete = tasks.filter(task => task.completed && (!selectedUserId || task.userId === selectedUserId));
        try {
            await Promise.all(tasksToDelete.map(task => TaskService.deleteTask(task.id)));
            const remainingTasks = tasks.filter(task => !(task.completed && (!selectedUserId || task.userId === selectedUserId)));
            
            setTasks(remainingTasks);

            if (selectedUserId) {
                setFilterTasks(remainingTasks.filter(task => task.userId === selectedUserId));
            } else {
                setFilterTasks(remainingTasks);
            }
        } catch (error) {
            console.error('Error deleting tasks:', error);
        }
    };
    
    
    const toggleTask = (id: number) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        setTasks(updatedTasks);
        setFilterTasks(updatedTasks);
    };

    const addTask = async (title: string) => {
        if (!title.trim()) {
            return;
        }

        const maxId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) : 0;

        try {
            const newTask = {
                id: maxId + 1,
                title,
                completed: false,
                userId: selectedUserId || 1,
                onToggle: toggleTask,
                onDelete: deleteTask,
                onEdit: updateTask,
            };

            await TaskService.addTask(newTask.title, newTask.userId);

            setTasks(prevState => [...prevState, newTask]);
            setFilterTasks(prevState => [...prevState, newTask]);
        } catch (error) {
            console.error("Error adding task", error);
        }
    }

    const handleAddTask = () => {
        const title = prompt("Enter a title");
        if (title) {
            addTask(title)
        }
    }

    const updateTask = async (id: number, title: string) => {
        const taskToUpdate = tasks.find(task => task.id === id);

        if (!taskToUpdate) {
            return;
        }

        try {
            const updatedTasks = await TaskService.updateTask(id, title, taskToUpdate.completed, taskToUpdate.userId);
            setTasks(prevState => prevState.map(tasks => tasks.id === id ? updatedTasks : tasks));
            setFilterTasks(prevState => prevState.map(tasks => tasks.id === id ? updatedTasks : tasks));
        } catch (error) {
            console.error("Error update", error)
        }
    }

    const userIds = Array.from(new Set(tasks.map(task => task.userId)));

    return (
        <TasksContainer>
            <ListTitle>Tasks List</ListTitle>
            <ButtonContainer>
                <button className="add-button" onClick={handleAddTask}>Add task</button>
                <button className="mark-button" onClick={markAllTasks}>Mark all</button>
                <button className="delete-button" onClick={deleteMarks}>Delete completed</button>
                <UserSelect
                    userIds={userIds}
                    selectedUserId={selectedUserId}
                    onUserChange={handleUserChange}
                />
            </ButtonContainer>
            <TasksList>
                {filterTasks.map(task => (
                    <Task
                        key={task.id}
                        title={task.title}
                        id={task.id}
                        completed={task.completed}
                        userId={task.userId}
                        onDelete={deleteTask}
                        onToggle={toggleTask}
                        onEdit={updateTask}
                    />
                ))}
            </TasksList>
        </TasksContainer>
    );
}

export default TaskList;
