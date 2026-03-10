import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Mail, User, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function ContactSubmissions() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: () => base44.entities.ContactSubmission.list("-created_date", 100),
    enabled: !!user,
  });

  if (!user || (user.role !== "admin" && user.company !== "E2Eden")) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/50">Access denied.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Contact Submissions</h1>
        <p className="text-white/50 text-sm mb-8">{submissions.length} total responses</p>

        {isLoading ? (
          <p className="text-white/40">Loading...</p>
        ) : submissions.length === 0 ? (
          <p className="text-white/40">No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((s) => (
              <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{s.reason}</Badge>
                  <span className="text-white/40 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {s.created_date ? format(new Date(s.created_date), "MMM d, yyyy · h:mm a") : "—"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mb-3 text-sm">
                  <span className="text-white flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-white/40" />{s.name}</span>
                  <a href={`mailto:${s.email}`} className="text-amber-400 hover:underline flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />{s.email}
                  </a>
                </div>
                <p className="text-white/70 text-sm whitespace-pre-wrap flex gap-2">
                  <MessageSquare className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                  {s.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}