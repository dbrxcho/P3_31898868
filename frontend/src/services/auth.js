// En CRA las variables deben empezar con REACT_APP_
const API_URL = process.env.REACT_APP_API_URL;

export async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    // backend responde { status, data: { token } }
    return data?.data?.token || null;
  } catch {
    return null;
  }
}

export async function register(nombreCompleto, email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreCompleto, email, password })
    });
    return res.ok;
  } catch {
    return false;
  }
} 
