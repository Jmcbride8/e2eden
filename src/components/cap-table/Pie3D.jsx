import React from 'react';

export default function Pie3D({ data, colors }) {
  const rotationX = 30;
  const rotationY = 35;
  const rotationZ = 0;

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
  const depth = 24;

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
    <div className="flex justify-center w-full">
      <div
        style={{
          perspective: '1200px',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <svg width="360" height="360" viewBox="0 0 300 300">
            <defs>
              <filter id="pie-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="3" dy="6" stdDeviation="4" floodOpacity="0.4" />
              </filter>
              <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Render bottom face first */}
            {slices.map((slice) => (
              <path
                key={`bottom-${slice.id}`}
                d={createPath(slice)}
                fill={`color-mix(in srgb, ${slice.color} 40%, black)`}
                opacity="0.7"
                transform={`translate(0, ${depth})`}
                className="pointer-events-none"
              />
            ))}

            {/* Render side edges */}
            {slices.map((slice) => {
              const startRad = (slice.startAngle * Math.PI) / 180;
              const endRad = (slice.endAngle * Math.PI) / 180;
              const x1 = centerX + radius * Math.cos(startRad);
              const y1 = centerY + radius * Math.sin(startRad);
              const x2 = centerX + radius * Math.cos(endRad);
              const y2 = centerY + radius * Math.sin(endRad);

              return (
                <g key={`side-${slice.id}`}>
                  <path
                    d={`M ${x1} ${y1} L ${x1} ${y1 + depth} L ${x2} ${y2 + depth} L ${x2} ${y2} Z`}
                    fill={`color-mix(in srgb, ${slice.color} 55%, black)`}
                    opacity="0.8"
                    className="pointer-events-none"
                  />
                </g>
              );
            })}

            {/* Render top face with glossy effect */}
            {slices.map((slice) => (
              <g key={slice.id} filter="url(#pie-shadow)">
                <path
                  d={createPath(slice)}
                  fill={slice.color}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="0.8"
                  className="hover:brightness-110 transition-all cursor-pointer"
                />
                <path
                  d={createPath(slice)}
                  fill="url(#shine)"
                  className="pointer-events-none"
                />
              </g>
            ))}

            {/* Center shine effect */}
            <circle cx={centerX} cy={centerY} r="18" fill="url(#shine)" className="pointer-events-none" opacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  );
}