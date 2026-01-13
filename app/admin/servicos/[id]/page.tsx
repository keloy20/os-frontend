"use client";

import { useEffect } from "react";

export default function TesteJS() {
  useEffect(() => {
    alert("JS HIDRATOU – useEffect rodou");
    console.log("JS HIDRATOU");
  }, []);

  return (
    <div style={{ padding: 50 }}>
      <h1>TESTE DE HIDRATAÇÃO</h1>
      <button
        onClick={() => alert("CLIQUE FUNCIONOU")}
        style={{ padding: 20, background: "green", color: "white" }}
      >
        TESTAR CLIQUE
      </button>
    </div>
  );
}
