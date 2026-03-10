import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { Send, CheckCircle } from "lucide-react";

function generateMathQuestion() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", honeypot: "" });
  const [captcha] = useState(generateMathQuestion);
  const [captchaInput, setCaptchaInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Honeypot check
    if (form.honeypot) return;

    // Captcha check
    if (parseInt(captchaInput) !== captcha.answer) {
      setError("Incorrect answer to the math question. Please try again.");
      return;
    }

    setSubmitting(true);
    await base44.integrations.Core.SendEmail({
      to: "info@e2eden.com",
      subject: `Contact Form: ${form.subject}`,
      body: `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    });
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <CheckCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Message Sent</h2>
          <p className="text-white/60">Thank you for reaching out. We'll get back to you soon.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Get In Touch</h1>
            <p className="text-white/60 text-lg">
              Interested in partnering, investing, or learning more? We'd love to hear from you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot - hidden from real users */}
            <input
              type="text"
              name="website"
              value={form.honeypot}
              onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-white/70 text-sm mb-1.5 block">Name *</label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1.5 block">Email *</label>
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50"
                />
              </div>
            </div>

            <div>
              <label className="text-white/70 text-sm mb-1.5 block">Subject *</label>
              <Input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="What's this about?"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="text-white/70 text-sm mb-1.5 block">Message *</label>
              <Textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your interest..."
                rows={6}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 resize-none"
              />
            </div>

            {/* Math Captcha */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <label className="text-white/70 text-sm mb-2 block">
                Spam check: What is {captcha.a} + {captcha.b}? *
              </label>
              <Input
                required
                type="number"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Your answer"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 w-32"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-6 text-base font-semibold"
            >
              {submitting ? "Sending..." : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}