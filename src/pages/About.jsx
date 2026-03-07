import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TeamCard from "../components/about/TeamCard";

export default function About() {
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team'],
    queryFn: () => base44.entities.Team.list('sort_order')
  });

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
      bio: "Bio",
      sort_order: teamMembers.length
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="pt-32 pb-24 px-6 sm:px-12 bg-black">
        <div className="max-w-4xl mx-auto">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" className="mb-8 text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Our Team
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl">
              A global team dedicated to revolutionizing agriculture and securing water for the next generation.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Team Members Section */}
      <section className="py-24 px-6 sm:px-12 bg-black">
        <div className="max-w-6xl mx-auto">
          {isAdmin && (
            <div className="flex justify-end mb-8">
              <Button onClick={handleAddMember} className="bg-amber-500 hover:bg-amber-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
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

      {/* Mission Section */}
      <section className="py-24 px-6 sm:px-12 bg-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-white/70 leading-relaxed mb-4">
              We're on a mission to unlock Earth's abundance by pioneering technology that transforms how we grow food and use water. By developing saltwater cooling walls, we're making it possible to feed 10 billion people while preserving our most precious resource.
            </p>
            <p className="text-lg text-white/70 leading-relaxed">
              Every member of our team brings expertise, passion, and commitment to solving one of humanity's greatest challenges: ensuring food security in a water-scarce world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 sm:px-12 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Join Our Mission</h2>
            <p className="text-lg text-white/70 mb-8">
              We're always looking for talented individuals who share our vision of a water-secure future.
            </p>
            <Link to={createPageUrl("Partnerships")}>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg font-semibold">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}