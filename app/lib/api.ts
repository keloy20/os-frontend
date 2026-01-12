const API = "https://gerenciador-de-os.onrender.com";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers,
  });

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

  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return null;
}
