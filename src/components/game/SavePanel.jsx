import { useState } from 'react';

export default function SavePanel({ onExport, onImport, onWipe }) {
  const [showArea, setShowArea] = useState(false);
  const [saveText, setSaveText] = useState('');
  const [msg, setMsg] = useState('');

  const handleExport = () => {
    setSaveText(onExport());
    setShowArea(true);
    setMsg('Save exported ↓');
  };

  const handleImport = () => {
    if (onImport(saveText)) {
      setMsg('✓ Save loaded!');
    } else {
      setMsg('✗ Invalid save data');
    }
  };

  const handleWipe = () => {
    if (window.confirm('Erase ALL progress? This cannot be undone.')) {
      onWipe();
      setMsg('Progress wiped');
      setShowArea(false);
      setSaveText('');
    }
  };

  return (
    <>
      <div className="rc-save-btns">
        <button className="rc-btn rc-btn-save" onClick={handleExport}>Export</button>
        <button className="rc-btn rc-btn-save" onClick={() => setShowArea(v => !v)}>Import</button>
        <button className="rc-btn rc-btn-wipe" onClick={handleWipe}>Wipe</button>
      </div>
      {msg && <div className="rc-save-msg">{msg}</div>}
      {showArea && (
        <div className="rc-save-area">
          <textarea
            value={saveText}
            onChange={e => setSaveText(e.target.value)}
            placeholder="Paste save data here..."
          />
          <button className="rc-btn rc-btn-save" onClick={handleImport}>Load Save</button>
        </div>
      )}
    </>
  );
}