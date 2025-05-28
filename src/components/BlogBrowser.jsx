
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/blog.css';

// Componente principal que muestra todos los blogs
export default function BlogBrowser({ blogs }) {
  // Blog seleccionado, por defecto ninguno
  const [selected, setSelected] = useState(null);

  // funcion para sacar el título del blog 
  const getTitulo = (blog) =>
    blog.components?.[0]?.content?.json?.[0]?.textContent || '';

  // funcion para obtener la fecha en español y bien formateada
  const getFecha = (blog) => {
    const datetime = blog.components?.[1]?.content?.datetime;
    return datetime
      ? new Date(datetime).toLocaleDateString('es-ES', { dateStyle: 'long' })
      : '';
  };

  // funcion para validar json
  const getExplicacion = (blog) => {
    const json = blog.components?.[2]?.content?.json;
    return Array.isArray(json) ? json : [];
  };


  return (
    <div>
  <AnimatePresence mode="wait">
  {!selected ? (
    // Si no hay blog seleccionadoa mostramos las cards
    <motion.div
      key="grid"
      className="grid"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      {/* Recorremos todos los blogs y los mostramos como tarjetas */}
      {blogs.map((blog, index) => (
        <motion.div
          key={index}
          onClick={() => setSelected(blog)} // Cuando le das click, se abre ese blog
          className="card"
          whileHover={{ scale: 1.05 }}  
          whileTap={{ scale: 0.97 }}   
          style={{ cursor: 'pointer' }}
        >
          {blog.defaultVariant?.images?.[0]?.url && (
            <img
              src={blog.defaultVariant.images[0].url}
              alt={blog.name}
              className="blog-card-img"
            />
          )}
          {/* Mostramos el nombre del blog */}
          <h2>{blog.name}</h2>
        </motion.div>
      ))}
    </motion.div>
  ) : (
    // Si hay un blog seleccionado, mostramos su contenido completo
    <motion.div
      key="detail"
      className="blog-fullscreen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Botón para cerrar el blog y volver a la lista */}
      <button
        className="close-button"
        onClick={() => {
          setSelected(null);
          document.documentElement.scrollTop = 0;
        }}
      >
        ×
      </button>

      {/* Si el blog tiene una imagen, la mostramos */}
      {selected.defaultVariant?.images?.[0]?.url && (
        <img
          src={selected.defaultVariant.images[0].url}
          alt={getTitulo(selected)}
          className="blog-full-img"
        />
      )}

      <div className="blog-content">
        {/* Mostramos la fecha y el título */}
        <p className="blog-date">{getFecha(selected)}</p>
        <h1>{getTitulo(selected)}</h1>

        {/* texto del blog generamos indicaciones para desplegarlo de manera correcta */}
   <div className="blog-body">
  {/* Recorremos cada bloque del JSON del contenido del blog */}
  {getExplicacion(selected).map((block, i) => {
    
    // Verificamos si el bloque es un párrafo
    if (block.kind === "block" && block.type === "paragraph") {

      // Si el párrafo tiene hijos (fragmentos de texto con estilos)
      if (block.children) {
        return (
          <p key={i}>
            {/* Recorremos los hijos del párrafo */}
            {block.children.map((child, j) => {

              // Si el hijo es un texto en negrita
              if (child.kind === "inline" && child.type === "strong") {
                return <strong key={j}>{child.textContent}</strong>;

              // Si el hijo es un texto normal
              } else if (child.kind === "inline") {
                return <span key={j}>{child.textContent}</span>;

              // Si no es ninguno de los tipos anteriores, no renderizamos nada
              } else {
                return null;
              }
            })}
          </p>
        );

      // Si el párrafo no tiene hijos, simplemente mostramos el texto tal cual
      } else {
        return <p key={i}>{block.textContent}</p>;
      }
    }

    // Si el bloque no es un párrafo, lo ignoramos
    return null;
  })}
</div>

      </div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}
