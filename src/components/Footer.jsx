import React from "react";
import "../styles/Footer.css"; 

export default function Footer() {
  return (
    <footer className="footer-sitio">
      <div className="contenedor-footer">
        <div className="columna-footer">
          <h3>Sobre Nosotros</h3>
          <p>Somos una tienda apasionada por ofrecer productos de calidad y atención personalizada.</p>
        </div>
        <div className="columna-footer">
          <h3>Enlaces</h3>
          <ul>
            <li><a href="/shop">Tienda</a></li>
            <li><a href="/about">Quiénes somos</a></li>
            <li><a href="/contact">Contacto</a></li>
          </ul>
        </div>
        <div className="columna-footer">
          <h3>Contacto</h3>
          <p>Email: ibaigomez02@gmail.com</p>
          <p>Tel: +34 123 456 789</p>
          <div className="iconos-sociales">
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-instagram"></i></a>
            <a href="#"><i className="bi bi-twitter"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-inferior">
        <p>&copy; {new Date().getFullYear()} Tienda. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
