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
    if (!confirm("Tem certeza que deseja cancelar este serviço?")) return;

    try {
      await apiFetch(`/projects/admin/cancelar/${id}`, {
        method: "PUT"
      });
      alert("Serviço cancelado com sucesso!");
      router.refresh();
    } catch (err: any) {
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tecnicoId: novoTecnico })
      });

      alert("Técnico alterado com sucesso!");
      router.refresh();
    } catch (err: any) {
      alert("Erro ao trocar técnico: " + err.message);
    }
  }

  if (loading) return <p className="p-4">Carregando...</p>;
  if (!os) return <p className="p-4">OS não encontrada</p>;

  return (
    <div className="p-4 text-black">
      <h1 className="text-xl font-bold mb-4">OS {os.osNumero}</h1>

      <div className="mb-4">
        <p><b>Cliente:</b> {os.cliente}</p>
        <p><b>Endereço:</b> {os.endereco}</p>
        <p><b>Status:</b> {os.status}</p>
        <p><b>Técnico atual:</b> {os.tecnico?.nome}</p>
      </div>

      <div className="mb-6">
        <button
          onClick={cancelarServico}
          style={{
            background: "#dc2626",
            color: "white",
            padding: "10px 16px",
            borderRadius: 6,
            marginRight: 10
          }}
        >
          ❌ Cancelar Serviço
        </button>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Trocar técnico:</label>
        <select
          value={novoTecnico}
          onChange={(e) => setNovoTecnico(e.target.value)}
          className="border p-2 rounded w-64"
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
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 16px",
            borderRadius: 6,
            marginLeft: 10
          }}
        >
          🔁 Trocar Técnico
        </button>
      </div>

      <button
        onClick={() => router.back()}
        style={{
          background: "#6b7280",
          color: "white",
          padding: "10px 16px",
          borderRadius: 6
        }}
      >
        Voltar
      </button>
    </div>
  );
}
