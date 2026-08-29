import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const COLORS = {
  'turbine-01': '#4fd1c5',
  'turbine-02': '#f0a94e',
  'pump-01': '#8b96a5',
};

function Sparkline({ deviceId, series }) {
  const latest = series.length ? series[series.length - 1].value : null;
  return (
    <div className="nf-metric-card">
      <div className="nf-metric-card__head">
        <span className="mono nf-metric-card__id">{deviceId}</span>
        <span className="mono nf-metric-card__value" style={{ color: COLORS[deviceId] || '#e7ecf3' }}>
          {latest !== null ? latest.toFixed(1) : '—'}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={64}>
        <LineChart data={series}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={COLORS[deviceId] || '#4fd1c5'}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Dashboard({ seriesByDevice }) {
  const deviceIds = Object.keys(seriesByDevice);

  return (
    <div className="nf-dashboard">
      <div className="nf-eyebrow mono">03 · LIVE TELEMETRY</div>
      {deviceIds.length === 0 && (
        <div className="nf-empty mono">Waiting for telemetry stream…</div>
      )}
      <div className="nf-dashboard__grid">
        {deviceIds.map((id) => (
          <Sparkline key={id} deviceId={id} series={seriesByDevice[id]} />
        ))}
      </div>

      {deviceIds.length > 0 && (
        <div className="nf-combined-chart">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart>
              <CartesianGrid stroke="#232a34" strokeDasharray="3 3" />
              <XAxis dataKey="t" hide />
              <YAxis stroke="#566072" width={30} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip
                contentStyle={{ background: '#171c24', border: '1px solid #232a34', fontSize: 12 }}
                labelStyle={{ display: 'none' }}
              />
              {deviceIds.map((id) => (
                <Line
                  key={id}
                  data={seriesByDevice[id].map((p, i) => ({ t: i, value: p.value }))}
                  dataKey="value"
                  name={id}
                  stroke={COLORS[id] || '#4fd1c5'}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}