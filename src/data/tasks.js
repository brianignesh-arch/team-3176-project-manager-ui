import { addDays, parseISO, format, isValid, parse } from 'date-fns';
import Papa from 'papaparse';

const parseDate = (dateString) => {
  if (!dateString) return null;

  // Try parsing as ISO first
  let date = parseISO(dateString);
  if (isValid(date)) return date.toISOString().split('T')[0];

  // Try parsing as standard JS Date (handles M/D/YYYY etc)
  date = new Date(dateString);
  if (isValid(date)) return date.toISOString().split('T')[0];

  return null;
};

export const SUB_TEAMS = {
  DESIGN: 'Design',
  ELECTRICAL: 'Electrical',
  PROGRAMMING: 'Programming',
  FABRICATION: 'Fabrication',
};

export const SUB_TEAM_COLORS = {
  [SUB_TEAMS.DESIGN]: '#AECBFA', // Pastel Blue
  [SUB_TEAMS.ELECTRICAL]: '#FDE68A', // Pastel Yellow
  [SUB_TEAMS.PROGRAMMING]: '#A7F3D0', // Pastel Green
  [SUB_TEAMS.FABRICATION]: '#FECACA', // Pastel Red
};

export const initialTasks = [
  // Mock data kept for structure reference, though not used when sheetUrl is present
  {
    id: '1',
    task: 'Chassis Design',
    overview: 'Design the main robot chassis in CAD',
    subTeam: SUB_TEAMS.DESIGN,
    preRequisites: [],
    requiredFor: ['4', '5'],
    startDate: '2025-01-10',
    deadline: '2025-01-15',
    totalDays: 5,
    personResponsible: 'Alice',
    completed: true,
  },
];

export const getTasksSortedByDeadline = (tasks) => {
  return [...tasks].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });
};

export const isTaskBlocked = (task, allTasks) => {
  if (!task.preRequisites || task.preRequisites.length === 0) return false;
  return task.preRequisites.some(reqId => {
    // Handle both ID-based and Name-based dependencies
    // The sheet might use task names or IDs. We'll try to match by ID first, then Name.
    const reqTask = allTasks.find(t => t.id === reqId || t.task === reqId);
    return reqTask && !reqTask.completed;
  });
};

export const fetchTasksFromSheet = async (sheetUrl) => {
  return new Promise((resolve, reject) => {
    Papa.parse(sheetUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Helper to get value case-insensitively and trimming whitespace
          const getValue = (row, ...keys) => {
            const normalizedKeys = keys.map(k => k.toLowerCase().replace(/\s+/g, ''));
            const rowKeys = Object.keys(row);
            for (const rk of rowKeys) {
              const normalizedRk = rk.toLowerCase().replace(/\s+/g, '');
              if (normalizedKeys.includes(normalizedRk)) {
                return row[rk];
              }
            }
            return undefined;
          };

          const parsedTasks = results.data.map((row, index) => {
            // Map CSV columns to Task interface
            // "Task, Simple Overview, Sub-Team, Pre-Requisites, Required For, Start-Date, Deadline, Total Days, Person Responsible, Completed, Spots Needed"

            const taskName = getValue(row, 'Task', 'Task Name') || 'Untitled Task';
            const overview = getValue(row, 'Simple Overview', 'Overview', 'Description') || '';

            return {
              id: String(index + 1), // Generate an ID if not present
              task: taskName,
              overview: overview,
              subTeam: getValue(row, 'Sub-Team', 'Sub Team', 'Team') || 'General',
              preRequisites: String(getValue(row, 'Pre-Requisites', 'Prerequisites') || '').split(/[;,]/).map(s => s.trim()).filter(Boolean),
              requiredFor: String(getValue(row, 'Required For', 'RequiredFor') || '').split(/[;,]/).map(s => s.trim()).filter(Boolean),
              startDate: parseDate(getValue(row, 'Start-Date', 'Start Date')) || new Date().toISOString().split('T')[0],
              deadline: parseDate(getValue(row, 'Deadline', 'Due Date')),
              totalDays: parseInt(getValue(row, 'Total Days', 'Duration')) || 1,
              personResponsible: getValue(row, 'Person Responsible', 'Owner') || 'Unassigned',
              completed: ['true', 'yes', 'y', '1', 'done', 'complete'].includes(String(getValue(row, 'Completed', 'Status')).toLowerCase()),
              spotsNeeded: parseInt(getValue(row, 'Spots Needed', 'Spots', 'Slots')) || 3, // Default to 3 spots if missing
            };
          });

          // Filter out completely empty rows that might be parsed
          const validTasks = parsedTasks.filter(t => t.task !== 'Untitled Task' || t.overview !== '');

          if (validTasks.length === 0) {
            console.warn("No valid tasks found in sheet.");
          }

          resolve(validTasks);
        } catch (error) {
          console.error("Error parsing CSV data:", error);
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
