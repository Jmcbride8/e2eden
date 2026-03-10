import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const REASONS = [
  "Venture Investment",
  "Explore Partnerships",
  "Grant Inquiry",
  "General Inquiry",
  "Media / Press",
  "Supplier / Vendor",
  "Research Collaboration",
  "Other",
];

function generateMath() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
}

export default function ContactModal({ isOpen, onClose, defaultReason }) {
  const [form, setForm] = useState({ name: "", email: "", reason: defaultReason || "", message: "", honeypot: "" });
  const [captcha] = useState(generateMath);
  const [captchaInput, setCaptchaInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setSubmitted(false);
    setForm({ name: "", email: "", reason: defaultReason || "", message: "", honeypot: "" });
    setCaptchaInput("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.honeypot) return;
    if (parseInt(captchaInput) !== captcha.answer) {
      setError("Incorrect answer. Please try again.");
      return;
    }
    setSubmitting(true);
    await Promise.all([
      base44.integrations.Core.SendEmail({
        to: "info@e2eden.com",
        subject: `[${form.reason}] Contact from ${form.name}`,
        body: `Name: ${form.name}\nEmail: ${form.email}\nReason: ${form.reason}\n\n${form.message}`,
      }),
      base44.entities.ContactSubmission.create({
        name: form.name,
        email: form.email,
        reason: form.reason,
        message: form.message,
      }),
    ]);
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl z-10"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-14 h-14 text-amber-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent</h3>
                <p className="text-white/60">We'll be in touch soon.</p>
                <Button className="mt-6 bg-amber-500 hover:bg-amber-600" onClick={handleClose}>Close</Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-1">Get In Touch</h2>
                <p className="text-white/50 text-sm mb-6">We'd love to hear from you.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot */}
                  <input type="text" name="website" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-xs mb-1 block">Name *</label>
                      <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs mb-1 block">Email *</label>
                      <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Reason *</label>
                    <select
                      required
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      className="w-full rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="" disabled className="bg-gray-900">Select a reason...</option>
                      {REASONS.map((r) => (
                        <option key={r} value={r} className="bg-gray-900">{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Message *</label>
                    <Textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." rows={4} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none" />
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <label className="text-white/60 text-xs mb-1.5 block">
                      Spam check: What is {captcha.a} + {captcha.b}? *
                    </label>
                    <Input required type="number" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Answer" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 w-28" />
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <Button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                    {submitting ? "Sending..." : <><Send className="w-4 h-4 mr-2" />Send Message</>}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}