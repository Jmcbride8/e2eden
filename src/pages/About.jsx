import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function About() {
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

      {/* Values Section */}
      <section className="py-24 px-6 sm:px-12 bg-black">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-white mb-12"
          >
            Our Values
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Innovation",
                description: "We push the boundaries of what's possible in agricultural technology."
              },
              {
                title: "Sustainability",
                description: "Every solution we create puts environmental stewardship at the core."
              },
              {
                title: "Impact",
                description: "We measure success by the lives improved and land restored."
              },
              {
                title: "Collaboration",
                description: "We partner with universities, governments, and farmers to scale solutions globally."
              }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <h3 className="text-xl font-bold text-amber-400 mb-3">{value.title}</h3>
                <p className="text-white/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-24 px-6 sm:px-12 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-white mb-12 text-center"
          >
            Meet the Team
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Chief Executive Officer",
                bio: "Former agriculture tech innovator with 15 years of industry experience."
              },
              {
                name: "Dr. Marcus Chen",
                role: "Chief Technology Officer",
                bio: "PhD in Environmental Engineering, leading our saltwater cooling research."
              },
              {
                name: "Elena Rodriguez",
                role: "Head of Partnerships",
                bio: "Building relationships with global governments and agricultural stakeholders."
              },
              {
                name: "James Patterson",
                role: "Director of Operations",
                bio: "Scaling field operations across three continents with precision and impact."
              }
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="rounded-xl bg-white/5 border border-white/10 p-6 hover:border-amber-500/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-amber-400 text-sm font-semibold mb-3">{member.role}</p>
                <p className="text-white/60 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
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