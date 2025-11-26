import { useState } from "react";

export default function Purchase({ propertyId, onClose }) {
  const [step, setStep] = useState(1);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const token = localStorage.getItem("token");

  const next = () => {
    // Prevent going ahead without buyer details
    if (step === 2 && (!buyerName || !buyerPhone)) {
      alert("Please enter your name and phone number");
      return;
    }
    setStep(step + 1);
  };

  const finalizePurchase = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/properties/${propertyId}/purchase`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            buyerName,
            buyerPhone,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setTokenId(data.token);
        setPurchaseComplete(true);
      } else {
        alert(data.message || "Failed to complete purchase");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const downloadCertificate = () => {
    window.open(
      `http://localhost:5000/api/properties/${propertyId}/certificate`,
      "_blank"
    );
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

        {/* PURCHASE COMPLETE SCREEN */}
        {purchaseComplete ? (
          <div>
            <p><b>Purchase Successful!</b></p>
            <p>Your Token ID:</p>
            <p style={{ fontSize: "18px", color: "green", fontWeight: "bold" }}>
              {tokenId}
            </p>

            <button
              onClick={downloadCertificate}
              style={{
                padding: "10px 15px",
                marginTop: "15px",
                background: "blue",
                color: "white",
                borderRadius: "6px",
                width: "100%",
              }}
            >
              Download Ownership Certificate (PDF)
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              style={{
                marginTop: "10px",
                background: "#ccc",
                padding: "10px",
                width: "100%",
                borderRadius: "6px",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <p>Step 1: Confirm you want to buy this property.</p>
            )}

            {step === 2 && (
              <div>
                <p>Step 2: Enter your details</p>
                <input
                  placeholder="Your Full Name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  placeholder="Phone Number"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <p>Final confirmation — purchase is irreversible!</p>

                {/* Simulated OTP field */}
                <input
                  type="text"
                  placeholder="OTP (simulated)"
                  disabled
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "8px",
                    background: "#e8e8e8",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              </div>
            )}

            {step < 3 ? (
              <button
                onClick={next}
                style={{
                  padding: "10px 20px",
                  marginTop: "15px",
                  width: "100%",
                  background: "#444",
                  color: "white",
                  borderRadius: "6px",
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={finalizePurchase}
                style={{
                  padding: "10px 20px",
                  marginTop: "15px",
                  width: "100%",
                  background: "green",
                  color: "white",
                  borderRadius: "6px",
                }}
              >
                Confirm Purchase
              </button>
            )}

            <button
              style={{
                marginTop: "10px",
                display: "block",
                width: "100%",
                padding: "10px",
                background: "#ccc",
                borderRadius: "6px",
              }}
              onClick={onClose}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
