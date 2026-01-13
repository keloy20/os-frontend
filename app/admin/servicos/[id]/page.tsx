"use client";

export default function TesteCliqueIsolado() {
  return (
    <div
      style={{
        padding: 50,
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <button
        onClick={() => alert("CLIQUE OK - BOTÃO FUNCIONANDO")}
        style={{
          background: "green",
          color: "white",
          padding: "20px 30px",
          fontSize: "20px",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        BOTÃO ISOLADO – TESTE DE CLIQUE
      </button>
    </div>
  );
}
