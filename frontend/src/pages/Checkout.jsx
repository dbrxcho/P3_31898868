import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orders";

export default function Checkout() {
  const { cart, clearCart } = useCart();

  const handleCheckout = async () => {
    const result = await createOrder(cart);
    if (result.success) {
      alert("Compra exitosa");
      clearCart();
    } else {
      alert("Error: " + result.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Checkout</h2>
      <button className="btn btn-primary" onClick={handleCheckout}>
        Confirmar compra
      </button>
    </div>
  );
}
