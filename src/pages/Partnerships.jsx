import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Handshake, Globe, Lightbulb, Users, DollarSign, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageUrl } from "../utils";

const partnershipTypes = [
  {
    icon: Globe,
    title: "Strategic Partners",
    description: "Join forces to expand our global reach and impact. Collaborate on large-scale projects that transform communities.",
    benefits: ["Joint project development", "Shared resources", "Co-branding opportunities"],
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    icon: Lightbulb,
    title: "Technology Partners",
    description: "Innovate together by integrating cutting-edge technologies into our sustainable solutions.",
    benefits: ["R&D collaboration", "Technology integration", "Innovation labs"],
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    icon: DollarSign,
    title: "Investment Partners",
    description: "Fund transformative projects that deliver both financial returns and measurable social impact.",
    benefits: ["Equity participation", "Revenue sharing", "Impact reporting"],
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    icon: Users,
    title: "Community Partners",
    description: "Work with NGOs, governments, and local organizations to ensure projects serve communities effectively.",
    benefits: ["Local expertise", "Community engagement", "Sustainable development"],
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  }
];

const whyPartner = [
  "Proven track record across 6 continents",
  "Measurable environmental and social impact",
  "Innovative sustainable engineering solutions",
  "Strong local and global networks",
  "Transparent operations and reporting",
  "Long-term commitment to projects"
];

export default function Partnerships() {
  return (
    <div className="min-h-screen bg-black p-6 sm:p-8 pt-24 sm:pt-28">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to={createPageUrl("Home")}>
          <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/[0.08] mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Handshake className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">Partnerships</h1>
              <p className="text-white/40 mt-1">Building the future together</p>
            </div>
          </div>
          <p className="text-lg text-white/60 max-w-3xl leading-relaxed">
            We believe in the power of collaboration. Partner with E2Eden to create sustainable solutions 
            that transform communities and restore ecosystems across the globe.
          </p>
        </motion.div>

        {/* Partnership Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Partnership Opportunities</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {partnershipTypes.map((type, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
              >
                <Card className={`bg-white/[0.04] border ${type.border} backdrop-blur-sm h-full hover:bg-white/[0.06] transition-colors`}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${type.bg} border ${type.border}`}>
                        <type.icon className={`w-6 h-6 ${type.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl mb-2">{type.title}</CardTitle>
                        <p className="text-white/60 text-sm leading-relaxed">{type.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {type.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                          <CheckCircle2 className={`w-4 h-4 ${type.color} flex-shrink-0`} />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Partner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Why Partner with E2Eden?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {whyPartner.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/70">{reason}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Our Partners</h2>
          <Card className="bg-white/[0.04] border-white/10 backdrop-blur-sm">
            <CardContent className="py-12">
              <p className="text-white/40 text-center text-sm">
                Partner logos and testimonials coming soon
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to Make an Impact Together?
              </h2>
              <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                Let's discuss how we can collaborate to create sustainable solutions that benefit communities 
                and the environment. Reach out to explore partnership opportunities.
              </p>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white px-8">
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}