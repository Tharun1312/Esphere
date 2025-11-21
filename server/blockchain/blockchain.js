import fs from "fs";
import path from "path";
import crypto from "crypto";

const CHAIN_FILE = path.join(process.cwd(), "chain.json");

class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data; // flexible: create or purchase data
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash
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

  getRecordsForProperty(id) {
    return this.chain.filter(b => b.data && b.data.propertyId === id);
  }

  // Only used on property creation
  addPropertyCreationRecord(property) {
    const lastBlock = this.getLatestBlock();
    const newBlock = new Block(
      lastBlock.index + 1,
      new Date().toISOString(),
      {
        action: "CREATED",
        propertyId: property._id.toString(),
        title: property.title,
        owner: property.ownerName,
        phone: property.ownerPhone,
      },
      lastBlock.hash
    );

    this.chain.push(newBlock);
    this.save();
    return { block: newBlock };
  }

  // 🔥 Used for purchase transaction
  addPurchaseRecord({ action, propertyId, title, buyer, token }) {
    const lastBlock = this.getLatestBlock();

    const newBlock = new Block(
      lastBlock.index + 1,
      new Date().toISOString(),
      {
        action,
        propertyId,
        title,
        buyer,
        token,
      },
      lastBlock.hash
    );

    this.chain.push(newBlock);
    this.save();
    return { block: newBlock };
  }
}

const blockchain = new Blockchain();
export default blockchain;
