import { useRef, useState, useEffect, useCallback } from 'react';
import {
  DDR_LEVELS, EVENTS, OC_DURATION, OC_COOLDOWN,
  CRIT_CHANCE, CRIT_MULT, HEAT_DISSIPATION
} from './config';
import { audio } from './audio';
import {
  computeCost, computePerClick, computePerSec, computeHeatRate,
  computeUsdPerSec, computeSilPerSec, prestigeGain,
  getDdr, getNextDdr, computeCooling, computeHeatPenalty
} from './logic';

const SAVE_KEY = 'ramclicker_v2';

const DEFAULT_STATE = {
  mhz: 0, usd: 0, sil: 0, gold: 0, heat: 0,
  ddrLevel: 0, ocEnd: 0, ocCooldownEnd: 0,
  jackpot: 1, jackpotEnd: 0, pMult: 1,
  clickUpg: {}, cool: {}, gens: {}, imp: {}, exp: {},
};

function loadState() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) return { ...DEFAULT_STATE, ...JSON.parse(saved) };
  } catch { /* noop */ }
  return { ...DEFAULT_STATE };
}

export function useGameState() {
  const stateRef = useRef(loadState());
  const modsRef = useRef({ prod: 1, click: 1 });
  const noticeTimerRef = useRef(null);
  const [notice, setNotice] = useState(null);
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick(t => (t + 1) % 1000000), []);

  const showNotice = useCallback((msg) => {
    setNotice(msg);
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => setNotice(null), 5000);
  }, []);

  useEffect(() => {
    let last = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const dt = Math.min((now - last) / 1000, 1);
      last = now;
      const s = stateRef.current;
      s.mhz += computePerSec(s, modsRef.current) * dt;
      s.usd += computeUsdPerSec(s) * dt;
      s.sil += computeSilPerSec(s) * dt;
      s.heat += computeHeatRate(s) * dt;
      s.heat = Math.max(0, s.heat - HEAT_DISSIPATION * dt);
      if (s.jackpotEnd && Date.now() > s.jackpotEnd) {
        s.jackpot = 1;
        s.jackpotEnd = 0;
      }
      forceUpdate();
    }, 100);
    return () => clearInterval(interval);
  }, [forceUpdate]);

  useEffect(() => {
    const save = () => {
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current)); } catch { /* noop */ }
    };
    const interval = setInterval(save, 5000);
    window.addEventListener('beforeunload', save);
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', save);
      save();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const e = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      if (e.mod) {
        modsRef.current[e.mod.key] = e.mod.val;
        setTimeout(() => { modsRef.current[e.mod.key] = 1; }, e.mod.sec * 1000);
      }
      if (e.action) {
        e.action(stateRef.current, { perSec: () => computePerSec(stateRef.current, modsRef.current) });
      }
      audio.event();
      showNotice(e.msg);
    }, 45000);
    return () => clearInterval(interval);
  }, [showNotice]);

  const click = useCallback(() => {
    const s = stateRef.current;
    let v = computePerClick(s, modsRef.current);
    const crit = Math.random() < CRIT_CHANCE;
    if (crit) v *= CRIT_MULT;
    s.mhz += v;
    if (crit) audio.crit(); else audio.click();
    forceUpdate();
    return { value: v, crit };
  }, [forceUpdate]);

  const overclock = useCallback(() => {
    const s = stateRef.current;
    if (Date.now() < s.ocEnd || Date.now() < s.ocCooldownEnd) return false;
    s.ocEnd = Date.now() + OC_DURATION;
    s.ocCooldownEnd = Date.now() + OC_COOLDOWN;
    s.heat += 50;
    audio.overclock();
    forceUpdate();
    return true;
  }, [forceUpdate]);

  const buy = useCallback((type, item, currency) => {
    const s = stateRef.current;
    if (!s[type]) s[type] = {};
    const owned = s[type][item.id] || 0;
    const cost = computeCost(item.cost, owned);
    if (s[currency] < cost) return false;
    s[currency] -= cost;
    s[type][item.id] = owned + 1;
    audio.buy();
    forceUpdate();
    return true;
  }, [forceUpdate]);

  const upgradeDdr = useCallback(() => {
    const s = stateRef.current;
    const next = DDR_LEVELS[s.ddrLevel + 1];
    if (!next) return false;
    if (next.goldReq && s.gold < next.goldReq) return false;
    if (s.mhz < next.upgradeCost) return false;
    s.mhz -= next.upgradeCost;
    s.ddrLevel++;
    audio.ddr();
    forceUpdate();
    return true;
  }, [forceUpdate]);

  const prestige = useCallback(() => {
    const s = stateRef.current;
    const gain = prestigeGain(s);
    if (gain < 1) return false;
    s.gold += gain;
    s.pMult = 1 + s.gold * 0.05;
    s.mhz = 0; s.usd = 0; s.sil = 0; s.heat = 0;
    s.ddrLevel = 0; s.ocEnd = 0; s.ocCooldownEnd = 0;
    s.jackpot = 1; s.jackpotEnd = 0;
    s.clickUpg = {}; s.cool = {}; s.gens = {}; s.imp = {}; s.exp = {};
    audio.prestige();
    forceUpdate();
    return true;
  }, [forceUpdate]);

  const casinoBet = useCallback((pct) => {
    const s = stateRef.current;
    const bet = Math.floor(s.mhz * pct);
    if (bet < 1) return null;
    s.mhz -= bet;
    return bet;
  }, []);

  const slots = useCallback(() => {
    const bet = casinoBet(0.01);
    if (!bet) return { result: 'Need more MHz', reels: ['-', '-', '-'], win: false };
    const s = stateRef.current;
    const symbols = ['🍒', '💎', '⚡', '🔧', '7️⃣'];
    const reels = [0, 0, 0].map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      if (reels[0] === '7️⃣') {
        s.mhz += bet * 1000;
        s.jackpot = 10;
        s.jackpotEnd = Date.now() + 15000;
        audio.jackpot();
        forceUpdate();
        return { reels, result: 'JACKPOT! HynixGodStick x1000!', win: true };
      }
      s.mhz += bet * 8;
      audio.win();
      forceUpdate();
      return { reels, result: 'WIN x8!', win: true };
    }
    audio.lose();
    forceUpdate();
    return { reels, result: 'Lose', win: false };
  }, [casinoBet, forceUpdate]);

  const roulette = useCallback(() => {
    const bet = casinoBet(0.02);
    if (!bet) return { result: 'Need more MHz', win: false };
    const n = Math.floor(Math.random() * 37);
    const win = n % 2 === 0;
    if (win) { stateRef.current.mhz += bet * 2; audio.win(); } else audio.lose();
    forceUpdate();
    return { result: `Ball: ${n} — ${win ? 'WIN x2' : 'Lose'}`, win };
  }, [casinoBet, forceUpdate]);

  const blackjack = useCallback(() => {
    const bet = casinoBet(0.03);
    if (!bet) return { result: 'Need more MHz', win: false };
    const player = 15 + Math.floor(Math.random() * 10);
    const dealer = 15 + Math.floor(Math.random() * 10);
    const win = player <= 21 && (player > dealer || dealer > 21);
    if (win) { stateRef.current.mhz += Math.floor(bet * 2.2); audio.win(); } else audio.lose();
    forceUpdate();
    return { result: `You ${player} vs Dealer ${dealer} — ${win ? 'WIN x2.2' : 'Lose'}`, win };
  }, [casinoBet, forceUpdate]);

  const coinflip = useCallback(() => {
    const bet = casinoBet(0.05);
    if (!bet) return { result: 'Need more MHz', win: false };
    const boot = Math.random() < 0.5;
    if (boot) { stateRef.current.mhz += Math.floor(bet * 1.95); audio.win(); } else audio.lose();
    forceUpdate();
    return { result: boot ? 'IT BOOTS! WIN x1.95' : 'NO POST. Lose', win: boot };
  }, [casinoBet, forceUpdate]);

  const exportSave = useCallback(() => btoa(JSON.stringify(stateRef.current)), []);

  const importSave = useCallback((data) => {
    try {
      const parsed = JSON.parse(atob(data.trim()));
      stateRef.current = { ...DEFAULT_STATE, ...parsed };
      forceUpdate();
      return true;
    } catch {
      return false;
    }
  }, [forceUpdate]);

  const wipe = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    stateRef.current = { ...DEFAULT_STATE };
    modsRef.current = { prod: 1, click: 1 };
    forceUpdate();
  }, [forceUpdate]);

  const s = stateRef.current;
  const ddr = getDdr(s);
  const nextDdr = getNextDdr(s);
  const cooling = computeCooling(s);
  const heatPenalty = computeHeatPenalty(s);
  const perClick = computePerClick(s, modsRef.current);
  const perSec = computePerSec(s, modsRef.current);
  const heatRate = computeHeatRate(s);
  const usdPerSec = computeUsdPerSec(s);
  const silPerSec = computeSilPerSec(s);
  const pGain = prestigeGain(s);
  const ocActive = Date.now() < s.ocEnd;
  const ocOnCooldown = !ocActive && Date.now() < s.ocCooldownEnd;

  return {
    state: s,
    notice,
    derived: {
      ddr, nextDdr, cooling, heatPenalty, perClick, perSec,
      heatRate, usdPerSec, silPerSec, pGain, ocActive, ocOnCooldown,
    },
    actions: {
      click, overclock, buy, upgradeDdr, prestige,
      slots, roulette, blackjack, coinflip,
      exportSave, importSave, wipe, showNotice,
    },
  };
}