"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { dasaUnidades } from "../../../lib/dasaData";

export default function NovaOSPage() {
  const router = useRouter();

  const [cliente, setCliente] = useState("");
  const [subgrupo, setSubgrupo] = useState("");
  const [endereco, setEndereco] = useState("");
  const [tipoServico, setTipoServico] = useState("");
  const [tecnicoId, setTecnicoId] = useState("");

  const [unidade, setUnidade] = useState("");
  const [marca, setMarca] = useState("");
  const [filtroUnidade, setFiltroUnidade] = useState("");

  const [tecnicos, setTecnicos] = useState<any[]>([]);
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
      setErro(err.message || "Erro ao carregar técnicos");
    }
  }

  async function salvarOS(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      if (!cliente || !endereco || !tipoServico || !tecnicoId) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      if (cliente.toLowerCase() === "dasa" && (!unidade || !marca)) {
        throw new Error("Para cliente DASA, selecione a unidade");
      }

      await apiFetch("/projects/admin/create", {
        method: "POST",
        body: JSON.stringify({
          cliente,
          subgrupo,
          endereco,
          tipoServico,
          tecnicoId,
          unidade: cliente.toLowerCase() === "dasa" ? unidade : null,
          marca: cliente.toLowerCase() === "dasa" ? marca : null,
        }),
      });

      router.push("/admin");
    } catch (err: any) {
      setErro(err.message || "Erro ao salvar OS");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-black">
      {/* TOPO */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Nova Ordem de Serviço</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          Voltar
        </button>
      </div>

      <form
        onSubmit={salvarOS}
        className="bg-white p-4 rounded shadow max-w-md"
      >
        {erro && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
            {erro}
          </div>
        )}

        {/* CLIENTE */}
        <div className="mb-3">
          <label className="text-sm font-medium">Cliente</label>
          <input
            className="w-full border p-2 rounded"
            value={cliente}
            onChange={(e) => {
              setCliente(e.target.value);
              setUnidade("");
              setMarca("");
              setFiltroUnidade("");
            }}
            placeholder="Ex: DASA"
            required
          />
        </div>

        {/* BLOCO DASA */}
        {cliente.toLowerCase() === "dasa" && (
          <div className="mb-4">
            <label className="text-sm font-medium">Unidade (DASA)</label>

            <input
              type="text"
              className="w-full border p-2 rounded mb-2"
              placeholder="Digite para buscar unidade..."
              value={filtroUnidade}
              onChange={(e) => setFiltroUnidade(e.target.value)}
            />

            <div className="max-h-40 overflow-y-auto border rounded">
              {dasaUnidades
                .filter((u) =>
                  u.unidade.toLowerCase().includes(filtroUnidade.toLowerCase())
                )
                .map((u, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setUnidade(u.unidade);
                      setMarca(u.marca);
                      setFiltroUnidade(u.unidade);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {u.unidade} —{" "}
                    <span className="text-sm text-gray-600">{u.marca}</span>
                  </div>
                ))}
            </div>

            {unidade && (
              <div className="mt-2 text-sm text-gray-700">
                <strong>Selecionado:</strong> {unidade} |{" "}
                <strong>Marca:</strong> {marca}
              </div>
            )}
          </div>
        )}

        {/* SUBGRUPO */}
        <div className="mb-3">
          <label className="text-sm font-medium">Subgrupo</label>
          <input
            className="w-full border p-2 rounded"
            value={subgrupo}
            onChange={(e) => setSubgrupo(e.target.value)}
            placeholder="Opcional"
          />
        </div>

        {/* ENDEREÇO */}
        <div className="mb-3">
          <label className="text-sm font-medium">Endereço</label>
          <input
            className="w-full border p-2 rounded"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
        </div>

        {/* TIPO DE SERVIÇO */}
        <div className="mb-3">
          <label className="text-sm font-medium">Tipo de Serviço</label>
          <input
            className="w-full border p-2 rounded"
            value={tipoServico}
            onChange={(e) => setTipoServico(e.target.value)}
            required
          />
        </div>

        {/* TÉCNICO */}
        <div className="mb-4">
          <label className="text-sm font-medium">Técnico</label>
          <select
            className="w-full border p-2 rounded"
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

        {/* BOTÕES */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Salvando..." : "Criar OS"}
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
