import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Purchase from "./Purchase";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [proof, setProof] = useState([]);
  const [showPurchase, setShowPurchase] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://localhost:5000/api/properties/${id}`);
      const data = await res.json();
      setProperty(data);

      const bc = await fetch(`http://localhost:5000/api/properties/${id}/proof`);
      const bcData = await bc.json();
      setProof(bcData);
    }
    load();
  }, [id]);

  if (!property) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  const block = proof[0];

  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          gap: "30px",
          alignItems: "flex-start",
        }}
      >
        {/* IMAGE LEFT */}
        <img
          src={
            property.image
              ? `http://localhost:5000/uploads/${property.image}`
              : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
          }
          alt={property.title}
          style={{
            width: "45%",
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />

        {/* DETAILS RIGHT */}
        <div style={{ flex: 1 }}>
          <h1>{property.title}</h1>

          <p><b>Price:</b> ₹{property.price}</p>
          <p><b>Location:</b> {property.location}</p>
          <p><b>Size:</b> {property.size}</p>
          <p><b>Category:</b> {property.category}</p>

          {/* NEW FIELD DISPLAYED */}
          {property.surveyNumber && (
            <p><b>Survey / House No:</b> {property.surveyNumber}</p>
          )}

          <h3 style={{ marginTop: "20px" }}>Seller Information</h3>
          <p><b>Name:</b> {property.ownerName}</p>
          <p><b>Phone:</b> {property.ownerPhone}</p>
          <p><b>Email:</b> {property.ownerEmail}</p>

          <button
            onClick={() => setShowPurchase(true)}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* BLOCKCHAIN SECTION */}
      <hr style={{ margin: "40px 0" }} />
      <h3>Blockchain Verification</h3>

      {block ? (
        <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "8px" }}>
          <p><b>Block Index:</b> {block.index}</p>
          <p><b>Hash:</b> {block.hash}</p>
          <p><b>Previous Hash:</b> {block.previousHash}</p>
          <p><b>Timestamp:</b> {block.timestamp}</p>
        </div>
      ) : (
        <p>No blockchain record yet</p>
      )}

      {/* PURCHASE POPUP */}
      {showPurchase && (
        <Purchase propertyId={property._id} onClose={() => setShowPurchase(false)} />
      )}
    </div>
  );
}
