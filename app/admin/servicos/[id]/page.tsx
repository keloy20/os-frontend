"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";

export default function AdminDetalheOS() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [os, setOs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [novoTecnico, setNovoTecnico] = useState("");

  useEffect(() => {
    if (!id) return;

    async function carregar() {
      try {
        const data = await apiFetch(`/projects/admin/view/${id}`);
        setOs(data);

        const listaTecnicos = await apiFetch(`/auth/tecnicos`);
        setTecnicos(listaTecnicos);
      } catch (err: any) {
        alert("Erro: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id]);

 async function cancelarServico() {
  console.log("CLIQUEI EM CANCELAR", id);
  alert("Clique detectado! ID: " + id);

  if (!confirm("Tem certeza que deseja cancelar este serviço?")) return;

  try {
    const res = await apiFetch(`/projects/admin/cancelar/${id}`, {
      method: "PUT"
    });

    console.log("RESPOSTA CANCELAR:", res);
    alert("Serviço cancelado com sucesso!");
    router.refresh();
  } catch (err: any) {
    console.error("ERRO CANCELAR:", err);
    alert("Erro ao cancelar: " + err.message);
  }
}


  async function trocarTecnico() {
    if (!novoTecnico) {
      alert("Selecione um técnico");
      return;
    }

    try {
      await apiFetch(`/projects/admin/change-tecnico/${id}`, {
        method: "PUT",
        body: JSON.stringify({ tecnicoId: novoTecnico })
      });

      alert("Técnico alterado com sucesso!");
      router.refresh();
    } catch (err: any) {
      alert("Erro ao trocar técnico: " + err.message);
    }
  }

  if (loading) return <p className="p-6">Carregando...</p>;
  if (!os) return <p className="p-6">OS não encontrada</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-8">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-md p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">OS {os.osNumero}</h1>
            <p className="text-sm text-gray-500">Detalhes do serviço</p>
          </div>

          <button
            onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/pdf`, "_blank")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            📄 Baixar PDF
          </button>
        </div>

        {/* INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-800">
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className="font-semibold">{os.cliente}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Endereço</p>
            <p className="font-semibold">{os.endereco}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {os.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Técnico Atual</p>
            <p className="font-semibold">{os.tecnico?.nome}</p>
          </div>
        </div>

        {/* AÇÕES */}
        <div className="border-t pt-6 space-y-4">

          {/* CANCELAR */}
          <button
            onClick={cancelarServico}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition"
          >
            ❌ Cancelar Serviço
          </button>

          {/* TROCAR TÉCNICO */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <select
              value={novoTecnico}
              onChange={(e) => setNovoTecnico(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 bg-white w-full md:w-64"
            >
              <option value="">Selecione um técnico</option>
              {tecnicos.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.nome}
                </option>
              ))}
            </select>

            <button
              onClick={trocarTecnico}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
            >
              🔁 Trocar Técnico
            </button>
          </div>

          {/* VOLTAR */}
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 font-medium underline"
          >
            ← Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
