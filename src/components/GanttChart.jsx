import React, { useMemo } from 'react';
import { SUB_TEAM_COLORS, isTaskBlocked } from '../data/tasks';
import { useTasks } from '../context/TaskContext';
import { format, parseISO, differenceInDays, addDays, min, max, isValid } from 'date-fns';

const GanttChart = () => {
    const { tasks, toggleTaskCompletion, loading, error } = useTasks();

    // Calculate timeline range
    const { startDate, endDate, totalDays } = useMemo(() => {
        if (tasks.length === 0) return { startDate: new Date(), endDate: new Date(), totalDays: 1 };

        const startDates = tasks.map(t => t.startDate ? parseISO(t.startDate) : null).filter(d => d && isValid(d));
        const endDates = tasks.map(t => t.deadline ? parseISO(t.deadline) : null).filter(d => d && isValid(d));

        if (startDates.length === 0 || endDates.length === 0) {
            return { startDate: new Date(), endDate: addDays(new Date(), 7), totalDays: 8 };
        }

        const minDate = min(startDates);
        const maxDate = max(endDates);
        // Add some buffer
        const start = addDays(minDate, -2);
        const end = addDays(maxDate, 5);
        const days = differenceInDays(end, start) + 1;
        return { startDate: start, endDate: end, totalDays: days };
    }, [tasks]);

    const daysArray = useMemo(() => {
        return Array.from({ length: totalDays }, (_, i) => addDays(startDate, i));
    }, [startDate, totalDays]);

    if (loading) return <div className="p-8 text-center text-gray-400">Loading Gantt Chart...</div>;
    if (error) return <div className="p-8 text-center text-red-400">{error}</div>;
    if (tasks.length === 0) return <div className="p-8 text-center text-gray-400">No tasks found.</div>;

    return (
        <div className="bg-gray-800 border border-gray-700 flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Project Timeline</h2>
                <div className="flex space-x-4 text-sm">
                    {Object.entries(SUB_TEAM_COLORS).map(([team, color]) => (
                        <div key={team} className="flex items-center">
                            <span className="w-3 h-3 mr-2 border border-gray-600" style={{ backgroundColor: color }}></span>
                            <span className="text-gray-300">{team}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto flex-1 relative">
                <div className="inline-block min-w-full align-middle">
                    <div className="relative" style={{ minWidth: `${totalDays * 40}px` }}>
                        {/* Header Row */}
                        <div className="flex border-b border-gray-700 sticky top-0 bg-gray-800 z-10 h-10">
                            <div className="w-48 flex-shrink-0 border-r border-gray-700 p-2 font-semibold text-xs text-gray-400 bg-gray-800 sticky left-0 z-20">
                                Task
                            </div>
                            {daysArray.map((day, i) => (
                                <div key={i} className="flex-1 min-w-[40px] border-r border-gray-700 text-center text-[10px] text-gray-400 p-1 flex flex-col justify-center">
                                    <span className="font-bold">{format(day, 'd')}</span>
                                    <span>{format(day, 'MMM')}</span>
                                </div>
                            ))}
                        </div>

                        {/* Task Rows */}
                        {tasks.map((task) => {
                            const taskStart = task.startDate ? parseISO(task.startDate) : null;
                            const taskEnd = task.deadline ? parseISO(task.deadline) : null;

                            if (!taskStart || !isValid(taskStart) || !taskEnd || !isValid(taskEnd)) return null;

                            const offsetDays = differenceInDays(taskStart, startDate);
                            const durationDays = differenceInDays(taskEnd, taskStart) + 1; // Inclusive
                            const blocked = isTaskBlocked(task, tasks);

                            return (
                                <div key={task.id} className="flex border-b border-gray-700 hover:bg-gray-750 min-h-[3rem] relative group">
                                    <div className="w-48 flex-shrink-0 border-r border-gray-700 p-2 text-sm font-medium text-gray-200 whitespace-normal break-words flex items-center sticky left-0 bg-gray-800 group-hover:bg-gray-750 z-10">
                                        {task.task}
                                    </div>

                                    {/* Grid lines */}
                                    <div className="absolute left-48 right-0 top-0 bottom-0 flex pointer-events-none">
                                        {daysArray.map((_, i) => (
                                            <div key={i} className="flex-1 min-w-[40px] border-r border-gray-700 h-full"></div>
                                        ))}
                                    </div>

                                    {/* Task Bar */}
                                    <div
                                        className="absolute top-2 bottom-2 border border-gray-900/20 transition-all duration-200 cursor-pointer flex items-center justify-center group/bar"
                                        style={{
                                            left: `calc(12rem + ${offsetDays * 40}px)`, // 12rem is w-48
                                            width: `${durationDays * 40}px`,
                                            backgroundColor: blocked ? '#374151' : SUB_TEAM_COLORS[task.subTeam], // gray-700 for blocked
                                            opacity: blocked ? 0.8 : 1,
                                        }}
                                        onClick={() => !blocked && toggleTaskCompletion(task.id)}
                                        title={`${task.task} (${task.subTeam}) - ${blocked ? 'Blocked by dependencies' : 'Click to toggle completion'}`}
                                    >
                                        {task.completed && (
                                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {blocked && (
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        )}

                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 hidden group-hover/bar:block bg-black text-white text-xs rounded-none py-1 px-2 whitespace-nowrap z-30 border border-gray-600 shadow-sm">
                                            {task.task} ({format(taskStart, 'MMM d')} - {format(taskEnd, 'MMM d')})
                                            {blocked && <div className="text-red-300">Blocked!</div>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
