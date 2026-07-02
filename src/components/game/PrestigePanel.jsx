import { formatNum } from '@/game/format';

export default function PrestigePanel({ gold, pMult, prestigeGain: gain, onPrestige }) {
  return (
    <>
      <div className="rc-prestige-info">
        <div>GoldContacts: <span className="rc-gold">{formatNum(gold)}</span></div>
        <div>Permanent Mult: <span className="rc-gold">×{pMult.toFixed(2)}</span></div>
        <div className="rc-prestige-gain">Ascend for: <span className="rc-gold">+{formatNum(gain)}</span></div>
      </div>
      <button
        className={`rc-btn rc-btn-prestige ${gain >= 1 ? '' : 'disabled'}`}
        onClick={onPrestige}
        disabled={gain < 1}
      >
        🚀 OverclockAscension
      </button>
    </>
  );
}