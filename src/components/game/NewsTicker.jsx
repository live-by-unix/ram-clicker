const HEADLINES = [
  '📈 DDR5 prices surge 300% overnight',
  '🌊 Everyone floods to Ram Clicker',
  '🔥 TSMC fab reaches 99% capacity',
  '💎 Silicon shortage hits black market',
  '🏆 New world record: 8GHz on LN2',
  '🚨 Counterfeit RAM seized at border',
  '💸 Government subsidies RAM production',
  '⚡ Overclock festival draws millions',
  '🤖 AI labs hoarding memory modules',
  '🏭 SemiconductorFab breaks ground in Arizona',
  '🎰 Gambler hits HynixGodStick jackpot',
  '🧊 LN2 shortage reported worldwide',
  '📊 Data centers demand hits all-time high',
  '🔧 SolderingRobots unionize for better paste',
  '🎮 Gamers protest RAM prices outside Microcenter',
  '🌐 GlobalSupplyChain reports record throughput',
  '🟡 Gold contacts now worth more than Bitcoin',
  '📡 MemoryControllerAI achieves sentience',
  '🌋 Supply chain collapse sends shockwaves',
  '🎯 Wafer roulette banned in 3 countries',
];

export default function NewsTicker() {
  const text = HEADLINES.join('  •  ');
  return (
    <div className="rc-news-bar">
      <span className="rc-news-badge">LIVE</span>
      <div className="rc-news-track">
        <span className="rc-news-content">{text}</span>
        <span className="rc-news-content">{text}</span>
      </div>
    </div>
  );
}