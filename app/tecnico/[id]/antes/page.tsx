"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

export default function AntesPage() {
  const { id } = useParams();
  const router = useRouter();

  const [relatorio, setRelatorio] = useState("");
  const [observacao, setObservacao] = useState("");
  const [fotos, setFotos] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const data = await apiFetch(`/projects/${id}`);
      setRelatorio(data.antes?.relatorio || "");
      setObservacao(data.antes?.observacao || "");
    } catch {}
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("relatorio", relatorio);
      formData.append("observacao", observacao);

      if (fotos) {
        for (let i = 0; i < fotos.length; i++) {
          formData.append("fotos", fotos[i]);
        }
      }

      await fetch(`https://gerenciador-de-os.onrender.com/projects/${id}/antes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      alert("ANTES atualizado com sucesso!");
      router.push(`/tecnico/${id}`);

    } catch {
      alert("Erro ao salvar ANTES");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-black">
      <h1 className="text-xl font-bold mb-4">📝 ANTES do Serviço</h1>

      <form onSubmit={salvar} className="bg-white p-4 rounded shadow space-y-4">

        <div>
          <label className="block font-semibold mb-1">Descrição do serviço (Antes)</label>
          <textarea
            className="w-full border p-2 rounded"
            value={relatorio}
            onChange={(e) => setRelatorio(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Observação</label>
          <textarea
            className="w-full border p-2 rounded"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">📸 Adicionar fotos</label>

          <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded p-4 cursor-pointer bg-gray-50 hover:bg-gray-100">
            <span className="text-2xl">📷</span>
            <span>Adicionar fotos</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFotos(e.target.files)}
            />
          </label>

          {fotos && (
            <p className="text-sm mt-1 text-gray-600">
              {fotos.length} foto(s) selecionada(s)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Salvando..." : "Salvar ANTES"}
        </button>
      </form>
    </div>
  );
}

