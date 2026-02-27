import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { format, differenceInDays } from 'date-fns';

export default function TaskGanttChart({ tasks, getUserName, statusColors }) {
  // Prepare data for Gantt chart
  const ganttData = tasks
    .filter(task => task.start_date && task.due_date)
    .map(task => {
      const start = new Date(task.start_date);
      const end = new Date(task.due_date);
      const duration = differenceInDays(end, start) + 1;
      
      return {
        id: task.id,
        title: task.title.substring(0, 30),
        owner: task.assigned_to ? getUserName(task.assigned_to) : 'Unassigned',
        startDate: task.start_date,
        dueDate: task.due_date,
        status: task.status,
        duration: Math.max(duration, 1),
        company: task.assigned_company,
      };
    });

  const statusColorMap = {
    todo: '#6B7280',
    in_progress: '#3B82F6',
    completed: '#10B981',
  };

  if (ganttData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/40">No tasks with start and due dates to display</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-white/5 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={ganttData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="title" type="category" width={190} tick={{ fill: '#e5e7eb', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            labelStyle={{ color: '#fff' }}
            formatter={(value) => `${value} days`}
          />
          <Bar dataKey="duration" fill="#8884d8" radius={[0, 4, 4, 0]}>
            {ganttData.map((entry) => (
              <Cell key={`cell-${entry.id}`} fill={statusColorMap[entry.status]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColorMap.todo }}></div>
          <span className="text-white/70">To Do</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColorMap.in_progress }}></div>
          <span className="text-white/70">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColorMap.completed }}></div>
          <span className="text-white/70">Completed</span>
        </div>
      </div>
    </div>
  );
}