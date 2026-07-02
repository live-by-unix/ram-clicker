import { formatNum } from '@/game/format';
import { computeCost } from '@/game/logic';

export default function BuyList({ items, ownedMap, currency, currencyLabel, onBuy }) {
  return (
    <div className="rc-buy-list">
      {items.map(item => {
        const owned = (ownedMap && ownedMap[item.id]) || 0;
        const cost = computeCost(item.cost, owned);
        const canBuy = currency >= cost;
        return (
          <div
            key={item.id}
            className={`rc-buy-item ${canBuy ? '' : 'locked'}`}
            onClick={() => canBuy && onBuy(item)}
          >
            <div className="rc-buy-info">
              <div className="rc-buy-name">
                {item.name} <span className="rc-buy-owned">×{owned}</span>
              </div>
              <div className="rc-buy-desc">{item.desc}</div>
            </div>
            <div className="rc-buy-cost">
              {formatNum(cost)}<span className="rc-buy-cur">{currencyLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}