import "./PropertyCard.css";

export default function PropertyCard({ property }) {
  // ⛔ Do not render deleted properties at all
  if (property.deleted) return null;

  const handleClick = () => {
    window.location.href = `/property/${property._id}`;
  };

  return (
    <div className="property-card" onClick={handleClick} style={{ position: "relative" }}>

      <img
        src={
          property.image
            ? `http://localhost:5000/uploads/${property.image}`
            : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
        }
        alt={property.title}
      />

      <div className="details">
        <h3>₹ {property.price.toLocaleString("en-IN")}</h3>
        <p className="title">{property.title}</p>
        <p className="location">{property.location}</p>
        <p className="size">{property.size}</p>
      </div>
    </div>
  );
}
