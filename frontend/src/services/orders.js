// En CRA las variables deben empezar con REACT_APP_
const API_URL = process.env.REACT_APP_API_URL;

export async function createOrder(cart) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ items: cart })
    });
    return await res.json();
  } catch {
    return { success: false, message: "Error de red" };
  }
}

export async function getOrders() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/orders/history`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return await res.json();
  } catch {
    return [];
  }
}
