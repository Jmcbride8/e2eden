import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

export default function TaskUpdateForm({ taskId, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    comment: '',
    update_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.comment.trim()) {
      onSubmit({ ...formData, task_id: taskId });
      setFormData({ comment: '', update_date: new Date().toISOString().split('T')[0] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/10 rounded-lg p-4 space-y-3">
      <div>
        <label className="text-xs text-white/50 mb-1 block">Update Date</label>
        <Input
          type="date"
          value={formData.update_date}
          onChange={(e) => setFormData({ ...formData, update_date: e.target.value })}
          className="bg-white/5 border-white/10 text-white text-sm"
        />
      </div>
      <div>
        <label className="text-xs text-white/50 mb-1 block">Comment</label>
        <Textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Add an update..."
          className="bg-white/5 border-white/10 text-white placeholder-white/40 text-sm h-20"
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm"
        >
          Add Update
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}