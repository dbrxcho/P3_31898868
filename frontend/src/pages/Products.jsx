import { useEffect, useState } from "react";
import { getProducts } from "../services/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Catálogo</h2>
        <div style={{width:280}}>
          <input className="form-control" placeholder="Buscar producto..." value={query} onChange={(e)=>{setQuery(e.target.value); setPage(1)}} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-warning">No se encontraron productos</div>
      ) : (
        <div className="row">
          {pageItems.map(p => (
            <div className="col-sm-6 col-md-4 mb-4" key={p.id}>
              <ProductCard product={p} onAdd={addToCart} />
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-center align-items-center mt-3">
        <button className="btn btn-outline-secondary me-2" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Anterior</button>
        <div>Página {page} / {totalPages}</div>
        <button className="btn btn-outline-secondary ms-2" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Siguiente</button>
      </div>
    </div>
  );
}
