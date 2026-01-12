"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

export default function DetalheOS() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [servico, setServico] = useState<any>(null);

  useEffect(() => {
    if (id) {
      carregar();
    }
  }, [id]);

  async function carregar() {
    try {
      const data = await apiFetch(`/projects/${id}`);
      setServico(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar serviço");
    }
  }

  if (!servico) return <p className="p-4">Carregando...</p>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-black">
      <button
        onClick={() => router.back()}
        className="mb-3 bg-gray-600 text-white px-3 py-1 rounded"
      >
        Voltar
      </button>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p><strong>OS:</strong> {servico.osNumero}</p>
        <p><strong>Cliente:</strong> {servico.cliente}</p>
        <p><strong>Status:</strong> {servico.status}</p>
      </div>

      {servico.status === "aguardando_tecnico" && (
        <button
          onClick={async () => {
            await apiFetch(`/projects/${id}/abrir`, { method: "POST" });
            carregar();
          }}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Abrir Serviço
        </button>
      )}

      {servico.status === "em_andamento" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push(`/tecnico/${id}/antes`)}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Preencher Antes
          </button>

          <button
            onClick={() => router.push(`/tecnico/${id}/depois`)}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Preencher Depois
          </button>
        </div>
      )}

      {servico.status === "concluido" && (
        <div className="bg-green-100 p-3 rounded text-green-800">
          Serviço concluído
        </div>
      )}
    </div>
  );
}
