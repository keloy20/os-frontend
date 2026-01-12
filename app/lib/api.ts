const API = "https://gerenciador-de-os.onrender.com";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  // 🔥 SE DER ERRO, LÊ O JSON OU TEXTO
  if (!res.ok) {
    let message = "Erro na requisição";

    try {
      const data = await res.json();
      message = data.error || JSON.stringify(data);
    } catch {
      message = await res.text();
    }

    throw new Error(message);
  }

  // 🔥 TRATA RESPOSTA SEM JSON (ex: 204, PDF, etc)
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return null;
}
