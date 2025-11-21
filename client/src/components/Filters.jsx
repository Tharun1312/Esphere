import "./Filters.css";

export default function Filters({ filter, setFilter }) {
  return (
    <div className="filters-container">
      <h3 style={{ marginBottom: "5px" }}>Filter Properties</h3>

      {/* CATEGORY FILTER */}
      <select
        value={filter.category}
        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
      >
        <option value="">All Categories</option>
        <option value="Buy">Buy</option>
        <option value="Rent">Rent</option>
        <option value="Commercial">Commercial</option>
        <option value="Projects">Projects</option>
      </select>

      {/* TYPE / KEYWORD */}
      <input
        type="text"
        placeholder="Type / Keyword (e.g. 2BHK, villa, land)"
        value={filter.type}
        onChange={(e) => setFilter({ ...filter, type: e.target.value })}
      />

      {/* PRICE RANGE */}
      <input
        type="number"
        placeholder="Min Price"
        value={filter.minPrice}
        onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
      />

      <input
        type="number"
        placeholder="Max Price"
        value={filter.maxPrice}
        onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
      />

      {/* RESET */}
      <button
        onClick={() =>
          setFilter({
            category: "",
            type: "",
            minPrice: "",
            maxPrice: "",
          })
        }
      >
        Reset
      </button>
    </div>
  );
}
