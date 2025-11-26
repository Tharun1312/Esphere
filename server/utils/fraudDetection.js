// server/utils/fraudDetection.js
import Property from "../models/Property.js";
import blockchain from "../blockchain/blockchain.js";

export async function runFraudChecks(propertyData) {
  console.log("🔎 FRAUD CHECK RUNNING with data:", propertyData);

  let risk = 0;
  let reasons = [];

  const { surveyNumber, ownerPhone, price, category } = propertyData;

  // Convert price into number
  const numericPrice = Number(price);
  console.log("💰 Numeric Price:", numericPrice);

  // 1. Survey number duplicate
  if (surveyNumber) {
    const surveyExists = await Property.findOne({ surveyNumber });
    if (surveyExists) {
      risk += 40;
      reasons.push("Survey number already used in another listing.");
    }
  }

  // 2. Check seller posted too many properties
  const ownerListings = await Property.countDocuments({ ownerPhone });
  if (ownerListings > 2) {
    risk += 25;
    reasons.push(`Seller posted ${ownerListings} properties (suspicious frequency).`);
  }

  // 3. Blockchain duplicate phone check
  if (blockchain.phoneExists(ownerPhone)) {
    risk += 20;
    reasons.push("This phone number already exists on blockchain.");
  }

  // 4. Price anomaly detection
  const categoryAverage = {
    Buy: 1500000,
    Rent: 8000,
    Commercial: 2500000,
    Projects: 3000000
  };

  if (categoryAverage[category]) {
    let avg = categoryAverage[category];

    if (numericPrice < avg * 0.5) {
      risk += 20;
      reasons.push("Price suspiciously LOW compared to category average.");
    }

    if (numericPrice > avg * 2.5) {
      risk += 20;
      reasons.push("Price suspiciously HIGH for this category.");
    }
  }

  return {
    riskScore: Math.min(risk, 100),
    reasons
  };
}
