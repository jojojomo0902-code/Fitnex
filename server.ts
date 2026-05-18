import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database Path
  const DB_PATH = path.join(process.cwd(), "db.json");

  // Initialize DB if not exists
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [
        { id: "admin-1", name: "Raja Admin", email: "admin@fitnex.com", password: "admin", role: "Admin" },
        { id: "trainer-1", name: "Siti Nur", email: "trainer@fitnex.com", password: "trainer", role: "Trainer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
        { id: "m-1", name: "Ali Bin Abu", email: "ali@email.com", password: "user", role: "Member", plan: "Premium", status: "Active", avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=150" },
        { id: "m-2", name: "Ling Mei", email: "ling@email.com", password: "user", role: "Member", plan: "Basic", status: "Active", avatar: "https://images.unsplash.com/photo-1516523653452-4bab72b99650?auto=format&fit=crop&q=80&w=150" },
        { id: "m-3", name: "Muthu Raja", email: "muthu@email.com", password: "user", role: "Member", plan: "Premium", status: "Active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
        { id: "m-4", name: "Amira Zulkifli", email: "amira@email.com", password: "user", role: "Member", plan: "Premium", status: "Active", avatar: "https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=150" }
      ],
      classes: [
        { id: "1", name: "Morning Yoga", trainer: "Siti Nur", time: "08:00 AM", capacity: 20, booked: 5, category: "Yoga", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" },
        { id: "2", name: "High Intensity Cardio", trainer: "Muthu Raja", time: "10:00 AM", capacity: 15, booked: 12, category: "Cardio", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800" },
        { id: "3", name: "Power Lifting", trainer: "Dwayne Ali", time: "05:00 PM", capacity: 10, booked: 8, category: "Strength", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800" },
        { id: "4", name: "Pilates Advance", trainer: "Siti Nur", time: "06:30 PM", capacity: 12, booked: 4, category: "Yoga", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800" }
      ],
      inventory: [
        { id: "1", name: "Whey Protein (Vanilla)", category: "Supplements", stock: 25, price: 50, image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=800" },
        { id: "2", name: "Gym Towel", category: "Merchandise", stock: 50, price: 15, image: "https://images.unsplash.com/photo-1583912267550-d44d2a3ad77a?auto=format&fit=crop&q=80&w=800" },
        { id: "3", name: "Pre-Workout Blaze", category: "Supplements", stock: 5, price: 40, image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=800" },
        { id: "4", name: "FitNex Shaker", category: "Merchandise", stock: 100, price: 12, image: "https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?auto=format&fit=crop&q=80&w=800" },
        { id: "5", name: "Creatine 300g", category: "Supplements", stock: 8, price: 35, image: "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&q=80&w=800" }
      ],
      bookings: [],
      attendance: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  }

  const getDb = () => JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  const saveDb = (data: any) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

  // --- API Routes ---

  // Auth: Register (Member Only as per prompt)
  app.post("/api/auth/register", (req, res) => {
    const { name, email, password, phone, gender, age } = req.body;
    const db = getDb();
    if (db.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const newUser = { id: Date.now().toString(), name, email, password, phone, gender, age, role: "Member", status: "Active", plan: "Basic" };
    db.users.push(newUser);
    saveDb(db);
    res.json({ user: newUser });
  });

  // Auth: Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password, role } = req.body;
    const db = getDb();
    const user = db.users.find((u: any) => u.email === email && u.password === password && u.role === role);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials or role" });
    }
    res.json({ user });
  });

  // Classes
  app.get("/api/classes", (req, res) => {
    const db = getDb();
    res.json(db.classes);
  });

  app.post("/api/classes/book", (req, res) => {
    const { userId, classId } = req.body;
    const db = getDb();
    const gymClass = db.classes.find((c: any) => c.id === classId);
    if (gymClass && gymClass.booked < gymClass.capacity) {
      db.bookings.push({ id: Date.now().toString(), userId, classId, timestamp: new Date() });
      gymClass.booked += 1;
      saveDb(db);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Class full or not found" });
    }
  });

  // Inventory
  app.get("/api/inventory", (req, res) => {
    const db = getDb();
    res.json(db.inventory);
  });

  app.post("/api/inventory/buy", (req, res) => {
    const { userId, productId } = req.body;
    const db = getDb();
    const product = db.inventory.find((p: any) => p.id === productId);
    
    if (product && product.stock > 0) {
      product.stock -= 1;
      // In a real app we'd save the order, but for now just decrement stock
      saveDb(db);
      res.json({ success: true, newStock: product.stock });
    } else {
      res.status(400).json({ error: "Product out of stock or not found" });
    }
  });

  // Stats (Admin)
  app.get("/api/admin/stats", (req, res) => {
    const db = getDb();
    res.json({
      totalMembers: db.users.filter((u: any) => u.role === "Member").length,
      activeClasses: db.classes.length,
      inventoryAlerts: db.inventory.filter((i: any) => i.stock < 10).length,
      todayRevenue: 1250 // Mock
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
