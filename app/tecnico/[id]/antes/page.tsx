"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AntesPage() {
  const { id } = useParams();
  const router = useRouter();

  const [relatorio, setRelatorio] = useState("");
  const [observacao, setObservacao] = useState("");
  const [fotos, setFotos] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

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
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      alert("Antes salvo com sucesso!");
      router.push(`/tecnico/${id}`);
    } catch (err) {
      alert("Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-black">

    

      <h1 className="text-xl font-bold mb-4">Antes do Serviço</h1>

      <form onSubmit={salvar} className="bg-white p-4 rounded shadow space-y-4">

        {/* RELATÓRIO */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Descrição do serviço (Antes)
          </label>
          <textarea
            className="w-full border p-2 rounded"
            value={relatorio}
            onChange={(e) => setRelatorio(e.target.value)}
            required
          />
        </div>

        {/* OBSERVAÇÃO */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Observação
          </label>
          <textarea
            className="w-full border p-2 rounded"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </div>

        {/* FOTOS */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            📸 Adicionar fotos
          </label>

          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-400 rounded p-4 cursor-pointer bg-gray-50 hover:bg-gray-100">
            <span className="text-2xl">📷</span>
            <span className="font-medium">Adicionar fotos</span>

            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFotos(e.target.files)}
            />
          </label>

          {fotos && (
            <p className="text-sm text-gray-600 mt-1">
              {fotos.length} foto(s) selecionada(s)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Salvando..." : "Salvar Antes"}
        </button>
      </form>
    </div>
  );
}
