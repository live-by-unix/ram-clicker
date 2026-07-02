export default function Panel({ title, children }) {
  return (
    <div className="rc-panel">
      {title && <h3 className="rc-panel-title">{title}</h3>}
      {children}
    </div>
  );
}