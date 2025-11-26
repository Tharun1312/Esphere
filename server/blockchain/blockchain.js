import fs from "fs";
import path from "path";
import crypto from "crypto";

const CHAIN_FILE = path.join(process.cwd(), "chain.json");

class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash
      )
      .digest("hex");
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.load();
  }

  load() {
    if (fs.existsSync(CHAIN_FILE)) {
      this.chain = JSON.parse(fs.readFileSync(CHAIN_FILE));
    } else {
      this.createGenesisBlock();
    }
  }

  save() {
    fs.writeFileSync(CHAIN_FILE, JSON.stringify(this.chain, null, 2));
  }

  createGenesisBlock() {
    this.chain = [
      new Block(0, new Date().toISOString(), { message: "Genesis Block" }, "0"),
    ];
    this.save();
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  getAllBlocks() {
    return this.chain;
  }

  phoneExists(phone) {
    return this.chain.some(
      (block) => block.data && block.data.ownerPhone === phone
    );
  }

  // ✔ FIXED: PROPERTY CREATION RECORD
  addPropertyCreationRecord(property) {
    const { _id, title, ownerName, ownerPhone, surveyNumber } = property;

    const lastBlock = this.getLatestBlock();

    const newBlock = new Block(
      lastBlock.index + 1,
      new Date().toISOString(),
      {
        action: "CREATED",
        propertyId: _id.toString(),
        title,
        ownerName,
        ownerPhone,
        surveyNumber
      },
      lastBlock.hash
    );

    this.chain.push(newBlock);
    this.save();

    return { block: newBlock };
  }

  // ✔ FIXED: PURCHASE RECORD (now saves buyerName + buyerPhone)
  addPurchaseRecord(data) {
    const lastBlock = this.getLatestBlock();

    const newBlock = new Block(
      lastBlock.index + 1,
      new Date().toISOString(),
      {
        action: data.action,
        propertyId: data.propertyId,
        title: data.title,
        buyerName: data.buyerName,    // ✔ added
        buyerPhone: data.buyerPhone,  // ✔ added
        token: data.token,
        timestamp: data.timestamp,
      },
      lastBlock.hash
    );

    this.chain.push(newBlock);
    this.save();
    return { block: newBlock };
  }

  // ✔ Required for certificate + proof
  getRecordsForProperty(propertyId) {
    return this.chain.filter(
      (block) => block.data.propertyId === propertyId
    );
  }
}

const blockchain = new Blockchain();
export default blockchain;
