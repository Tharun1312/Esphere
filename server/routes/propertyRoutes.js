import express from "express";
import Property from "../models/Property.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import blockchain from "../blockchain/blockchain.js";
import PDFDocument from "pdfkit";
import { runFraudChecks } from "../utils/fraudDetection.js";

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
      surveyNumber,
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

    // ---------------------------------------------------------
    // 🔥 FRAUD CHECK — BLOCK PROPERTY IF RISK > 0
    // ---------------------------------------------------------
    const fraud = await runFraudChecks({
      surveyNumber,
      ownerPhone,
      price,
      category,
    });

    if (fraud.riskScore > 0) {
      return res.status(400).json({
        message: "Fraud detected — property NOT posted.",
        fraudDetected: true,
        riskScore: fraud.riskScore,
        reasons: fraud.reasons,
      });
    }
    // ---------------------------------------------------------

    const property = await Property.create({
      title,
      price,
      location,
      size,
      description,
      category,
      surveyNumber,
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
      return res.status(400).json({ message: "Property already purchased" });
    }

    const { buyerName, buyerPhone } = req.body;

    if (!buyerName || !buyerPhone) {
      return res.status(400).json({ message: "Buyer details required" });
    }

    const tokenId =
      "TXN-" + Math.random().toString(36).substr(2, 10).toUpperCase();

    blockchain.addPurchaseRecord({
      action: "PURCHASED",
      propertyId: property._id.toString(),
      title: property.title,
      buyerName,
      buyerPhone,
      token: tokenId,
      timestamp: new Date().toISOString(),
    });

    property.deleted = true;
    await property.save();

    return res.json({
      message: "Purchase successful",
      token: tokenId,
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
 * GET /api/properties/:id/certificate  (PDF Generator)
 */
router.get("/:id/certificate", async (req, res) => {
  try {
    const records = blockchain.getRecordsForProperty(req.params.id);
    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No blockchain record found" });
    }

    const lastRecord = records[records.length - 1];
    const property = await Property.findById(req.params.id);

    const doc = new PDFDocument();
    const filename = `certificate_${Date.now()}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(22).text("PROPERTY OWNERSHIP CERTIFICATE", {
      align: "center",
    });
    doc.moveDown();

    doc.fontSize(14).text(`Property Title: ${property.title}`);
    doc.text(`Location: ${property.location}`);
    doc.text(`Category: ${property.category}`);
    doc.text(`Survey Number: ${property.surveyNumber || "N/A"}`);
    doc.moveDown();

    doc.text(`Buyer Name: ${lastRecord.data.buyerName}`);
    doc.text(`Buyer Phone: ${lastRecord.data.buyerPhone}`);
    doc.moveDown();

    doc.text(`Token ID: ${lastRecord.data.token}`);
    doc.text(`Blockchain Hash: ${lastRecord.hash}`);
    doc.text(`Timestamp: ${lastRecord.timestamp}`);
    doc.moveDown();

    doc.text("This certificate is blockchain-verified and tamper-proof.", {
      align: "center",
    });

    doc.end();
  } catch (err) {
    console.error("CERTIFICATE ERROR:", err);
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
