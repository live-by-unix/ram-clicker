import {
  CLICK_UPGRADES, COOLING, GENERATORS, EXPORTS, IMPORTS,
  DDR_LEVELS, CONV_RATE, OC_MULT
} from './config';

export function computeCost(base, owned) {
  return Math.floor(base * Math.pow(1.15, owned));
}

export function getDdr(state) {
  return DDR_LEVELS[state.ddrLevel] || DDR_LEVELS[0];
}

export function getNextDdr(state) {
  return DDR_LEVELS[state.ddrLevel + 1] || null;
}

export function computeCooling(state) {
  return COOLING.reduce((sum, c) => sum + (state.cool[c.id] ? c.cool * state.cool[c.id] : 0), 0);
}

export function computeHeatPenalty(state) {
  const cooling = computeCooling(state);
  const eff = Math.max(0, state.heat - cooling);
  return 1 / (1 + eff / 500);
}

export function computePerClick(state, mods = {}) {
  const ddr = getDdr(state);
  let base = 1;
  CLICK_UPGRADES.forEach(u => {
    if (state.clickUpg[u.id]) base += u.add * state.clickUpg[u.id];
  });
  const ocActive = Date.now() < state.ocEnd;
  return base * ddr.mult * state.pMult * state.jackpot * (ocActive ? OC_MULT : 1) * (mods.click || 1);
}

export function computePerSec(state, mods = {}) {
  const ddr = getDdr(state);
  let mps = 0;
  GENERATORS.forEach(g => {
    if (state.gens[g.id]) {
      mps += g.mps * state.gens[g.id] * Math.pow(1.03, state.gens[g.id]);
    }
  });
  return mps * ddr.mult * state.pMult * state.jackpot * computeHeatPenalty(state) * (mods.prod || 1);
}

export function computeHeatRate(state) {
  let h = 0;
  GENERATORS.forEach(g => {
    if (state.gens[g.id]) h += g.heat * state.gens[g.id];
  });
  return h;
}

export function computeUsdPerSec(state) {
  let u = state.mhz * CONV_RATE;
  EXPORTS.forEach(e => {
    if (state.exp[e.id]) u += e.usd * state.exp[e.id];
  });
  return u;
}

export function computeSilPerSec(state) {
  let s = 0;
  IMPORTS.forEach(i => {
    if (state.imp[i.id]) s += i.sil * state.imp[i.id];
  });
  return s * 0.5;
}

export function prestigeGain(state) {
  return Math.floor(Math.sqrt(state.mhz / 1e9));
}