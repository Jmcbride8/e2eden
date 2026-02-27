import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskUpdateForm from './TaskUpdateForm';

export default function TaskUpdateList({ taskId, updates, onAddUpdate, onEditUpdate, onDeleteUpdate, currentUserEmail, isExpanded, onToggleExpand, users }) {
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const taskUpdates = updates.filter(u => u.task_id === taskId);

  const handleAddUpdate = async (data) => {
    await onAddUpdate(data);
    setIsAddingUpdate(false);
  };

  const handleSaveEdit = async (updateId) => {
    await onEditUpdate(updateId, editFormData);
    setEditingId(null);
    setEditFormData(null);
  };

  const getUserName = (email) => {
    const user = users.find(u => u.email === email);
    return user?.full_name || email;
  };

  return (
    <div className="w-full">{isExpanded && (

      <div className="space-y-2">
          {taskUpdates.length === 0 ? (
            <p className="text-white/40 text-sm py-2">No updates yet</p>
          ) : (
            taskUpdates.map(update => (
              <div key={update.id} className="bg-white/[0.05] border border-white/15 rounded p-3">
                {editingId === update.id ? (
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={editFormData.update_date}
                      onChange={(e) => setEditFormData({ ...editFormData, update_date: e.target.value })}
                      className="w-full bg-white/5 border-white/10 border rounded px-2 py-1 text-white text-sm"
                    />
                    <textarea
                      value={editFormData.comment}
                      onChange={(e) => setEditFormData({ ...editFormData, comment: e.target.value })}
                      className="w-full bg-white/5 border-white/10 border rounded px-2 py-1 text-white text-sm h-16"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(update.id)}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white/70 text-xs font-medium">
                          {getUserName(update.created_by)}
                        </span>
                        <span className="text-white/50 text-xs">
                          {format(new Date(update.update_date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      {update.created_by === currentUserEmail && (
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(update.id);
                              setEditFormData(update);
                            }}
                            className="h-6 w-6 text-white/50 hover:text-white hover:bg-white/10"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDeleteUpdate(update.id)}
                            className="h-6 w-6 text-red-400/70 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-white text-sm">{update.comment}</p>
                  </>
                )}
              </div>
            ))
          )}

          {isAddingUpdate ? (
            <TaskUpdateForm
              taskId={taskId}
              onSubmit={handleAddUpdate}
              onCancel={() => setIsAddingUpdate(false)}
            />
          ) : (
            <Button
              onClick={() => setIsAddingUpdate(true)}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm"
            >
              Add Update
            </Button>
          )}
        </div>
      )}
    </div>
  );
}