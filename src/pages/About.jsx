import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TeamCard from "../components/about/TeamCard";
import BrandsTicker from "../components/about/BrandsTicker.jsx";

export default function About() {
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  const { data: allMembers = [] } = useQuery({
    queryKey: ['team'],
    queryFn: () => base44.entities.Team.list('sort_order')
  });

  const teamMembers = allMembers.filter(m => !m.section || m.section === 'Team');
  const partners = allMembers.filter(m => m.section === 'Partners');

  useEffect(() => {
    const checkAdmin = async () => {
      const user = await base44.auth.me();
      setIsAdmin(user?.role === 'admin');
    };
    checkAdmin();
  }, []);

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Team.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] })
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id) => base44.entities.Team.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] })
  });

  const createMemberMutation = useMutation({
    mutationFn: (data) => base44.entities.Team.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] })
  });

  const handleAddMember = () => {
    createMemberMutation.mutate({
      name: "New Team Member",
      role: "Role",
      label: "Team Member",
      section: "Team",
      bio: "Bio",
      sort_order: allMembers.length
    });
  };

  const handleAddPartner = () => {
    createMemberMutation.mutate({
      name: "New Partner",
      role: "Organization",
      label: "Partner",
      section: "Partners",
      bio: "Bio",
      sort_order: allMembers.length
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="pt-32 pb-24 px-6 sm:px-12 bg-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              About E2Eden
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl">
              A global team dedicated to revolutionizing agriculture and securing water for the next generation.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Team Members Section */}
      <section className="px-6 sm:px-12 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold text-white"
            >
              Our Team
            </motion.h2>
            {isAdmin && (
              <Button onClick={handleAddMember} className="bg-amber-500 hover:bg-amber-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <TeamCard
                key={member.id}
                member={member}
                isAdmin={isAdmin}
                onMemberUpdate={(id, data) => updateMemberMutation.mutate({ id, data })}
                onDelete={(id) => deleteMemberMutation.mutate(id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="px-6 sm:px-12 py-16 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold text-white"
            >
              Partners
            </motion.h2>
            {isAdmin && (
              <Button onClick={handleAddPartner} className="bg-amber-500 hover:bg-amber-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Partner
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partners.map((member) => (
              <TeamCard
                key={member.id}
                member={member}
                isAdmin={isAdmin}
                onMemberUpdate={(id, data) => updateMemberMutation.mutate({ id, data })}
                onDelete={(id) => deleteMemberMutation.mutate(id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brands Ticker Section */}
      <section className="py-12 px-6 sm:px-12 bg-black">
        <div className="max-w-6xl mx-auto">
          <BrandsTicker isAdmin={isAdmin} />
        </div>
      </section>
    </div>
  );
}