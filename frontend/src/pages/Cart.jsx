import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart } = useCart();
  const total = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="container mt-5">
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        <ul className="list-group mb-3">
          {cart.map((p, i) => (
            <li key={i} className="list-group-item d-flex justify-content-between">
              {p.name} <span>{p.price} $</span>
            </li>
          ))}
        </ul>
      )}
      <h4>Total: {total} $</h4>
    </div>
  );
}
