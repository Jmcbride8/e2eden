import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';

export default function Pie3D({ data, colors }) {
  const [rotationX, setRotationX] = useState(25);
  const [rotationY, setRotationY] = useState(45);
  const [rotationZ, setRotationZ] = useState(0);

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
      {/* Rotation Controls */}
      <div className="w-full px-4 space-y-4 bg-white/5 rounded-lg p-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-white/70">Rotate X</label>
            <span className="text-sm text-white/50">{rotationX}°</span>
          </div>
          <Slider
            value={[rotationX]}
            onValueChange={(val) => setRotationX(val[0])}
            min={-90}
            max={90}
            step={1}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-white/70">Rotate Y</label>
            <span className="text-sm text-white/50">{rotationY}°</span>
          </div>
          <Slider
            value={[rotationY]}
            onValueChange={(val) => setRotationY(val[0])}
            min={0}
            max={360}
            step={1}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-white/70">Rotate Z</label>
            <span className="text-sm text-white/50">{rotationZ}°</span>
          </div>
          <Slider
            value={[rotationZ]}
            onValueChange={(val) => setRotationZ(val[0])}
            min={0}
            max={360}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* 3D Chart */}
      <div
        style={{
          perspective: '1000px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.1s ease-out'
          }}
        >
          <svg width="300" height="300" viewBox="0 0 300 300">
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
              </filter>
            </defs>

            {slices.map((slice) => (
              <g key={slice.id} filter="url(#shadow)">
                <path
                  d={createPath(slice)}
                  fill={slice.color}
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="0.5"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
                <path
                  d={createPath(slice)}
                  fill={`color-mix(in srgb, ${slice.color} 60%, black)`}
                  opacity="0.6"
                  transform={`translate(0, 8)`}
                  className="pointer-events-none"
                />
              </g>
            ))}

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

            <circle cx={centerX} cy={centerY} r="20" fill="rgba(0,0,0,0.1)" className="pointer-events-none" />
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full px-4">
        {slices.map((slice) => (
          <div key={slice.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-xs text-white/70">
              {slice.name || `Slice ${slice.id + 1}`}: {slice.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}