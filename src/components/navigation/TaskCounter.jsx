import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { CheckSquare } from 'lucide-react';

export default function TaskCounter() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const { data: openTasks = [] } = useQuery({
    queryKey: ['myOpenTasks', currentUser?.email],
    queryFn: async () => {
      if (!currentUser?.email) return [];
      const allTasks = await base44.entities.Task.list();
      return allTasks.filter(
        task => task.assigned_to === currentUser.email && task.status !== 'completed'
      );
    },
    enabled: !!currentUser?.email && !!currentUser?.company,
  });

  // Only show if user is logged in, has a company, and has open tasks
  if (!currentUser?.company || openTasks.length === 0) {
    return null;
  }

  return (
    <Link to={createPageUrl('TaskManager')} className="relative">
      <button className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
        <CheckSquare className="w-5 h-5" />
        {openTasks.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {openTasks.length > 9 ? '9+' : openTasks.length}
          </span>
        )}
      </button>
    </Link>
  );
}