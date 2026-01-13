"use client";

export default function TesteCliqueForcado() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.2)",
        zIndex: 99998,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <button
        onClick={() => alert("CLIQUE FUNCIONOU AGORA")}
        style={{
          background: "green",
          color: "white",
          padding: "25px 40px",
          fontSize: "22px",
          borderRadius: "12px",
          cursor: "pointer",
          zIndex: 99999,
          position: "relative"
        }}
      >
        BOTÃO FORÇADO – TESTE DE CLIQUE
      </button>
    </div>
  );
}
