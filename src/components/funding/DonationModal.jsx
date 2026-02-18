import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function DonationModal({ isOpen, onClose, projectName = null }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // No financial functionality yet - just close the modal
    alert("Thank you for your interest! Payment processing will be available soon.");
    onClose();
  };

  const suggestedAmounts = [50, 100, 500, 1000, 5000];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/10 p-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-500/20 mb-4">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {projectName ? `Donate to ${projectName}` : "Make a Donation"}
              </h2>
              <p className="text-sm text-white/60">
                Your contribution helps us create sustainable solutions for communities worldwide.
              </p>
            </div>

            {/* Suggested Amounts */}
            <div>
              <Label className="text-white/80 mb-2 block">Select Amount</Label>
              <div className="grid grid-cols-3 gap-2">
                {suggestedAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      formData.amount === amount.toString()
                        ? "bg-pink-500/30 text-pink-300 border-2 border-pink-500/50"
                        : "bg-white/[0.06] text-white/80 border border-white/10 hover:bg-white/[0.1]"
                    }`}
                  >
                    ${amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Custom Amount */}
              <div>
                <Label htmlFor="amount" className="text-white/80 mb-2 block">
                  Custom Amount
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/40"
                    required
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-white/80 mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white placeholder:text-white/40"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-white/80 mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white placeholder:text-white/40"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-white/80 mb-2 block">
                  Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Share why you're supporting this cause..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white placeholder:text-white/40 resize-none h-24"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-6"
              >
                Continue to Payment
              </Button>
            </form>

            <p className="text-xs text-white/40 text-center">
              Payment processing coming soon. This is a preview of the donation form.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}