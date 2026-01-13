"use client";

export default function Home() {
  return (
    <div style={{ padding: 50 }}>
      <h1>TESTE SIMPLES</h1>
      <button
        onClick={() => alert("FUNCIONOU")}
        style={{ padding: 20, background: "green", color: "white" }}
      >
        BOTÃO SIMPLES
      </button>
    </div>
  );
}
