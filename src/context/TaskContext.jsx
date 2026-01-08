import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchTasksFromSheet, initialTasks } from '../data/tasks';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sheetUrl, setSheetUrl] = useState(() => localStorage.getItem('sheetUrl') || '');

    const updateSheetUrl = (url) => {
        setSheetUrl(url);
        localStorage.setItem('sheetUrl', url);
    };

    const toggleTaskCompletion = (taskId) => {
        setTasks(prevTasks => prevTasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        ));
    };

    const refreshTasks = () => {
        if (sheetUrl) {
            setLoading(true);
            // Append timestamp to avoid caching
            const urlWithTimestamp = sheetUrl.includes('?')
                ? `${sheetUrl}&t=${Date.now()}`
                : `${sheetUrl}?t=${Date.now()}`;

            fetchTasksFromSheet(urlWithTimestamp)
                .then(fetchedTasks => {
                    setTasks(fetchedTasks);
                    setError(null);
                })
                .catch(err => {
                    console.error(err);
                    setError("Failed to load tasks from Google Sheet. Please check the URL and try again.");
                    setTasks(initialTasks); // Fallback
                })
                .finally(() => setLoading(false));
        } else {
            setTasks(initialTasks);
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshTasks();
    }, [sheetUrl]);

    return (
        <TaskContext.Provider value={{ tasks, loading, error, sheetUrl, updateSheetUrl, toggleTaskCompletion, refreshTasks }}>
            {children}
        </TaskContext.Provider>
    );
};
