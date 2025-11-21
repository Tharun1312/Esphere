import express from "express";
import Property from "../models/Property.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import blockchain from "../blockchain/blockchain.js";

const router = express.Router();

/**
 * POST /api/properties  (Create Property)
 */
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      price,
      location,
      size,
      description,
      category,
      surveyNumber, // NEW FIELD
      ownerName,
      ownerPhone,
      ownerEmail,
    } = req.body;

    if (!title || !price || !location || !size || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!ownerName || !ownerPhone || !ownerEmail) {
      return res.status(400).json({ message: "Seller details required" });
    }

    const property = await Property.create({
      title,
      price,
      location,
      size,
      description,
      category,
      surveyNumber, // SAVE NEW FIELD
      image: req.file ? req.file.filename : null,
      owner: req.userId,
      ownerName,
      ownerPhone,
      ownerEmail,
      deleted: false,
    });

    // Blockchain CREATE event
    const bcResult = blockchain.addPropertyCreationRecord(property);

    return res.json({
      success: true,
      property,
      blockchain: bcResult.block,
    });
  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/properties  (List)
 */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const query = { deleted: false };

    if (category && category !== "all") query.category = category;

    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    console.error("GET LIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/properties/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });
    res.json(property);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/properties/:id/purchase
 */
router.patch("/:id/purchase", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.deleted) {
      return res.status(400).json({ message: "Property already purchased or removed" });
    }

    const tokenId = "TXN-" + Math.random().toString(36).substr(2, 10).toUpperCase();

    blockchain.addPurchaseRecord({
      action: "PURCHASED",
      propertyId: property._id.toString(),
      title: property.title,
      buyer: req.userId,
      token: tokenId,
    });

    property.deleted = true;
    await property.save();

    return res.json({
      message: "Purchase successful",
      token: tokenId,
      property,
    });

  } catch (err) {
    console.error("PURCHASE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/properties/:id/proof
 */
router.get("/:id/proof", async (req, res) => {
  try {
    const records = blockchain.getRecordsForProperty(req.params.id);
    res.json(records);
  } catch (err) {
    console.error("GET PROOF ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/properties/blockchain/all
 */
router.get("/blockchain/all", (req, res) => {
  res.json(blockchain.getAllBlocks());
});

export default router;
