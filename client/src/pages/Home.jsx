import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import PropertyCard from "../components/PropertyCard";
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryFromURL = params.get("category") || "";

  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState({
    category: categoryFromURL, // 👈 IMPORTANT: Auto filter from Navbar clicks
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    async function fetchProps() {
      try {
        const res = await fetch("http://localhost:5000/api/properties");
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProps();
  }, []);

  // Reapply category filter when URL changes
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      category: categoryFromURL,
    }));
  }, [categoryFromURL]);

  // FILTER LOGIC
  const filteredProperties = properties.filter((p) => {
    return (
      (!filter.category || p.category === filter.category) &&
      (!filter.type || p.title.toLowerCase().includes(filter.type.toLowerCase())) &&
      (!filter.minPrice || p.price >= Number(filter.minPrice)) &&
      (!filter.maxPrice || p.price <= Number(filter.maxPrice))
    );
  });

  // SEARCH ON TOP OF FILTERS
  const searchFiltered = filteredProperties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search + Filters */}
      <SearchBar search={search} setSearch={setSearch} />
      <Filters filter={filter} setFilter={setFilter} />

      <div className="page-container">

        <h2>Featured Properties</h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          {searchFiltered.length === 0 ? (
            <p style={{ fontSize: "18px", color: "gray" }}>
              ❗ No properties match your search or filters
            </p>
          ) : (
            searchFiltered.map((p) => <PropertyCard key={p._id} property={p} />)
          )}
        </div>
      </div>
    </div>
  );
}
