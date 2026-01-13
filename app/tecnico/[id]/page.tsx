"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

export default function DetalheOS() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [servico, setServico] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const data = await apiFetch(`/projects/${id}`);
      setServico(data);
    } catch (err) {
      alert("Erro ao carregar serviço");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="p-4">Carregando...</p>;
  if (!servico) return <p className="p-4">Serviço não encontrado</p>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-black space-y-4">

      <button
        onClick={() => router.back()}
        className="bg-gray-600 text-white px-3 py-1 rounded"
      >
        Voltar
      </button>

      <div className="bg-white p-4 rounded shadow space-y-1">
        <p><strong>OS:</strong> {servico.osNumero}</p>
        <p><strong>Cliente:</strong> {servico.cliente}</p>
        <p><strong>Status:</strong> {servico.status}</p>
        <p><strong>Endereço:</strong> {servico.endereco}</p>
      </div>

      {/* BOTÕES */}
      <div className="grid grid-cols-1 gap-3">

        {servico.status === "aguardando_tecnico" && (
          <button
            onClick={async () => {
              await apiFetch(`/projects/${id}/abrir`, { method: "POST" });
              carregar();
            }}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            ▶️ Iniciar Serviço
          </button>
        )}

        {/* SEMPRE MOSTRA */}
        <button
          onClick={() => router.push(`/tecnico/${id}/antes`)}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          ✏️ Editar ANTES
        </button>

        <button
          onClick={() => router.push(`/tecnico/${id}/depois`)}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          🛠️ Editar DEPOIS
        </button>

        {servico.status === "concluido" && (
          <div className="bg-green-100 text-green-800 p-3 rounded text-center">
            Serviço concluído
          </div>
        )}

      </div>
    </div>
  );
}
