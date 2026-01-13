"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

export default function AdminDetalheOSPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [servico, setServico] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarServico();
  }, []);

  async function carregarServico() {
    try {
      const data = await apiFetch(`/admin/view/${id}`);
      setServico(data);
    } catch (err: any) {
      setErro(err.message || "Erro ao carregar serviço");
    } finally {
      setLoading(false);
    }
  }

  async function cancelarServico() {
    if (!confirm("Tem certeza que deseja CANCELAR este serviço?")) return;

    try {
      await apiFetch(`/admin/cancelar/${id}`, {
        method: "PUT"
      });

      alert("Serviço cancelado com sucesso!");
      router.push("/admin");
    } catch (err: any) {
      alert(err.message || "Erro ao cancelar serviço");
    }
  }

  async function trocarTecnico() {
    const novoTecnicoId = prompt("Cole aqui o ID do novo técnico:");
    if (!novoTecnicoId) return;

    try {
      await apiFetch(`/admin/change-tecnico/${id}`, {
        method: "PUT",
        body: JSON.stringify({ tecnicoId: novoTecnicoId })
      });

      alert("Técnico trocado com sucesso!");
      router.push("/admin");
    } catch (err: any) {
      alert(err.message || "Erro ao trocar técnico");
    }
  }

  if (loading) return <p className="p-4 text-black">Carregando...</p>;
  if (erro) return <p className="p-4 text-red-600">{erro}</p>;
  if (!servico) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-black">
      {/* TOPO */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">OS {servico.osNumero}</h1>

        <button
          onClick={() => router.back()}
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          Voltar
        </button>
      </div>

      {/* DADOS */}
      <div className="bg-white p-4 rounded shadow mb-4 space-y-2">
        <p><strong>Cliente:</strong> {servico.cliente}</p>
        <p><strong>Subgrupo:</strong> {servico.subgrupo || "-"}</p>
        <p><strong>Unidade:</strong> {servico.unidade || "-"}</p>
        <p><strong>Marca:</strong> {servico.marca || "-"}</p>
        <p><strong>Endereço:</strong> {servico.endereco}</p>
        <p><strong>Tipo de Serviço:</strong> {servico.tipoServico}</p>

        {/* STATUS */}
        <div className="mt-2">
          <span className="font-bold">Status: </span>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
              ${
                servico.status === "concluido"
                  ? "bg-green-100 text-green-700"
                  : servico.status === "em_andamento"
                  ? "bg-yellow-100 text-yellow-700"
                  : servico.status === "cancelado"
                  ? "bg-red-100 text-red-700"
                  : "bg-orange-100 text-orange-700"
              }`}
          >
            {servico.status === "concluido" && "Concluído"}
            {servico.status === "em_andamento" && "Em andamento"}
            {servico.status === "aguardando_tecnico" && "Aguardando técnico"}
            {servico.status === "cancelado" && "Cancelado"}
          </span>
        </div>

        <p><strong>Técnico:</strong> {servico.tecnico?.nome || "-"}</p>
      </div>

      {/* ANTES */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-bold mb-2">Antes</h2>

        <p><strong>Relatório:</strong> {servico.antes?.relatorio || "-"}</p>
        <p><strong>Observação:</strong> {servico.antes?.observacao || "-"}</p>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {servico.antes?.fotos?.map((foto: string, idx: number) => (
            <img
              key={idx}
              src={foto}
              alt="Antes"
              className="w-full h-32 object-cover rounded border"
            />
          ))}
        </div>
      </div>

      {/* DEPOIS */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-bold mb-2">Depois</h2>

        <p><strong>Relatório:</strong> {servico.depois?.relatorio || "-"}</p>
        <p><strong>Observação:</strong> {servico.depois?.observacao || "-"}</p>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {servico.depois?.fotos?.map((foto: string, idx: number) => (
            <img
              key={idx}
              src={foto}
              alt="Depois"
              className="w-full h-32 object-cover rounded border"
            />
          ))}
        </div>
      </div>

      {/* BOTÕES ADMIN */}
      <div className="flex flex-col gap-3 mt-4">

        <button
          onClick={cancelarServico}
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          ❌ Cancelar Serviço
        </button>

        <button
          onClick={trocarTecnico}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          🔁 Trocar Técnico
        </button>

      </div>
    </div>
  );
}
