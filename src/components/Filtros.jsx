export default function Filtros({
  searchNombre,
  setSearchNombre,
  searchMarca,
  setSearchMarca,
  selectedTalla,
  setSelectedTalla,
  priceOrder,
  setPriceOrder,
}) {
  const tallas = ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49"];

  return (
    <>
      <div className="grupo-filtro">
        <label htmlFor="nombre">Buscar por nombre</label>
        <input
          type="text"
          id="nombre"
          placeholder="Ej: Jordan"
          value={searchNombre}
          onChange={(e) => setSearchNombre(e.target.value)}
        />
      </div>

      <div className="grupo-filtro">
        <label htmlFor="marca">Buscar por marca</label>
        <input
          type="text"
          id="marca"
          placeholder="Ej: Nike"
          value={searchMarca}
          onChange={(e) => setSearchMarca(e.target.value)}
        />
      </div>

      <div className="grupo-filtro">
        <label htmlFor="talla">Talla</label>
        <select
          id="talla"
          value={selectedTalla || ''}
          onChange={(e) => setSelectedTalla(e.target.value || null)}
        >
          <option value="">Todas</option>
          {tallas.map(talla => (
            <option key={talla} value={talla}>EU {talla}</option>
          ))}
        </select>
      </div>

      <div className="grupo-filtro">
        <label htmlFor="precio">Ordenar por precio</label>
        <select
          id="precio"
          value={priceOrder}
          onChange={(e) => setPriceOrder(e.target.value)}
        >
          <option value="">Por defecto</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
        </select>
      </div>
    </>
  );
}
