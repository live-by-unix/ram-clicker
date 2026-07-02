import { formatNum } from '@/game/format';

export default function DdrUpgrade({ ddr, nextDdr, mhz, gold, onUpgrade }) {
  const canUpgrade = nextDdr && mhz >= nextDdr.upgradeCost && (!nextDdr.goldReq || gold >= nextDdr.goldReq);

  return (
    <div className="rc-ddr" style={{ '--ddr-color': ddr.color }}>
      <div className="rc-ddr-current" style={{ color: ddr.color, textShadow: `0 0 15px ${ddr.color}` }}>
        {ddr.name}
      </div>
      <div className="rc-ddr-mult">Production ×{ddr.mult}</div>
      {nextDdr ? (
        <>
          <div className="rc-ddr-next">
            Next: <span style={{ color: nextDdr.color }}>{nextDdr.name}</span> (×{nextDdr.mult})
          </div>
          {nextDdr.goldReq && (
            <div className="rc-ddr-req">Requires {nextDdr.goldReq} GoldContacts</div>
          )}
          <button
            className={`rc-ddr-btn ${canUpgrade ? '' : 'disabled'}`}
            onClick={() => canUpgrade && onUpgrade()}
            style={!canUpgrade ? {} : { borderColor: nextDdr.color, boxShadow: `0 0 15px ${nextDdr.color}` }}
          >
            Upgrade — {formatNum(nextDdr.upgradeCost)} MHz
          </button>
        </>
      ) : (
        <div className="rc-ddr-max">⚡ MAX GENERATION ⚡</div>
      )}
    </div>
  );
}