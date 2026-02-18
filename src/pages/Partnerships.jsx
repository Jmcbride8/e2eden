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
    title: "University Research Partnerships",
    description: "Collaborate with leading universities on research and innovation to advance sustainable agriculture.",
    benefits: ["Joint research initiatives", "Student programs", "Innovation labs"],
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    partners: [
      { name: "MIT Sustainable Agriculture Lab", focus: "Climate Tech Research" },
      { name: "UC Davis Agricultural Research", focus: "Crop Optimization" },
      { name: "Oxford Environmental Science", focus: "Water Systems" }
    ]
  },
  {
    icon: Users,
    title: "Farmers",
    description: "Work directly with farming communities to implement sustainable practices and improve yields.",
    benefits: ["Direct implementation", "Community engagement", "Shared knowledge"],
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    partners: [
      { name: "Imperial Valley Collective", focus: "Large-scale Operations" },
      { name: "African Smallholder Network", focus: "Community Farming" },
      { name: "Middle East Agricultural Alliance", focus: "Desert Farming" }
    ]
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
  const [showForm, setShowForm] = React.useState(false);
  const [selectedPartner, setSelectedPartner] = React.useState(null);
  const [formData, setFormData] = React.useState({ name: "", email: "", company: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Engagement request submitted for ${selectedPartner.name}!`);
    setFormData({ name: "", email: "", company: "", message: "" });
    setShowForm(false);
  };

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
          <h2 className="text-2xl font-bold text-white mb-6">Partners</h2>
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
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {type.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                            <CheckCircle2 className={`w-4 h-4 ${type.color} flex-shrink-0`} />
                            {benefit}
                          </div>
                        ))}
                      </div>
                      {type.partners && (
                        <div className="border-t border-white/10 pt-4">
                          <h4 className="text-sm font-semibold text-white mb-3">Our {type.title}</h4>
                          <div className="space-y-2 mb-4">
                            {type.partners.map((partner, i) => (
                              <div key={i} className="p-2 rounded bg-white/[0.03] border border-white/5">
                                <p className="text-sm text-white font-medium">{partner.name}</p>
                                <p className="text-xs text-white/50">{partner.focus}</p>
                              </div>
                            ))}
                          </div>
                          <Button 
                            onClick={() => {
                              setSelectedPartner(type);
                              setShowForm(true);
                            }}
                            className={`w-full bg-white/10 hover:bg-white/20 text-white text-sm`}
                          >
                            Join Us
                          </Button>
                        </div>
                      )}
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

        {/* Partnership Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Join {selectedPartner?.title}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Company/Organization</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                    placeholder="Your organization"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 h-24 resize-none"
                    placeholder="Tell us about your interest..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}