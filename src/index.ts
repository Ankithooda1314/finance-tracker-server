// import express, { Request, Response } from "express";

// import cors from "cors";
// import dotenv from "dotenv";
// import { PrismaClient } from "@prisma/client";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// const auth = (req: any, res: any, next: any) => {
//   const header = req.headers.authorization;

//   if (!header)
//     return res.status(401).json({ error: "No token" });

//   try {
//     const token = header.split(" ")[1];

//     const decoded: any = jwt.verify(
//       token,
//       process.env.JWT_SECRET || "secret"
//     );

//     req.userId = decoded.id;
//     next();
//   } catch {
//     res.status(401).json({ error: "Invalid token" });
//   }
// };


// dotenv.config();

// const app = express();
// const prisma = new PrismaClient();

// app.use(cors());
// app.use(express.json());

// app.get("/", (_, res) => {
//   res.send("Server alive 🚀");
// });



// // ================= AUTH =================

// type AuthBody = {
//   name?: string;
//   email: string;
//   password: string;
// };

// // REGISTER
// app.post("/register", async (req: Request<{}, {}, AuthBody>, res: Response) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password)
//       return res.status(400).json({ error: "Missing fields" });

//     const exists = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (exists)
//       return res.status(400).json({ error: "User exists" });

//     const hashed = await bcrypt.hash(password, 10);

//     await prisma.user.create({
//       data: { name, email, password: hashed },
//     });

//     res.json({ message: "User created" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Register failed" });
//   }
// });

// // LOGIN
// app.post("/login", async (req: Request<{}, {}, AuthBody>, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ error: "Missing fields" });

//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user || !user.password)
//       return res.status(400).json({ error: "No user" });

//     const valid = await bcrypt.compare(password, user.password);

//     if (!valid)
//       return res.status(400).json({ error: "Wrong password" });

//     const token = jwt.sign(
//       { id: user.id },
//       process.env.JWT_SECRET || "secret",
//       { expiresIn: "7d" }
//     );

//     res.json({ token, name: user.name });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Login failed" });
//   }
// });



// // ================= TRANSACTIONS =================

// app.post("/transactions", async (req, res) => {
//   try {
//     const tx = await prisma.transaction.create({
//       data: req.body,
//     });

//     res.json(tx);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Create failed" });
//   }
// });

// app.get("/transactions", async (_, res) => {
//   const tx = await prisma.transaction.findMany();
//   res.json(tx);
// });

// app.put("/transactions/:id", async (req, res) => {
//   try {
//     const id = Number(req.params.id);

//     const updated = await prisma.transaction.update({
//       where: { id },
//       data: req.body,
//     });

//     res.json(updated);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Update failed" });
//   }
// });

// app.delete("/transactions/:id", async (req, res) => {
//   try {
//     const id = Number(req.params.id);

//     await prisma.transaction.delete({
//       where: { id },
//     });

//     res.json({ message: "Deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Delete failed" });
//   }
// });

// app.listen(5000, () => {
//   console.log("Running on port 5000");
// });




import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Server alive 🚀");
});


// ================= AUTH MIDDLEWARE =================

const auth = (req: any, res: any, next: any) => {
  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({ error: "No token" });

  try {
    const token = header.split(" ")[1];

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    );

    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};


// ================= AUTH =================

type AuthBody = {
  name?: string;
  email: string;
  password: string;
};

// REGISTER
app.post(
  "/register",
  async (req: Request<{}, {}, AuthBody>, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password)
        return res
          .status(400)
          .json({ error: "Missing fields" });

      const exists = await prisma.user.findUnique({
        where: { email },
      });

      if (exists)
        return res
          .status(400)
          .json({ error: "User exists" });

      const hashed = await bcrypt.hash(
        password,
        10
      );

      await prisma.user.create({
        data: {
          name,
          email,
          password: hashed,
        },
      });

      res.json({ message: "User created" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Register failed" });
    }
  }
);

// LOGIN
app.post(
  "/login",
  async (req: Request<{}, {}, AuthBody>, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res
          .status(400)
          .json({ error: "Missing fields" });

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user)
        return res
          .status(400)
          .json({ error: "No user" });

      const valid = await bcrypt.compare(
        password,
        user.password
      );

      if (!valid)
        return res
          .status(400)
          .json({ error: "Wrong password" });

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" }
      );

      res.json({
        token,
        name: user.name,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Login failed" });
    }
  }
);


// ================= TRANSACTIONS =================

// CREATE
// app.post(
//   "/transactions",
//   auth,
//   async (req: any, res: Response) => {
//     try {
//       const tx =
//         await prisma.transaction.create({
//           data: {
//             ...req.body,
//             userId: req.userId,
//           },
//         });

//       res.json(tx);
//     } catch (err) {
//       console.error(err);
//       res
//         .status(500)
//         .json({ error: "Create failed" });
//     }
//   }
// );

app.post("/transactions", auth, async (req: any, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const {
      title,
      amount,
      type,
      category,
      notes,
      month,
    } = req.body;

    const tx = await prisma.transaction.create({
      data: {
        title,
        amount: Number(amount), // 🔥 FIX
        type,
        category,
        notes,
        month,
        userId: req.userId,
      },
    });

    res.json(tx);
  } catch (err) {
    console.error("CREATE TX ERROR:", err);
    res.status(500).json({
      error: "Create failed",
    });
  }
});





// READ (only user's data)
// app.get(
//   "/transactions",
//   auth,
//   async (req: any, res: Response) => {
//     const tx =
//       await prisma.transaction.findMany({
//         where: { userId: req.userId },
//       });

//     res.json(tx);
//   }
// );


app.get("/transactions", auth, async (req: any, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: "No user attached",
      });
    }

    const tx = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
      },
    });

    res.json(tx);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({
      error: "Read failed",
    });
  }
});


// UPDATE
app.put(
  "/transactions/:id",
  auth,
  async (req: any, res: Response) => {
    try {
      const id = Number(req.params.id);

      const updated =
        await prisma.transaction.update({
          where: { id },
          data: req.body,
        });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Update failed" });
    }
  }
);

// DELETE
app.delete(
  "/transactions/:id",
  auth,
  async (req: any, res: Response) => {
    try {
      const id = Number(req.params.id);

      await prisma.transaction.delete({
        where: { id },
      });

      res.json({ message: "Deleted" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Delete failed" });
    }
  }
);


// ================= START =================

app.listen(5000, () => {
  console.log("Running on port 5000");
});

