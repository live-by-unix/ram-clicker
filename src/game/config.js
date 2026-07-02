export const CONV_RATE = 0.005;
export const CRIT_CHANCE = 0.05;
export const CRIT_MULT = 10;
export const OC_MULT = 5;
export const OC_DURATION = 8000;
export const OC_COOLDOWN = 15000;
export const HEAT_DISSIPATION = 3;

export const CLICK_UPGRADES = [
  { id: 'cu1', name: 'Better Solder', desc: '+2 MHz/click', cost: 50, add: 2 },
  { id: 'cu2', name: 'Golden Fingers', desc: '+10 MHz/click', cost: 500, add: 10 },
  { id: 'cu3', name: 'XMP Profile', desc: '+50 MHz/click', cost: 5000, add: 50 },
  { id: 'cu4', name: 'Quantum Trace', desc: '+500 MHz/click', cost: 100000, add: 500 },
  { id: 'cu5', name: 'Neural Tap', desc: '+5000 MHz/click', cost: 5000000, add: 5000 },
];

export const COOLING = [
  { id: 'fan', name: 'Case Fans', desc: 'Cooling +5', cost: 200, cool: 5 },
  { id: 'aio', name: 'AIO Liquid', desc: 'Cooling +25', cost: 2000, cool: 25 },
  { id: 'loop', name: 'Custom Loop', desc: 'Cooling +150', cost: 50000, cool: 150 },
  { id: 'ln2', name: 'LN2 Pot', desc: 'Cooling +1000', cost: 1000000, cool: 1000 },
];

export const GENERATORS = [
  { id: 'robot', name: 'SolderingRobot', desc: '1 MHz/s', mps: 1, heat: 0.5, cost: 100 },
  { id: 'pcb', name: 'PCBPrinter', desc: '8 MHz/s', mps: 8, heat: 2, cost: 1100 },
  { id: 'asm', name: 'RAMAssembler', desc: '50 MHz/s', mps: 50, heat: 6, cost: 12000 },
  { id: 'mcai', name: 'MemoryControllerAI', desc: '300 MHz/s', mps: 300, heat: 15, cost: 130000 },
  { id: 'micro', name: 'Microcenter', desc: '2K MHz/s', mps: 2000, heat: 40, cost: 1400000 },
  { id: 'fab', name: 'SemiconductorFab', desc: '15K MHz/s', mps: 15000, heat: 120, cost: 20000000 },
  { id: 'tsmc', name: 'TSMCPartnership', desc: '120K MHz/s', mps: 120000, heat: 400, cost: 330000000 },
  { id: 'gsc', name: 'GlobalSupplyChain', desc: '1M MHz/s', mps: 1000000, heat: 1200, cost: 5000000000 },
];

export const IMPORTS = [
  { id: 'cheap', name: 'ImportCheapRAM', desc: '+0.5 Silicon/s', cost: 10000, sil: 1 },
  { id: 'fake', name: 'ImportCounterfeitRAM', desc: '+1.5 Silicon/s', cost: 50000, sil: 3 },
  { id: 'used', name: 'ImportUsedRAM', desc: '+4 Silicon/s', cost: 200000, sil: 8 },
];

export const EXPORTS = [
  { id: 'gamers', name: 'ExportToGamers', desc: '+$2/s', cost: 5000, usd: 2 },
  { id: 'dc', name: 'ExportToDataCenters', desc: '+$20/s', cost: 80000, usd: 20 },
  { id: 'ai', name: 'ExportToAILabs', desc: '+$200/s', cost: 1000000, usd: 200 },
  { id: 'gov', name: 'ExportToGovernment', desc: '+$2500/s', cost: 20000000, usd: 2500 },
];

export const DDR_LEVELS = [
  { gen: 3, name: 'DDR3', upgradeCost: 0, mult: 1, color: '#39ff14' },
  { gen: 4, name: 'DDR4', upgradeCost: 10000, mult: 3, color: '#00f0ff' },
  { gen: 5, name: 'DDR5', upgradeCost: 1000000, mult: 8, color: '#ff00e6' },
  { gen: 6, name: 'DDR6', upgradeCost: 100000000, mult: 20, color: '#9d00ff', goldReq: 1 },
  { gen: 7, name: 'DDR7', upgradeCost: 10000000000, mult: 50, color: '#ffd000', goldReq: 5 },
  { gen: 8, name: 'DDR8', upgradeCost: 1000000000000, mult: 150, color: '#ff0066', goldReq: 20 },
];

export const EVENTS = [
  { name: 'ChipShortage', msg: 'CHIP SHORTAGE! Production -50% (15s)', mod: { key: 'prod', val: 0.5, sec: 15 } },
  { name: 'GPUCrash', msg: 'GPU CRASH! +200 Silicon', action: (s) => { s.sil += 200; } },
  { name: 'MicrocenterFireSale', msg: 'FIRE SALE! Free MHz burst', action: (s, ctx) => { s.mhz += ctx.perSec() * 30; } },
  { name: 'GovernmentSubsidy', msg: 'GOV SUBSIDY! +Dollars', action: (s) => { s.usd += 10000 + s.usd * 0.2; } },
  { name: 'SupplyChainCollapse', msg: 'SUPPLY CHAIN COLLAPSE! +200 Heat', action: (s) => { s.heat += 200; } },
  { name: 'SiliconBoom', msg: 'SILICON BOOM! Production x3 (15s)', mod: { key: 'prod', val: 3, sec: 15 } },
  { name: 'OverclockFestival', msg: 'OVERCLOCK FESTIVAL! Click x10 (20s)', mod: { key: 'click', val: 10, sec: 20 } },
];