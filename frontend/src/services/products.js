// En CRA las variables deben empezar con REACT_APP_
const API_URL = process.env.REACT_APP_API_URL;

export async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error("Error al obtener productos");
    const json = await res.json();
    // API responde { status, data, meta }
    return json.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
} 
