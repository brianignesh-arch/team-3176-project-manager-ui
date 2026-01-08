import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

const Layout = () => {
    const { sheetUrl, updateSheetUrl, refreshTasks, loading } = useTasks();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-900 font-mono text-gray-100">
            <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-white tracking-tight uppercase">Project Manager</h1>
                        </div>
                        <nav className="flex space-x-8">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive
                                        ? 'border-blue-400 text-white'
                                        : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200'
                                    }`
                                }
                            >
                                Task List
                            </NavLink>
                            <NavLink
                                to="/gantt"
                                className={({ isActive }) =>
                                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive
                                        ? 'border-blue-400 text-white'
                                        : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200'
                                    }`
                                }
                            >
                                Gantt Chart
                            </NavLink>
                        </nav>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={refreshTasks}
                                disabled={loading}
                                className={`p-2 rounded-none text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none transition-colors ${loading ? 'animate-spin' : ''}`}
                                title="Refresh Data"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className="p-2 rounded-none text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                                title="Settings"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {isSettingsOpen && (
                <div className="bg-gray-800 border-b border-gray-700 p-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-300">Google Sheet CSV URL:</label>
                        <input
                            type="text"
                            value={sheetUrl}
                            onChange={(e) => updateSheetUrl(e.target.value)}
                            placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                            className="flex-1 rounded-none border border-gray-600 bg-gray-700 text-white shadow-none focus:border-blue-400 focus:ring-0 sm:text-sm p-2 placeholder-gray-500"
                        />
                        <div className="text-xs text-gray-500">
                            File &gt; Share &gt; Publish to web &gt; CSV
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
