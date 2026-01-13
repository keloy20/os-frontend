"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

export default function AdminServicoDetalhe() {
  const { id } = useParams();
  const router = useRouter();

  const [servico, setServico] = useState<any>(null);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [novoTecnico, setNovoTecnico] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarServico();
    carregarTecnicos();
  }, []);

  async function carregarServico() {
    try {
      const data = await apiFetch(`/projects/${id}`);
      setServico(data);
    } catch (err) {
      alert("Erro ao carregar serviço");
    }
  }

  async function carregarTecnicos() {
    try {
      const data = await apiFetch("/auth/tecnicos");
      setTecnicos(data);
    } catch (err) {
      console.log("Erro ao buscar técnicos");
    }
  }

  async function cancelarServico() {
    if (!confirm("Tem certeza que deseja CANCELAR este serviço?")) return;

    try {
      setLoading(true);
      await apiFetch(`/projects/admin/cancelar/${id}`, {
        method: "PUT"
      });

      alert("Serviço cancelado com sucesso");
      router.push("/admin");
    } catch (err: any) {
      alert(err.message || "Erro ao cancelar");
    } finally {
      setLoading(false);
    }
  }

  async function trocarTecnico() {
    if (!novoTecnico) {
      alert("Selecione um técnico");
      return;
    }

    if (!confirm("Tem certeza que deseja trocar o técnico deste serviço?")) return;

    try {
      setLoading(true);
      await apiFetch(`/projects/admin/change-tecnico/${id}`, {
        method: "PUT",
        body: JSON.stringify({ tecnicoId: novoTecnico })
      });

      alert("Técnico alterado com sucesso");
      carregarServico();
      setNovoTecnico("");
    } catch (err: any) {
      alert(err.message || "Erro ao trocar técnico");
    } finally {
      setLoading(false);
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

      <div className="bg-white p-4 rounded shadow mb-4 space-y-2">
        <p><strong>OS:</strong> {servico.osNumero}</p>
        <p><strong>Cliente:</strong> {servico.cliente}</p>
        <p><strong>Endereço:</strong> {servico.endereco}</p>
        <p><strong>Status:</strong> {servico.status}</p>
        <p><strong>Técnico atual:</strong> {servico.tecnico?.nome || "-"}</p>
      </div>

      {/* ===== TROCAR TÉCNICO ===== */}
      <div className="bg-white p-4 rounded shadow mb-4 space-y-2">
        <h2 className="font-bold text-lg">Trocar Técnico</h2>

        <select
          value={novoTecnico}
          onChange={(e) => setNovoTecnico(e.target.value)}
          className="w-full border p-2 rounded"
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
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          🔄 Trocar Técnico
        </button>
      </div>

      {/* ===== CANCELAR ===== */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold text-lg text-red-600">Zona de Perigo</h2>

        <button
          onClick={cancelarServico}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded mt-2"
        >
          ❌ Cancelar Serviço
        </button>
      </div>
    </div>
  );
}
