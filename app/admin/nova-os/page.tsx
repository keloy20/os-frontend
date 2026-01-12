"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { User } from "../../lib/types";

export default function NovaOSPage() {
  const router = useRouter();

  const [cliente, setCliente] = useState("");
  const [subgrupo, setSubgrupo] = useState("");
  const [endereco, setEndereco] = useState("");
  const [tipoServico, setTipoServico] = useState("");
  const [tecnicoId, setTecnicoId] = useState("");

  const [tecnicos, setTecnicos] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarTecnicos();
  }, []);

  async function carregarTecnicos() {
    try {
      const data = await apiFetch("/auth/tecnicos");
      setTecnicos(data);
    } catch (err: any) {
      setErro(err.message);
    }
  }

  async function salvarOS(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      await apiFetch("/projects/admin/create", {
        method: "POST",
        body: JSON.stringify({
          cliente,
          subgrupo,
          endereco,
          tipoServico,
          tecnicoId,
        }),
      });

      router.push("/admin");
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-black mb-4">Nova Ordem de Serviço</h1>

      <form
        onSubmit={salvarOS}
        className="bg-white p-4 rounded shadow max-w-md"
      >
        {erro && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
            {erro}
          </div>
        )}

        <div className="mb-3">
          <label className="text-sm font-medium text-black">Cliente</label>
          <input
            className="w-full border p-2 rounded text-black"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium text-black">Subgrupo</label>
          <input
            className="w-full border p-2 rounded text-black"
            value={subgrupo}
            onChange={(e) => setSubgrupo(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium text-black">Endereço</label>
          <input
            className="w-full border p-2 rounded text-black"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium text-black">Tipo de Serviço</label>
          <input
            className="w-full border p-2 rounded text-black"
            value={tipoServico}
            onChange={(e) => setTipoServico(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-black">Técnico</label>
          <select
            className="w-full border p-2 rounded text-black bg-white"
            value={tecnicoId}
            onChange={(e) => setTecnicoId(e.target.value)}
            required
          >
            <option value="">Selecione o técnico</option>
            {tecnicos.map((t) => (
              <option key={t._id} value={t._id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Salvando..." : "Salvar OS"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
