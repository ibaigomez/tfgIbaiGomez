import { useEffect, useState } from "react";
import '@/styles/carrito.css';

export default function CartViewer() {
  // Estado que almacena los productos del carrito
  const [cart, setCart] = useState([]);
  // Estado que almacena el precio total del carrito
  const [total, setTotal] = useState(0);

  // Se obtiene la clave pública de PayPal desde variables de entorno (.env)
  const clientId = import.meta.env.PUBLIC_PAYPAL_CLIENT_ID;

  // useEffect que carga los datos del carrito desde localStorage al cargar el componente
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || []; // Lee del almacenamiento local
    setCart(saved); // Guarda los productos en el estado
    // Calcula el total sumando precio * cantidad de cada producto
    setTotal(saved.reduce((sum, item) => sum + item.precio * item.cantidad, 0));
  }, []);

  // useEffect que carga el SDK de PayPal y genera los botones
  useEffect(() => {
    if (cart.length === 0) return; // Si el carrito está vacío, no hace nada

    // Crea el script del SDK de PayPal
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;

    // Espera a que el script se cargue
    script.addEventListener("load", () => {
      if (window.paypal) {
        // Renderiza los botones de PayPal
        window.paypal.Buttons({
          // Crea el pedido cuando el usuario hace clic en "Pagar"
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                // Le pasamos el total calculado del carrito
                amount: { value: total.toFixed(2), currency_code: 'EUR' },
                description: 'Compra en la tienda'
              }]
            });
          },
          // Cuando el pago es aprobado
          onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
              // Muestra un mensaje de agradecimiento al usuario
              alert(`¡Gracias por tu compra, ${details.payer.name.given_name}!`);
              // Vacía el carrito
              localStorage.removeItem("cart");
              // Redirige a la página de inicio 
              window.location.href = "/";
            });
          }
        }).render("#paypal-button-container"); // Renderiza dentro del contenedor con ese ID
      }
    });

    document.body.appendChild(script); // Añade el script al documento
  }, [cart, total]); // Se ejecuta cada vez que cambie el carrito o el total

  // Elimina un producto del carrito
  const removeItem = (i) => {
    const newCart = [...cart];
    newCart.splice(i, 1); // Elimina el producto en el índice i
    setCart(newCart);
    // Actualiza localStorage y recalcula el total
    localStorage.setItem("cart", JSON.stringify(newCart));
    setTotal(newCart.reduce((sum, item) => sum + item.precio * item.cantidad, 0));
  };

  // Vacía completamente el carrito
  const clearCart = () => {
    if (confirm("¿Vaciar carrito?")) {
      setCart([]);
      localStorage.removeItem("cart");
      setTotal(0);
    }
  };

  // Si el carrito está vacío, se muestra este mensaje
  if (cart.length === 0) return <p>Tu carrito está vacío.</p>;

  return (
    <div>
      <ul className="cart-list">
        {/* Recorre los productos del carrito y los muestra */}
        {cart.map((item, i) => (
          <li key={i} className="cart-item">
            <img src={item.imagen} alt={item.nombre} />
            <div className="cart-item-info">
              <strong>{item.nombre}</strong>
              <p>Talla: {item.talla}</p>
              <p>Cantidad: {item.cantidad}</p>
              <p>Precio: €{(item.precio * item.cantidad).toFixed(2)}</p>
            </div>
            {/* Botón para eliminar un producto específico */}
            <button onClick={() => removeItem(i)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        {/* Muestra el total del carrito */}
        <h3 className="cart-total">Total: €{total.toFixed(2)}</h3>

        <div className="cart-actions">
          {/* Botón para seguir comprando */}
          <a href="/tienda" className="seguir-comprando">← Seguir comprando</a>
          {/* Botón para vaciar el carrito */}
          <button onClick={clearCart} className="vaciar-carrito">Vaciar carrito</button>
        </div>

        {/* Contenedor donde se insertan los botones de PayPal */}
        <div style={{ marginTop: '2rem' }}>
          <h2>Finalizar compra</h2>
          <div id="paypal-button-container"></div>
        </div>
      </div>
    </div>
  );
}
