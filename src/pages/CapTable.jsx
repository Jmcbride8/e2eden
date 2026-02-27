import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Check, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InvestmentForm from "../components/cap-table/InvestmentForm";
import Pie3D from "../components/cap-table/Pie3D";
import { createPageUrl } from "../utils";
import { format } from "date-fns";

const COLORS = ['#fbbf24', '#60a5fa', '#34d399', '#f87171', '#a78bfa', '#fb923c'];

export default function CapTable() {
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const checkAdmin = async () => {
      const user = await base44.auth.me();
      setIsAdmin(user?.role === 'admin');
    };
    checkAdmin();
  }, []);

  const { data: investors = [] } = useQuery({
    queryKey: ['investors'],
    queryFn: () => base44.entities.Investor.list('-created_date'),
  });

  const updateInvestorMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Investor.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
    },
  });

  const deleteInvestorMutation = useMutation({
    mutationFn: (id) => base44.entities.Investor.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
    },
  });

  // Calculate totals for approved investors
  const approvedInvestors = investors.filter(inv => inv.status === 'approved');
  const totalInvestment = approvedInvestors.reduce((sum, inv) => sum + (inv.investment_amount || 0), 0);

  // Recalculate ownership percentages
  const investorsWithCalculatedOwnership = approvedInvestors.map(inv => ({
    ...inv,
    ownership_percentage: totalInvestment > 0 ? ((inv.investment_amount / totalInvestment) * 100).toFixed(2) : 0
  }));

  const pieChartData = investorsWithCalculatedOwnership.map(inv => ({
    name: inv.name,
    value: parseFloat(inv.ownership_percentage)
  }));

  const handleApprove = (investor) => {
    const ownership = totalInvestment > 0 
      ? ((investor.investment_amount / (totalInvestment + investor.investment_amount)) * 100).toFixed(2)
      : 100;
    
    updateInvestorMutation.mutate({
      id: investor.id,
      data: { status: 'approved', ownership_percentage: ownership }
    });
  };

  const handleReject = (investor) => {
    updateInvestorMutation.mutate({
      id: investor.id,
      data: { status: 'rejected' }
    });
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    approved: { icon: Check, color: 'text-green-400', bg: 'bg-green-500/20' },
    rejected: { icon: X, color: 'text-red-400', bg: 'bg-red-500/20' }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 sm:px-8 sm:pt-28">
        {/* Back Button */}
        <Link to={createPageUrl("Funding")}>
          <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Funding
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Cap Table
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Current ownership structure and investment tracking
          </p>
        </motion.div>

        {/* Ownership Chart */}
        {pieChartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            <Card className="bg-white/[0.04] border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Ownership Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <Pie3D data={pieChartData} colors={COLORS} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mb-4"
        >
          <Card className="bg-white/[0.04] border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">${totalInvestment.toLocaleString()}</div>
                <div className="text-sm text-white/60 mt-2">Current Valuation</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.04] border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{approvedInvestors.length}</div>
                <div className="text-sm text-white/60 mt-2">Approved Investors</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.04] border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{investors.filter(i => i.status === 'pending').length}</div>
                <div className="text-sm text-white/60 mt-2">Pending Investments</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Investors Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-4"
        >
          <Card className="bg-white/[0.04] border-white/10">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-white">Investors</CardTitle>
              <Button onClick={() => setShowInvestmentForm(true)} className="bg-amber-500 hover:bg-amber-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Propose Investment
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white/70">Name</TableHead>
                      <TableHead className="text-white/70">Email</TableHead>
                      <TableHead className="text-white/70 text-right">Amount</TableHead>
                      <TableHead className="text-white/70 text-right">Ownership %</TableHead>
                      <TableHead className="text-white/70">Date</TableHead>
                      <TableHead className="text-white/70">Status</TableHead>
                      {isAdmin && <TableHead className="text-white/70">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-8 text-white/40">
                          No investors yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      investors.map((investor) => {
                        const config = statusConfig[investor.status];
                        const Icon = config.icon;
                        return (
                          <TableRow key={investor.id} className="border-white/10">
                            <TableCell className="text-white">{investor.name}</TableCell>
                            <TableCell className="text-white/70">{investor.email}</TableCell>
                            <TableCell className="text-right text-white/70">${investor.investment_amount.toLocaleString()}</TableCell>
                            <TableCell className="text-right text-white/70">{investor.ownership_percentage || '-'}%</TableCell>
                            <TableCell className="text-white/70">
                              {investor.investment_date ? format(new Date(investor.investment_date), 'MMM d, yyyy') : '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${config.color}`} />
                                <span className={`text-sm capitalize ${config.color}`}>{investor.status}</span>
                              </div>
                            </TableCell>
                            {isAdmin && (
                              <TableCell className="text-white/70">
                                {investor.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleApprove(investor)}
                                      className="bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs"
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleReject(investor)}
                                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs"
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Investment Form Modal */}
      <InvestmentForm
        isOpen={showInvestmentForm}
        onClose={() => setShowInvestmentForm(false)}
      />
    </div>
  );
}