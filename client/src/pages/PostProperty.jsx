import { useState } from "react";

export default function PostProperty() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const [surveyNumber, setSurveyNumber] = useState("");

  // Fraud Data
  const [fraudInfo, setFraudInfo] = useState(null);

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      return (window.location.href = "/login");
    }

    if (!title || !price || !location || !size || !description || !category) {
      return alert("All fields are required.");
    }

    if (!ownerName || !ownerPhone || !ownerEmail) {
      return alert("Owner details are required.");
    }

    if (!image) {
      return alert("Please upload an image.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("size", size);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("surveyNumber", surveyNumber);
    formData.append("image", image);
    formData.append("ownerName", ownerName);
    formData.append("ownerPhone", ownerPhone);
    formData.append("ownerEmail", ownerEmail);

    try {
      const res = await fetch("http://localhost:5000/api/properties", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // If fraud exists but posting allowed
        if (data.fraudDetected) {
          alert(
            `⚠️ Listing Posted with Warnings\nRisk Score: ${data.riskScore}%\n\n` +
            `Reasons:\n- ${data.reasons.join("\n- ")}`
          );
        } else {
          alert("Property posted successfully!");
        }

        window.location.href = "/";
      } else {
        // If server returned fraud warnings
        if (data.riskScore !== undefined) {
          setFraudInfo({
            message: data.message,
            reasons: data.reasons || [],
            riskScore: data.riskScore,
          });
        } else {
          alert(data.message || "Failed to post property.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  return (
    <div className="page-container">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Post a Property
      </h1>

      {/* Fraud Warning Box */}
      {fraudInfo && (
        <div
          style={{
            background: "#ffe5e5",
            border: "1px solid red",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3 style={{ color: "red" }}>⚠ Fraud Risk Detected</h3>
          <p><b>Risk Score:</b> {fraudInfo.riskScore}%</p>
          <p><b>Reason(s):</b></p>
          <ul>
            {fraudInfo.reasons.map((r, index) => (
              <li key={index}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Owner Information */}
      <input
        style={inputStyle}
        placeholder="Your Full Name"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
      />
      <input
        style={inputStyle}
        placeholder="Phone Number"
        value={ownerPhone}
        onChange={(e) => setOwnerPhone(e.target.value)}
      />
      <input
        style={inputStyle}
        type="email"
        placeholder="Email"
        value={ownerEmail}
        onChange={(e) => setOwnerEmail(e.target.value)}
      />

      {/* Survey Number */}
      <input
        style={inputStyle}
        placeholder="Survey / House Number"
        value={surveyNumber}
        onChange={(e) => setSurveyNumber(e.target.value)}
      />

      <input
        style={inputStyle}
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        style={inputStyle}
        type="number"
        placeholder="Price (₹)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        style={inputStyle}
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        style={inputStyle}
        placeholder="Size (e.g. 1200 sqft)"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />

      <select
        style={inputStyle}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="Buy">Buy</option>
        <option value="Rent">Rent</option>
        <option value="Commercial">Commercial</option>
        <option value="Projects">Projects</option>
      </select>

      <textarea
        style={{ ...inputStyle, minHeight: "90px" }}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        style={inputStyle}
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button
        style={{
          padding: "14px",
          background: "#004e85",
          color: "white",
          width: "100%",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "10px",
        }}
        onClick={handleSubmit}
      >
        Submit Property
      </button>
    </div>
  );
}
