import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Briefcase, Settings, LogOut, Users, Calendar, Shield, ListChecks, TrendingUp, Inbox, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "../../utils";
import { base44 } from "@/api/base44Client";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setIsAuthenticated(true);
    }).catch(() => {
      setUser(null);
      setIsAuthenticated(false);
    });
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  const menuItems = [
    { icon: Briefcase, label: "Projects", path: createPageUrl("Projects") },
    { icon: Users, label: "CRM", path: createPageUrl("CRM") },
    { icon: Calendar, label: "Conferences", path: createPageUrl("Conferences") },
    { icon: ListChecks, label: "Task Manager", path: createPageUrl("TaskManager") },
    ...(user?.role === 'admin' ? [{ icon: Shield, label: "User Management", path: createPageUrl("UserManagement") }] : []),
    ...(user?.company === 'E2Eden' || user?.role === 'admin' ? [{ icon: TrendingUp, label: "Cap Table", path: createPageUrl("CapTable") }] : []),
    ...(user?.role === 'admin' && user?.company === 'E2Eden' ? [{ icon: Inbox, label: "Contact Responses", path: createPageUrl("ContactSubmissions") }] : []),
    { icon: Settings, label: "Profile Settings", path: createPageUrl("Profile") },
  ];

  const handleSignIn = () => {
    base44.auth.redirectToLogin();
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleSignIn}
        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-all shadow-lg shadow-amber-500/20"
      >
        Sign In
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.08] transition-all"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white/70" />
        ) : (
          <Menu className="w-5 h-5 text-white/70" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed top-20 right-6 sm:right-8 z-50 w-64 rounded-2xl bg-white/[0.08] backdrop-blur-2xl border border-white/10 overflow-hidden"
            >
              {user && (
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    {user.profile_picture ? (
                      <img 
                        src={user.profile_picture} 
                        alt={user.full_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
                        style={{ objectPosition: user.profile_picture_position || 'center center' }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">{user.full_name}</p>
                      <p className="text-xs text-white/40">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-white/[0.08] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}