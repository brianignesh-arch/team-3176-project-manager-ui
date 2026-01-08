import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasksSortedByDeadline, SUB_TEAM_COLORS } from '../data/tasks';
import { useTasks } from '../context/TaskContext';
import { format, parseISO, isValid } from 'date-fns';

const TaskList = () => {
    const navigate = useNavigate();
    const { tasks, loading, error } = useTasks();
    const sortedTasks = useMemo(() => getTasksSortedByDeadline(tasks), [tasks]);

    const handlePrint = () => {
        navigate('/print');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Task List</h2>
                    <p className="mt-1 text-sm text-gray-400">Sorted by soonest deadline</p>
                </div>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-none shadow-none text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                    Print Sign-up Sheet
                </button>
            </div>

            {loading && <div className="text-center py-4 text-gray-400">Loading tasks...</div>}
            {error && <div className="text-center py-4 text-red-400">{error}</div>}

            {!loading && !error && (
                <div className="bg-gray-800 border border-gray-700">
                    <ul className="divide-y divide-gray-700">
                        {sortedTasks.map((task) => (
                            <li key={task.id} className="hover:bg-gray-750 transition-colors duration-150">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <p className="text-sm font-bold text-white truncate">{task.task}</p>
                                            <span
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium border border-gray-600"
                                                style={{
                                                    backgroundColor: SUB_TEAM_COLORS[task.subTeam],
                                                    color: '#1f2937', // Dark gray text for contrast on pastel
                                                }}
                                            >
                                                {task.subTeam}
                                            </span>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-none border ${task.completed ? 'bg-green-900 text-green-100 border-green-700' : 'bg-yellow-900 text-yellow-100 border-yellow-700'
                                                }`}>
                                                {task.completed ? 'Completed' : 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-400">
                                                {task.overview}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                                            <p>
                                                Deadline: {task.deadline && isValid(parseISO(task.deadline)) ? (
                                                    <time dateTime={task.deadline} className="font-medium text-gray-300">
                                                        {format(parseISO(task.deadline), 'MMM d, yyyy')}
                                                    </time>
                                                ) : (
                                                    <span className="text-red-400">Invalid Date</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                                        <span>Responsible: {task.personResponsible}</span>
                                        {task.preRequisites.length > 0 && (
                                            <span>Pre-reqs: {task.preRequisites.join(', ')}</span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TaskList;
