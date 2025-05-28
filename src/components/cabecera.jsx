import { useState } from 'react';
import React from 'react';
import '@/styles/Navbar.css'; // asumimos que has renombrado el CSS

export default function Navbar() {
  const [estaAbierto, setEstaAbierto] = useState(false); // Estado para controlar si el menú está abierto o cerrado


  return (
    <nav className="barra-navegacion">
      <div className="logo-navegacion">
        <a href="/">
          <img
            src="/images/log2.webp"
            alt="Logo"
            width="100"
            height="auto"
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>

      <button className="boton-hamburguesa" onClick={() => setEstaAbierto(!estaAbierto)}>
        -
      </button>

      <ul className={`enlaces-navegacion ${estaAbierto ? 'abierto' : ''}`}>
        <li><a href="/">Inicio</a></li>
        <li><a href="/tienda">Tienda</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contacto">Contacto</a></li>
        <li><a href="/cart" className="enlace-carrito" aria-label="Ver carrito">Carrito</a></li>
      </ul>
    </nav>
  );
}
