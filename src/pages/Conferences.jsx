import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, MapPin, DollarSign, ExternalLink, Edit, Trash2, Check, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

        {/* Conferences List */}
        {isLoading ? (
          <div className="text-white/60 text-center py-12">Loading...</div>
        ) : conferences.length === 0 ? (
          <Card className="bg-white/[0.04] border-white/10 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <p className="text-white/40">No conferences scheduled yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {conferences.map((conference) => {
              const userAttendance = getUserAttendance(conference.id);
              const counts = getAttendanceCounts(conference.id);
              const isPast = new Date(conference.start_date) < new Date();

              return (
                <motion.div
                  key={conference.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className={`bg-white/[0.04] border-white/10 backdrop-blur-sm hover:bg-white/[0.06] transition-colors ${isPast ? 'opacity-60' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                              <Calendar className="w-6 h-6 text-amber-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="text-xl font-semibold text-white mb-1">{conference.name}</h3>
                                  {isPast && <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Past Event</Badge>}
                                </div>
                                {isAdmin && (
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
                                )}
                              </div>
                              
                              <div className="space-y-2 mt-3">
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                  <Calendar className="w-4 h-4 text-white/40" />
                                  <span>
                                    {format(new Date(conference.start_date), 'MMM d, yyyy')}
                                    {conference.end_date && conference.end_date !== conference.start_date && 
                                      ` - ${format(new Date(conference.end_date), 'MMM d, yyyy')}`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                  <MapPin className="w-4 h-4 text-white/40" />
                                  <span>{conference.location}</span>
                                </div>
                                {conference.cost !== undefined && conference.cost !== null && (
                                  <div className="flex items-center gap-2 text-sm text-white/60">
                                    <DollarSign className="w-4 h-4 text-white/40" />
                                    <span>{conference.cost === 0 ? 'Free' : `$${conference.cost}`}</span>
                                  </div>
                                )}
                                {conference.link && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <ExternalLink className="w-4 h-4 text-white/40" />
                                    <a 
                                      href={conference.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-amber-400 hover:text-amber-300 transition-colors"
                                    >
                                      Event Link
                                    </a>
                                  </div>
                                )}
                                {conference.owner && (
                                  <div className="text-xs text-white/40 mt-2">
                                    Added by {conference.owner}
                                  </div>
                                )}
                                {conference.description && (
                                  <p className="text-sm text-white/50 mt-2">{conference.description}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Attendance Section */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="flex gap-4 text-sm text-white/60">
                              <span className="flex items-center gap-1">
                                <Check className="w-4 h-4 text-emerald-400" />
                                {counts.attending} attending
                              </span>
                              <span className="flex items-center gap-1">
                                <HelpCircle className="w-4 h-4 text-amber-400" />
                                {counts.maybe} maybe
                              </span>
                            </div>
                            
                            {user && !isPast && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant={userAttendance?.status === 'attending' ? 'default' : 'outline'}
                                  onClick={() => attendanceMutation.mutate({ 
                                    conferenceId: conference.id, 
                                    status: userAttendance?.status === 'attending' ? 'not_attending' : 'attending' 
                                  })}
                                  className={userAttendance?.status === 'attending' 
                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                                    : 'border-white/10 text-white/70 hover:bg-white/10'}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  {userAttendance?.status === 'attending' ? 'Attending' : 'Will Attend'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant={userAttendance?.status === 'maybe' ? 'default' : 'outline'}
                                  onClick={() => attendanceMutation.mutate({ 
                                    conferenceId: conference.id, 
                                    status: userAttendance?.status === 'maybe' ? 'not_attending' : 'maybe' 
                                  })}
                                  className={userAttendance?.status === 'maybe' 
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                                    : 'border-white/10 text-white/70 hover:bg-white/10'}
                                >
                                  <HelpCircle className="w-4 h-4 mr-1" />
                                  {userAttendance?.status === 'maybe' ? 'Maybe' : 'May Attend'}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
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