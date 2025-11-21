import { useEffect, useState } from "react";

export default function BlockchainExplorer() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:5000/api/properties/blockchain/all");
      const data = await res.json();
      setBlocks(data);
    }
    load();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>Blockchain Explorer 🔗</h1>
      <p>All recorded property events stored securely in a decentralized ledger.</p>

      {blocks.map((b) => (
        <div
          key={b.index}
          style={{
            border: "1px solid #555",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          <p><b>Block #{b.index}</b></p>
          <p><b>Hash:</b> {b.hash}</p>
          <p><b>Previous:</b> {b.previousHash}</p>
          <p><b>Time:</b> {new Date(b.timestamp).toLocaleString()}</p>
          <p><b>Data:</b> {JSON.stringify(b.data, null, 2)}</p>
        </div>
      ))}
    </div>
  );
}
