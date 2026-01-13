"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";

export default function AdminDetalheOS() {
  const params = useParams();
  const id = params?.id as string;

  const [os, setOs] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    apiFetch(`/projects/admin/view/${id}`)
      .then((data) => {
        console.log("OS:", data);
        setOs(data);
      })
      .catch((err) => {
        console.error("ERRO:", err.message);
        alert("Erro ao buscar OS: " + err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function cancelarServico() {
    if (!confirm("Tem certeza que deseja cancelar?")) return;

    try {
      await apiFetch(`/projects/admin/cancelar/${id}`, {
        method: "PUT"
      });
      alert("Serviço cancelado com sucesso");
      window.location.reload();
    } catch (err: any) {
      alert("Erro ao cancelar: " + err.message);
    }
  }

  return (
    <div className="p-4 text-black">
      <h1 className="text-xl font-bold">Detalhe da OS (Admin)</h1>

      {loading && <p>Carregando...</p>}

      {!loading && os && (
        <>
          <p><b>Cliente:</b> {os.cliente}</p>
          <p><b>Endereço:</b> {os.endereco}</p>
          <p><b>Status:</b> {os.status}</p>
          <p><b>Técnico:</b> {os.tecnico?.nome}</p>

          <div style={{ marginTop: 20 }}>
            <button
              onClick={cancelarServico}
              style={{ background: "red", color: "white", padding: 10, marginRight: 10 }}
            >
              Cancelar Serviço
            </button>
          </div>
        </>
      )}
    </div>
  );
}
