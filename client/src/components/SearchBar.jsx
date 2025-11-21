import "./SearchBar.css";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by title or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
