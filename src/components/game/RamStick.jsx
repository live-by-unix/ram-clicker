import { useState } from 'react';
import { formatNum } from '@/game/format';

export default function RamStick({ perClick, onClick, ddrColor, ocActive }) {
  const [floats, setFloats] = useState([]);

  const handleClick = (e) => {
    const result = onClick();
    if (!result) return;
    const id = Date.now() + Math.random();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFloats(prev => [...prev, {
      id, x, y,
      text: (result.crit ? 'CRIT +' : '+') + formatNum(result.value),
      color: result.crit ? '#ffd000' : (ocActive ? '#ff00e6' : ddrColor),
    }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 1000);
  };

  return (
    <div className="rc-ram-wrap">
      <div className="rc-ram-container" onClick={handleClick} style={{ '--ram-color': ddrColor }}>
        <div className={`rc-ram-stick ${ocActive ? 'rc-ram-oc' : ''}`}>
          <div className="rc-ram-heatsink" />
          <div className="rc-ram-label">DDR</div>
          <div className="rc-ram-chips">
            <div className="rc-ram-chip" /><div className="rc-ram-chip" />
            <div className="rc-ram-chip" /><div className="rc-ram-chip" />
          </div>
          <div className="rc-ram-chips rc-ram-chips-2">
            <div className="rc-ram-chip" /><div className="rc-ram-chip" />
            <div className="rc-ram-chip" /><div className="rc-ram-chip" />
          </div>
          <div className="rc-ram-chips rc-ram-chips-3">
            <div className="rc-ram-chip" /><div className="rc-ram-chip" /><div className="rc-ram-chip" />
          </div>
          <div className="rc-ram-contacts" />
        </div>
        {floats.map(f => (
          <div key={f.id} className="rc-float" style={{ left: f.x, top: f.y, color: f.color }}>
            {f.text}
          </div>
        ))}
      </div>
      <div className="rc-click-info">
        +<span style={{ color: ddrColor }}>{formatNum(perClick)}</span> MHz / click
      </div>
    </div>
  );
}