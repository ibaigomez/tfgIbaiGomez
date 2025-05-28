
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Filtros from './Filtros';
import '../styles/grid.css'; 


export default function ProductBrowser({ products }) {
  // estados de los campos, por defecto 
  const [selected, setSelected] = useState(null); // Producto seleccionado
  const [imageIndex, setImageIndex] = useState(0); // Imagen
  const [searchNombre, setSearchNombre] = useState(''); // Filtro por nombre
  const [searchMarca, setSearchMarca] = useState(''); // Filtro por marca
  const [selectedTalla, setSelectedTalla] = useState(null); // Filtro por talla
  const [priceOrder, setPriceOrder] = useState(''); // Orden por precio
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false); // Mostrar/ocultar panel filtros

  
  const fieldLabels = ['Modelo', 'Descripción', 'Marca', 'Color'];
  const tallaRango = ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49"];


  //  Filtro de nombre , marca y talla
  const filteredProducts = products.filter(product => {
    const nombre = product.name?.toLowerCase() || '';
    const marca = (
      product.components?.find(c => c.name === 'Marca')?.content?.text || ''
    ).toLowerCase();

    const tallaDisponible = product.variants?.some(variant =>
      variant.attributes?.some(attr =>
        attr.attribute === 'talla' && attr.value === selectedTalla
      )
    );

    const matchesNombre = nombre.includes(searchNombre.toLowerCase());
    const matchesMarca = marca.includes(searchMarca.toLowerCase());
    const matchesTalla = selectedTalla ? tallaDisponible : true;

    return matchesNombre && matchesMarca && matchesTalla;
  });


  // filtro ordenadr por precio
  let orderedProducts = [...filteredProducts];
  if (priceOrder === 'asc') {
    orderedProducts.sort((a, b) => a.defaultVariant.price - b.defaultVariant.price);
  } else if (priceOrder === 'desc') {
    orderedProducts.sort((a, b) => b.defaultVariant.price - a.defaultVariant.price);
  }

  // botones carrusel al expandir card
  const showPrevImage = () => setImageIndex(prev => Math.max(prev - 1, 0));
  const showNextImage = () => {
    if (!selected?.defaultVariant?.images) return;
    setImageIndex(prev => Math.min(prev + 1, selected.defaultVariant.images.length - 1));
  };

  // validacion de los filtros
  const hayFiltrosActivos = () =>
    searchNombre.trim() !== '' || searchMarca.trim() !== '' || selectedTalla !== null || priceOrder !== '';

  // cargar filtros del index
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nombre = params.get("nombre");
    if (nombre) setSearchNombre(nombre);
  }, []);

  // carrito en localStorage
 const addToCart = (producto, tallaSeleccionada) => {
  if (!tallaSeleccionada) {
    alert("Selecciona una talla primero.");
    return;
  }

  // Obtener el carrito actual del localStorage o inicializar vacío
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Obtener el SKU del producto (de la primera variante)
  const sku = producto.variants?.[0]?.sku;

  // Buscar si ya existe el mismo producto (por SKU y talla)
  const existente = cart.find(item => item.sku === sku && item.talla === tallaSeleccionada);

  if (existente) {
    // Si ya existe, aumentamos la cantidad
    existente.cantidad += 1;
  } else {
    // Si es nuevo, lo añadimos al carrito
    cart.push({
      id: producto.id,
      sku: sku,
      nombre: producto.name,
      precio: producto.variants[0].priceVariants[0]?.price || 0,
      talla: tallaSeleccionada,
      cantidad: 1,
      imagen: producto.defaultVariant.images[0]?.url || ''
    });
  }

  // Guardamos el carrito actualizado
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Añadido al carrito.");
};

  
  return (
    <div>
      {/* mensaje de error si no coincide nada con los filtros */}
      {!selected && hayFiltrosActivos() && orderedProducts.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#888', fontSize: '1.1rem' }}>
          No se encontraron productos con los filtros actuales.
        </div>
      )}

      {/* Boton de filtros */}
      {!selected && (
        <>
          <div className="toggle-filtros">
            <button onClick={() => setFiltrosAbiertos(prev => !prev)}>
              {filtrosAbiertos ? 'Ocultar filtros' : 'Mostrar filtros'}
            </button>
          </div>
          <div className={`panel-filtros ${filtrosAbiertos ? 'open' : ''}`}>
            <Filtros
              searchNombre={searchNombre}
              setSearchNombre={setSearchNombre}
              searchMarca={searchMarca}
              setSearchMarca={setSearchMarca}
              selectedTalla={selectedTalla}
              setSelectedTalla={setSelectedTalla}
              priceOrder={priceOrder}
              setPriceOrder={setPriceOrder}
            />
          </div>
        </>
      )}

      {/* framer-motion para mostrar los productos */}
