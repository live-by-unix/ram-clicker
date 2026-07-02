import { useState, useEffect } from 'react';
import { useGameState } from '@/game/useGameState';
import { audio } from '@/game/audio';
import { CLICK_UPGRADES, COOLING, GENERATORS, IMPORTS, EXPORTS, DDR_LEVELS } from '@/game/config';
import { formatNum } from '@/game/format';
import '@/game/ramclicker.css';

import StatsBar from '@/components/game/StatsBar';
import Panel from '@/components/game/Panel';
import RamStick from '@/components/game/RamStick';
import BuyList from '@/components/game/BuyList';
import FabsDisplay from '@/components/game/FabsDisplay';
import DdrUpgrade from '@/components/game/DdrUpgrade';
import CasinoModal from '@/components/game/CasinoModal';
import PrestigePanel from '@/components/game/PrestigePanel';
import SavePanel from '@/components/game/SavePanel';
import NewsTicker from '@/components/game/NewsTicker';

export default function RamClicker() {
  const game = useGameState();
  const { state, notice, derived, actions } = game;
  const [casinoOpen, setCasinoOpen] = useState(false);
  const [muted, setMuted] = useState(() => localStorage.getItem('rc_muted') === '1');

  useEffect(() => {
    audio.setMuted(muted);
    localStorage.setItem('rc_muted', muted ? '1' : '0');
  }, [muted]);

  const handleOverclock = () => {
    if (actions.overclock()) actions.showNotice('⚡ OVERCLOCK ENGAGED! ×5 (8s)');
  };

  const handleUpgradeDdr = () => {
    if (actions.upgradeDdr()) {
      actions.showNotice(`🔧 Upgraded to ${DDR_LEVELS[state.ddrLevel].name}!`);
    }
  };

  const handlePrestige = () => {
    if (derived.pGain < 1) {
      actions.showNotice('Need 1B+ MHz to Ascend');
      return;
    }
    if (window.confirm(`Ascend? Reset progress for +${formatNum(derived.pGain)} GoldContacts.`)) {
      actions.prestige();
      actions.showNotice(`🚀 ASCENDED! Mult: ×${state.pMult.toFixed(2)}`);
    }
  };

  return (
    <div className="ram-clicker">
      <StatsBar state={state} perSec={derived.perSec} usdPerSec={derived.usdPerSec} silPerSec={derived.silPerSec} />
      <NewsTicker />
      {notice && <div className="rc-notice">{notice}</div>}
      <div className="rc-layout">
        <div className="rc-col">
          <Panel title="Click Upgrades">
            <BuyList items={CLICK_UPGRADES} ownedMap={state.clickUpg} currency={state.mhz} currencyLabel="MHz" onBuy={(item) => actions.buy('clickUpg', item, 'mhz')} />
          </Panel>
          <Panel title="Cooling System">
            <div className="rc-heat-section">
              <div className="rc-heat-label">Heat: {formatNum(state.heat)} / Cooling: {formatNum(derived.cooling)}</div>
              <div className="rc-heat-bar">
                <div className="rc-heat-fill" style={{ width: `${Math.min(100, Math.max(0, (state.heat - derived.cooling) / 20))}%` }} />
              </div>
              <div className="rc-heat-penalty">Production: {Math.round(derived.heatPenalty * 100)}%</div>
            </div>
            <BuyList items={COOLING} ownedMap={state.cool} currency={state.usd} currencyLabel="$" onBuy={(item) => actions.buy('cool', item, 'usd')} />
          </Panel>
          <Panel title="Import Operations">
            <BuyList items={IMPORTS} ownedMap={state.imp} currency={state.usd} currencyLabel="$" onBuy={(item) => actions.buy('imp', item, 'usd')} />
          </Panel>
        </div>

        <div className="rc-col rc-col-center">
          <DdrUpgrade ddr={derived.ddr} nextDdr={derived.nextDdr} mhz={state.mhz} gold={state.gold} onUpgrade={handleUpgradeDdr} />
          <RamStick perClick={derived.perClick} onClick={actions.click} ddrColor={derived.ddr.color} ocActive={derived.ocActive} />
          <div className="rc-actions">
            <button className="rc-btn rc-btn-oc" onClick={handleOverclock} disabled={derived.ocActive || derived.ocOnCooldown}>
              {derived.ocActive ? '⚡ OVERCLOCKING' : derived.ocOnCooldown ? 'Cooldown...' : '⚡ Overclock'}
            </button>
            <button className="rc-btn rc-btn-casino" onClick={() => setCasinoOpen(true)}>🎰 Casino</button>
            <button className="rc-btn rc-btn-prestige" onClick={handlePrestige}>🚀 Ascend</button>
            <button className="rc-btn rc-btn-save" onClick={() => setMuted(m => !m)}>
              {muted ? '🔇 Muted' : '🔊 Sound'}
            </button>
          </div>
          <Panel title="Fabs Online">
            <FabsDisplay generators={GENERATORS} ownedMap={state.gens} />
          </Panel>
          <Panel title="Save Data">
            <SavePanel onExport={actions.exportSave} onImport={actions.importSave} onWipe={actions.wipe} />
          </Panel>
        </div>

        <div className="rc-col">
          <Panel title="Auto-Generators">
            <BuyList items={GENERATORS} ownedMap={state.gens} currency={state.usd} currencyLabel="$" onBuy={(item) => actions.buy('gens', item, 'usd')} />
          </Panel>
          <Panel title="Export Contracts">
            <BuyList items={EXPORTS} ownedMap={state.exp} currency={state.usd} currencyLabel="$" onBuy={(item) => actions.buy('exp', item, 'usd')} />
          </Panel>
          <Panel title="Prestige">
            <PrestigePanel gold={state.gold} pMult={state.pMult} prestigeGain={derived.pGain} onPrestige={handlePrestige} />
          </Panel>
        </div>
      </div>
      <CasinoModal open={casinoOpen} onClose={() => setCasinoOpen(false)} mhz={state.mhz} actions={actions} />
    </div>
  );
}