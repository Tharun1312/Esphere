import { useState } from "react";

export default function Purchase({ propertyId, onClose }) {
  const [step, setStep] = useState(1);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const token = localStorage.getItem("token");

  const next = () => {
    if (step === 2 && (!buyerName || !buyerPhone)) {
      return alert("Please enter buyer name & phone to continue.");
    }
    setStep(step + 1);
  };

  const finalizePurchase = async () => {
    try {
      const tokenId = "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase();

      const res = await fetch(`http://localhost:5000/api/properties/${propertyId}/purchase`, {
        method: "PATCH",
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          `Purchase Successful!\n\nToken: ${tokenId}\nBuyer: ${buyerName}\nPhone: ${buyerPhone}`
        );
        window.location.href = "/";
      } else {
        alert(data.message || "Failed to complete purchase");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "400px",
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h2>Property Purchase</h2>

        {/* STEP 1 */}
        {step === 1 && <p>Step 1: Confirm you want to buy this property.</p>}

        {/* STEP 2 - BUYER DETAILS */}
        {step === 2 && (
          <div>
            <p>Step 2: Enter buyer contact information.</p>

            <input
              type="text"
              placeholder="Buyer Name"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="text"
              placeholder="Buyer Phone"
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}

        {/* STEP 3 - FINAL */}
        {step === 3 && (
          <div>
            <p>Final confirmation — purchase is irreversible!</p>

            {/* OTP Placeholder */}
            <label><b>Generate OTP:</b></label>
            <input
              type="text"
              placeholder="OTP will appear here"
              disabled
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                marginTop: "8px",
                background: "#e8e8e8",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
          </div>
        )}

        {/* BUTTONS */}
        {step < 3 ? (
          <button
            onClick={next}
            style={{ padding: "10px 20px", marginTop: "15px" }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={finalizePurchase}
            style={{
              padding: "10px 20px",
              marginTop: "15px",
              background: "green",
              color: "white",
              fontWeight: "bold",
              borderRadius: "6px",
            }}
          >
            Confirm Purchase
          </button>
        )}

        <button
          style={{ marginTop: "10px", display: "block" }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