<AnimatePresence mode="wait">
  {!selected ? (
    // grid de todos los productos
    <motion.div
      key="grid"
      className="grid-productos"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      {orderedProducts.map((product, index) => (
        <motion.div
          key={index}
          className="tarjeta-producto"
          onClick={() => {
            setSelected(product);
            setTimeout(() => {
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            }, 0);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          style={{ cursor: 'pointer' }}
        >
          <img src={product.defaultVariant.images[0].url} alt={product.name} />
          <h2>{product.name}</h2>
          <p>{product.defaultVariant.price}€</p>
        </motion.div>
      ))}
    </motion.div>
  ) : (
    // vista al seleccionar un producto
    <motion.div
      key="detail"
      className="detalle-producto"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="contenedor-volver">
        <button onClick={() => { setSelected(null); setImageIndex(0); }} className="boton-volver">
          ← Volver
        </button>
      </div>

      <div className="contenedor-detalle">
        {/* carrusel de imagenes */}
        <div className="galeria-imagenes">
          <div className="miniaturas">
            {selected.defaultVariant.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`Thumbnail ${idx}`}
                className={`miniatura ${idx === imageIndex ? 'active' : ''}`}
                onClick={() => setImageIndex(idx)}
              />
            ))}
          </div>
          <div className="imagen-principal-contenedor">
            <img
              src={selected.defaultVariant.images[imageIndex].url}
              alt={selected.name}
              className="imagen-principal"
            />
            <div className="flechas-navegacion">
              <button onClick={showPrevImage}>{'‹'}</button>
              <button onClick={showNextImage}>{'›'}</button>
            </div>
          </div>
        </div>

        {/* info del producto */}
        <div className="info-producto">
          <h1>{selected.name}</h1>
          {selected.variants?.[0]?.sku && <p className="codigo-sku">SKU: {selected.variants[0].sku}</p>}
          {selected.variants?.[0]?.priceVariants?.[0] && (
            <p className="precio">{selected.variants[0].priceVariants[0].price} €</p>
          )}

          {/* campos restantes*/}
          {selected.components?.map((component, i) => (
            <div key={i} className="bloque-componente">
              <p className="titulo-componente">{fieldLabels[i] || `Campo ${i + 1}`}</p>
              {component.content?.text && (
                <p className="valor-componente">{component.content.text}</p>
              )}
            </div>
          ))}

          {/* apartado tallas */}
          <div className="seccion-tallas">
            <label>Tallas disponibles:</label>
            <div className="opciones-talla">
              {tallaRango.map((talla, i) => {
                const disponible = selected.variants.some(v =>
                  v.attributes?.some(attr => attr.attribute === 'talla' && attr.value === talla)
                );
                return (
                  <button
                    key={i}
                    className={`boton-talla ${!disponible ? 'disabled' : ''} ${selectedTalla === talla ? 'active' : ''}`}
                    onClick={() => disponible && setSelectedTalla(talla)}
                    disabled={!disponible}
                  >
                    {disponible ? `EU ${talla}` : <s>EU {talla}</s>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* boton carrito */}
          <button className="boton-compra" onClick={() => addToCart(selected, selectedTalla)}>
            Añadir al carrito
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>


    </div>
  );
}
