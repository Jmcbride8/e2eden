import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { createPageUrl } from "@/utils";

const COLORS = ['#fbbf24', '#60a5fa', '#34d399', '#f87171', '#a78bfa', '#fb923c'];

export default function CapTablePreview() {
  const { data: investors = [] } = useQuery({
    queryKey: ['investors'],
    queryFn: () => base44.entities.Investor.list(),
  });

  const approvedInvestors = investors.filter(inv => inv.status === 'approved');
  const totalInvestment = approvedInvestors.reduce((sum, inv) => sum + (inv.investment_amount || 0), 0);

  const pieChartData = useMemo(() => {
    return approvedInvestors.map(inv => ({
      name: inv.name,
      value: totalInvestment > 0 ? ((inv.investment_amount / totalInvestment) * 100).toFixed(2) : 0
    }));
  }, [approvedInvestors, totalInvestment]);

  if (pieChartData.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-white">Ownership Structure</h4>
        <Link to={createPageUrl("CapTable")}>
          <Button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Cap Table
          </Button>
        </Link>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={95}
            innerRadius={0}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `${value.toFixed(2)}%`}
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}