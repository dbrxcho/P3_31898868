export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card h-100 shadow-sm product-card">
      <div className="card-img-top bg-secondary text-white d-flex align-items-center justify-content-center" style={{height:160}}>
        <div>
          <strong style={{fontSize:20}}>{product.name?.slice(0,20)}</strong>
          <div className="text-muted small">{product.artist || 'Varios'}</div>
        </div>
      </div>
      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{product.name}</h6>
        <p className="card-text text-truncate">{product.description}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="fw-bold">{product.price} $</div>
          <button className="btn btn-sm btn-success" onClick={() => onAdd(product)}>Añadir</button>
        </div>
      </div>
    </div>
  );
}
