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
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (id) {
      carregar();
    }
  }, [id]);

  async function carregar() {
    try {
      const data = await apiFetch(`/projects/${id}`);
      setServico(data);
    } catch (err: any) {
      console.error(err);
      setErro(err.message || "Erro ao carregar serviço");
    } finally {
      setLoading(false);
    }
  }

  async function abrirServico() {
    try {
      await apiFetch(`/projects/${id}/abrir`, { method: "POST" });
      carregar();
    } catch (err: any) {
      alert(err.message || "Erro ao abrir serviço");
    }
  }

  if (loading) return <p className="p-4 text-black">Carregando...</p>;
  if (erro) return <p className="p-4 text-red-600">{erro}</p>;
  if (!servico) return null;

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-black">
      {/* TOPO */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          OS {servico.osNumero || "-"}
        </h1>

        <button
          onClick={() => router.back()}
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          Voltar
        </button>
      </div>

      {/* DADOS */}
      <div className="bg-white p-4 rounded shadow mb-4 space-y-2">
        <p><strong>Cliente:</strong> {servico.cliente || "-"}</p>
        <p><strong>Endereço:</strong> {servico.endereco || "-"}</p>
        <p><strong>Status:</strong> {servico.status}</p>
      </div>

      {/* AÇÕES POR STATUS */}
      {servico.status === "aguardando_tecnico" && (
        <button
          onClick={abrirServico}
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
        <div className="flex flex-col gap-3">
          <div className="bg-green-100 p-3 rounded text-green-800 text-center">
            Serviço concluído
          </div>

          <button
            onClick={() => router.push(`/tecnico/${id}/depois?edit=true`)}
            className="w-full bg-yellow-500 text-white py-2 rounded"
          >
            ✏️ Editar Serviço
          </button>
        </div>
      )}
    </div>
  );
}
