export default function FabsDisplay({ generators, ownedMap }) {
  return (
    <div className="rc-fabs">
      {generators.map(g => {
        const owned = (ownedMap && ownedMap[g.id]) || 0;
        return (
          <div key={g.id} className="rc-fab" style={{ opacity: owned ? 1 : 0.25 }}>
            <div className="rc-fab-dot" />
            <div className="rc-fab-count">{owned}</div>
            <div className="rc-fab-name">{g.name}</div>
          </div>
        );
      })}
    </div>
  );
}