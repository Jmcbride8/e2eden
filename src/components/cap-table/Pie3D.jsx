import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Pie3D({ data, colors }) {
  const grayScaleColors = ['#808080', '#696969', '#585858', '#474747', '#363636', '#c0c0c0', '#a9a9a9', '#999999'];

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
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={grayScaleColors[index % grayScaleColors.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name, props) => {
            const total = data.reduce((sum, item) => sum + item.value, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${percentage}%`;
          }}
          contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', color: '#ffffff' }}
          itemStyle={{ color: '#ffffff' }}
          labelStyle={{ color: '#ffffff' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}