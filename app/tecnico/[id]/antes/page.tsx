"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AntesPage() {
  const { id } = useParams();
  const router = useRouter();

  const [relatorio, setRelatorio] = useState("");
  const [observacao, setObservacao] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  function handleFotos(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setFotos((prev) => [...prev, ...filesArray]);
  }

  function removerFoto(index: number) {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("relatorio", relatorio);
      formData.append("observacao", observacao);

      fotos.forEach((foto) => {
        formData.append("fotos", foto);
      });

      const res = await fetch(
        `https://gerenciador-de-os.onrender.com/projects/${id}/antes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Erro ao salvar");

      alert("Antes salvo com sucesso!");
      router.push(`/tecnico/${id}`);

    } catch (err) {
      console.error(err);
      alert("Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-black">
      <h1 className="text-xl font-bold mb-4">Antes do Serviço</h1>

      <form onSubmit={salvar} className="bg-white p-4 rounded shadow">
        <textarea
          className="w-full border p-2 mb-3"
          placeholder="Relatório"
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
          onChange={handleFotos}
          className="mb-3"
        />

        {/* PREVIEW */}
        {fotos.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {fotos.map((foto, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(foto)}
                  alt="preview"
                  className="w-full h-32 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removerFoto(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600"
          }`}
        >
          {loading ? "Enviando..." : "Salvar Antes"}
        </button>
      </form>
    </div>
  );
}
