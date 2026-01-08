import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TaskList from './components/TaskList';
import GanttChart from './components/GanttChart';
import PrintView from './components/PrintView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TaskList />} />
        <Route path="gantt" element={<GanttChart />} />
      </Route>
      <Route path="/print" element={<PrintView />} />
    </Routes>
  );
}

export default App;
