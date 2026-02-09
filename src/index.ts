import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Server alive 🚀");
});


// CREATE
app.post("/transactions", async (req, res) => {
  try {
    const { title, amount, type } = req.body;

    if (!title || !amount || !type) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const tx = await prisma.transaction.create({
      data: { title, amount, type },
    });

    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Create failed" });
  }
});


// READ
app.get("/transactions", async (_, res) => {
  try {
    const tx = await prisma.transaction.findMany();
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Read failed" });
  }
});


// UPDATE
app.put("/transactions/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const { title, amount, type } = req.body;

    const updated = await prisma.transaction.update({
      where: { id },
      data: { title, amount, type },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed (record may not exist)" });
  }
});


// DELETE
app.delete("/transactions/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed (record may not exist)" });
  }
});


app.listen(5000, () => {
  console.log("Running on port 5000");
});
