import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, MapPin, DollarSign, ExternalLink, Edit, Trash2, Check, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ConferenceModal from "../components/conferences/ConferenceModal";
import { format } from "date-fns";

export default function Conferences() {
  const [showModal, setShowModal] = useState(false);
  const [editingConference, setEditingConference] = useState(null);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: conferences = [], isLoading } = useQuery({
    queryKey: ['conferences'],
    queryFn: () => base44.entities.Conference.list('-start_date'),
  });

  const { data: attendances = [] } = useQuery({
    queryKey: ['conference-attendances'],
    queryFn: () => base44.entities.ConferenceAttendance.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Conference.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conferences'] });
    },
  });

  const attendanceMutation = useMutation({
    mutationFn: async ({ conferenceId, status }) => {
      const existing = attendances.find(a => a.conference_id === conferenceId && a.user_email === user.email);
      if (existing) {
        if (status === 'not_attending') {
          return base44.entities.ConferenceAttendance.delete(existing.id);
        }
        return base44.entities.ConferenceAttendance.update(existing.id, { status });
      } else {
        return base44.entities.ConferenceAttendance.create({
          conference_id: conferenceId,
          user_email: user.email,
          status
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conference-attendances'] });
    },
  });

  const handleEdit = (conference) => {
    setEditingConference(conference);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this conference?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingConference(null);
  };

  const getUserAttendance = (conferenceId) => {
    if (!user) return null;
    return attendances.find(a => a.conference_id === conferenceId && a.user_email === user.email);
  };

  const getAttendanceCounts = (conferenceId) => {
    const conferenceAttendances = attendances.filter(a => a.conference_id === conferenceId);
    return {
      attending: conferenceAttendances.filter(a => a.status === 'attending').length,
      maybe: conferenceAttendances.filter(a => a.status === 'maybe').length
    };
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-black p-6 sm:p-8 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to={createPageUrl("Home")}>
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/[0.08] mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">Conferences & Meetings</h1>
            <p className="text-white/60">Upcoming events and networking opportunities</p>
          </div>
          {isAdmin && (
            <Button 
              onClick={() => setShowModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Conference
            </Button>
          )}
        </div>

        {/* Conferences Table */}
        {isLoading ? (
          <div className="text-white/60 text-center py-12">Loading...</div>
        ) : conferences.length === 0 ? (
          <div className="bg-white/[0.04] border border-white/10 backdrop-blur-sm rounded-lg p-12 text-center">
            <p className="text-white/40">No conferences scheduled yet</p>
          </div>
        ) : (
          <div className="bg-white/[0.04] border border-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/[0.02]">
                  <TableHead className="text-white/80 font-semibold">Conference</TableHead>
                  <TableHead className="text-white/80 font-semibold">Dates</TableHead>
                  <TableHead className="text-white/80 font-semibold">Location</TableHead>
                  <TableHead className="text-white/80 font-semibold">Cost</TableHead>
                  <TableHead className="text-white/80 font-semibold">Attendance</TableHead>
                  <TableHead className="text-white/80 font-semibold">Actions</TableHead>
                  {isAdmin && <TableHead className="text-white/80 font-semibold">Admin</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {conferences.map((conference) => {
                  const userAttendance = getUserAttendance(conference.id);
                  const counts = getAttendanceCounts(conference.id);
                  const isPast = new Date(conference.start_date) < new Date();

                  return (
                    <TableRow key={conference.id} className={`border-white/10 hover:bg-white/[0.02] ${isPast ? 'opacity-60' : ''}`}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="text-white mb-1">{conference.name}</div>
                          {conference.link && (
                            <a 
                              href={conference.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Event Link
                            </a>
                          )}
                          {conference.description && (
                            <p className="text-xs text-white/50 mt-1 max-w-xs">{conference.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-white/70">
                        <div className="text-sm">
                          {format(new Date(conference.start_date), 'MMM d, yyyy')}
                          {conference.end_date && conference.end_date !== conference.start_date && (
                            <div className="text-xs text-white/50">to {format(new Date(conference.end_date), 'MMM d, yyyy')}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-white/70 text-sm">{conference.location}</TableCell>
                      <TableCell className="text-white/70 text-sm">
                        {conference.cost === 0 ? 'Free' : `$${conference.cost}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-3 text-xs text-white/60">
                          <span className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            {counts.attending}
                          </span>
                          <span className="flex items-center gap-1">
                            <HelpCircle className="w-3 h-3 text-amber-400" />
                            {counts.maybe}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user && !isPast && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => attendanceMutation.mutate({ 
                                conferenceId: conference.id, 
                                status: userAttendance?.status === 'attending' ? 'not_attending' : 'attending' 
                              })}
                              className={userAttendance?.status === 'attending' 
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-2 text-xs' 
                                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 h-8 px-2 text-xs'}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => attendanceMutation.mutate({ 
                                conferenceId: conference.id, 
                                status: userAttendance?.status === 'maybe' ? 'not_attending' : 'maybe' 
                              })}
                              className={userAttendance?.status === 'maybe' 
                                ? 'bg-amber-500 hover:bg-amber-600 text-white h-8 px-2 text-xs' 
                                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 h-8 px-2 text-xs'}
                            >
                              <HelpCircle className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                              onClick={() => handleEdit(conference)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                              onClick={() => handleDelete(conference.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {showModal && (
        <ConferenceModal
          conference={editingConference}
          onClose={handleCloseModal}
          userEmail={user?.email}
        />
      )}
    </div>
  );
}