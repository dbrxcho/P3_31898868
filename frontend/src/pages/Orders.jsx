import { useEffect, useState } from "react";
import { getOrders } from "../services/orders";

function StatusBadge({ status }){
  const map = { PENDING: 'warning', COMPLETED: 'success', CANCELED: 'danger' };
  const cls = map[status] || 'secondary';
  return <span className={`badge bg-${cls}`}>{status}</span>;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  return (
    <div className="container mt-5">
      <h2>Historial de Pedidos</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">No tienes pedidos aún</div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="card mb-3 shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="mb-1">Orden #{o.id}</h5>
                  <div className="text-muted small">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-end">
                  <StatusBadge status={o.status} />
                  <div className="fw-bold mt-2">Total: {o.totalAmount} $</div>
                </div>
              </div>

              <hr />
              <div className="row">
                {o.items.map((item, i) => (
                  <div key={i} className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                      <div style={{width:48,height:48,background:'#eee'}} className="me-2" />
                      <div>
                        <div className="fw-bold">{item.name}</div>
                        <div className="small text-muted">{item.quantity} x {item.unitPrice} $</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
