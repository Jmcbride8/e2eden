import React from 'react';

export default function Pie3D({ data, colors }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const sliceAngle = (item.value / total) * 360;
    const color = colors[index % colors.length];
    
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    return {
      id: index,
      percentage,
      sliceAngle,
      startAngle,
      endAngle,
      color,
      name: item.name
    };
  });

  const radius = 120;
  const centerX = 150;
  const centerY = 150;

  const createPath = (slice) => {
    const startRad = (slice.startAngle * Math.PI) / 180;
    const endRad = (slice.endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = slice.sliceAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <svg width="100%" height="300" viewBox="0 0 300 300" className="max-w-2xl">
        {/* 3D Effect - Bottom shadow */}
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Render slices with 3D effect */}
        {slices.map((slice) => (
          <g key={slice.id} filter="url(#shadow)">
            {/* Top surface */}
            <path
              d={createPath(slice)}
              fill={slice.color}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="0.5"
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
            
            {/* Bottom edge for 3D effect */}
            <path
              d={createPath(slice)}
              fill={
                `color-mix(in srgb, ${slice.color} 60%, black)`
              }
              opacity="0.6"
              transform={`translate(0, 8)`}
              className="pointer-events-none"
            />
          </g>
        ))}

        {/* Side edges for 3D effect */}
        {slices.map((slice) => {
          const startRad = (slice.startAngle * Math.PI) / 180;
          const x1 = centerX + radius * Math.cos(startRad);
          const y1 = centerY + radius * Math.sin(startRad);

          return (
            <line
              key={`edge-${slice.id}`}
              x1={x1}
              y1={y1}
              x2={x1}
              y2={y1 + 8}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.5"
              className="pointer-events-none"
            />
          );
        })}

        {/* Center circle for 3D depth */}
        <circle cx={centerX} cy={centerY} r="20" fill="rgba(0,0,0,0.1)" className="pointer-events-none" />
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4">
        {slices.map((slice) => (
          <div key={slice.id} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-sm text-white/70">
              {slice.name || `Slice ${slice.id + 1}`}: {slice.percentage.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}