import React, { useMemo } from 'react';
import { getTasksSortedByDeadline, SUB_TEAM_COLORS } from '../data/tasks';
import { useTasks } from '../context/TaskContext';
import { format, parseISO, isValid } from 'date-fns';

const PrintView = () => {
    const { tasks, loading, error } = useTasks();
    const sortedTasks = useMemo(() => getTasksSortedByDeadline(tasks), [tasks]);

    if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

    return (
        <div className="p-8 bg-white min-h-screen text-black print:p-0 font-mono">
            {/* Note: We force bg-white and text-black here to ensure it looks like a document even in dark mode app, 
          and especially for printing. */}
            <div className="mb-8 text-center border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold uppercase tracking-wider text-black">Master Task Sign-up Sheet</h1>
                <p className="mt-2 text-lg text-black">Please sign your name in an available slot for the tasks you wish to claim.</p>
            </div>

            <div className="space-y-8">
                {sortedTasks.map((task) => (
                    <div key={task.id} className="break-inside-avoid border border-black p-4 rounded-none shadow-none">
                        {/* Task Header */}
                        <div className="flex justify-between items-start mb-4 border-b border-gray-300 pb-2">
                            <div>
                                <h2 className="text-xl font-bold text-black">{task.task}</h2>
                                <div className="text-sm text-gray-600 mt-1">{task.overview}</div>
                            </div>
                            <div className="text-right">
                                <span
                                    className="inline-block px-2 py-1 text-xs font-bold uppercase tracking-wide border border-black mb-1"
                                    style={{ backgroundColor: SUB_TEAM_COLORS[task.subTeam], color: '#000' }}
                                >
                                    {task.subTeam}
                                </span>
                                <div className="text-sm font-medium text-black">
                                    Due: {task.deadline && isValid(parseISO(task.deadline)) ? format(parseISO(task.deadline), 'MMM d') : 'TBD'}
                                </div>
                            </div>
                        </div>

                        {/* Sign-up Slots */}
                        <div className="grid grid-cols-1 gap-2">
                            <div className="text-xs font-bold uppercase text-gray-500 mb-1">
                                {task.spotsNeeded || 3} Spots Available
                            </div>
                            {Array.from({ length: task.spotsNeeded || 3 }).map((_, index) => (
                                <div key={index} className="flex items-center">
                                    <span className="w-8 text-gray-400 font-mono text-sm">{index + 1}.</span>
                                    <div className="flex-1 border-b border-black border-dotted h-8"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-gray-800 text-white px-6 py-3 border border-transparent hover:bg-gray-700 font-bold rounded-none"
                >
                    Print Now
                </button>
                <p className="mt-2 text-gray-400">Use browser print (Ctrl+P) to save as PDF or print.</p>
            </div>
        </div>
    );
};

export default PrintView;
