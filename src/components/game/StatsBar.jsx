import { formatNum, formatUsd } from '@/game/format';

export default function StatsBar({ state, perSec, usdPerSec, silPerSec }) {
  return (
    <div className="rc-topbar">
      <div className="rc-title">⚡ RAM CLICKER</div>
      <div className="rc-stats">
        <Stat label="MHz" value={formatNum(state.mhz)} sub={`+${formatNum(perSec)}/s`} color="cyan" />
        <Stat label="Dollars" value={formatUsd(state.usd)} sub={`+${formatUsd(usdPerSec)}/s`} color="green" />
        <Stat label="Silicon" value={formatNum(state.sil)} sub={`+${formatNum(silPerSec)}/s`} color="silver" />
        <Stat label="GoldContacts" value={formatNum(state.gold)} sub={`×${state.pMult.toFixed(2)}`} color="gold" />
        <Stat label="Heat" value={formatNum(state.heat)} sub="" color="pink" />
      </div>
    </div>
  );
}

function Stat({ label, value, sub, color }) {
  return (
    <div className={`rc-stat rc-stat-${color}`}>
      <div className="rc-stat-label">{label}</div>
      <div className="rc-stat-value">{value}</div>
      {sub && <div className="rc-stat-sub">{sub}</div>}
    </div>
  );
}