import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

export default function Pie3D({ data, colors }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${((value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name, props) => {
            const total = data.reduce((sum, item) => sum + item.value, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${percentage}%`;
          }}
          contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', color: '#fff' }}
        />
        <Legend wrapperStyle={{ color: 'rgba(255, 255, 255, 0.7)', paddingTop: '20px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}