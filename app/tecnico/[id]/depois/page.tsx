"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DepoisPage() {
  const { id } = useParams();
  const router = useRouter();

  const [relatorio, setRelatorio] = useState("");
  const [observacao, setObservacao] = useState("");
  const [fotos, setFotos] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  async function salvarDepois(e: React.FormEvent) {
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

      const res = await fetch(
        `https://gerenciador-de-os.onrender.com/projects/${id}/depois`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao salvar DEPOIS");
      }

      alert("Serviço finalizado com sucesso!");
router.push("/tecnico");

    } catch (err) {
      alert("Erro ao finalizar serviço");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-black">
      <h1 className="text-xl font-bold mb-4">Depois do Serviço</h1>

      <form onSubmit={salvarDepois} className="bg-white p-4 rounded shadow">
        <textarea
          className="w-full border p-2 mb-3"
          placeholder="Relatório final"
          value={relatorio}
          onChange={(e) => setRelatorio(e.target.value)}
          required
        />

        <textarea
          className="w-full border p-2 mb-3"
          placeholder="Observação"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />

        <input
          type="file"
          multiple
          onChange={(e) => setFotos(e.target.files)}
          className="mb-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Finalizando..." : "Finalizar Serviço"}
        </button>
      </form>
    </div>
  );
}
