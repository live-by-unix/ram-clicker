import { useState } from 'react';

export default function CasinoModal({ open, onClose, mhz, actions }) {
  const [results, setResults] = useState({});

  if (!open) return null;

  const run = (game) => {
    const result = actions[game]();
    setResults(prev => ({ ...prev, [game]: result }));
  };

  return (
    <div className="rc-casino-overlay" onClick={onClose}>
      <div className="rc-casino-box" onClick={e => e.stopPropagation()}>
        <div className="rc-casino-header">
          <h2>🎰 SILICON CASINO</h2>
          <button className="rc-casino-close" onClick={onClose}>✕</button>
        </div>
        <div className="rc-casino-info">
          Available: <b>{Math.floor(mhz).toLocaleString()}</b> MHz · Jackpot: <b className="rc-gold">HynixGodStick ×1000</b>
        </div>
        <div className="rc-casino-game">
          <h4>Silicon Slots</h4>
          <button className="rc-casino-btn" onClick={() => run('slots')}>Spin (1% MHz)</button>
          {results.slots && <div className="rc-casino-result">{results.slots.reels.join(' ')} — {results.slots.result}</div>}
        </div>
        <div className="rc-casino-game">
          <h4>Wafer Roulette</h4>
          <button className="rc-casino-btn" onClick={() => run('roulette')}>Spin (2% MHz)</button>
          {results.roulette && <div className="rc-casino-result">{results.roulette.result}</div>}
        </div>
        <div className="rc-casino-game">
          <h4>Overclock Blackjack</h4>
          <button className="rc-casino-btn" onClick={() => run('blackjack')}>Deal (3% MHz)</button>
          {results.blackjack && <div className="rc-casino-result">{results.blackjack.result}</div>}
        </div>
        <div className="rc-casino-game">
          <h4>Will It Boot? Coinflip</h4>
          <button className="rc-casino-btn" onClick={() => run('coinflip')}>Flip (5% MHz)</button>
          {results.coinflip && <div className="rc-casino-result">{results.coinflip.result}</div>}
        </div>
      </div>
    </div>
  );
}