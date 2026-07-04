import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

const dbPath = path.join(process.cwd(), "src/db/data.json");

// Helper to safely read db
function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      // create parent directories if they don't exist
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dbPath, JSON.stringify({ posts: [], designs: [], editors: [] }, null, 2), "utf-8");
    }
    const raw = fs.readFileSync(dbPath, "utf-8");
    const parsed = JSON.parse(raw);
    
    // Ensure editors list exists
    let updated = false;
    if (!parsed.editors || parsed.editors.length === 0) {
      parsed.editors = [
        { id: "editor-1", name: "Marcus Thorne", role: "Principal Architect", email: "marcus@mdhakaholding.com", password: "marcus123" },
        { id: "editor-2", name: "Sarah Lin", role: "Director of Structural Engineering", email: "sarah@mdhakaholding.com", password: "sarah123" },
        { id: "editor-3", name: "David Vance", role: "Chief Systems Engineer", email: "david@mdhakaholding.com", password: "david123" }
      ];
      updated = true;
    } else {
      parsed.editors.forEach((editor: any) => {
        if (!editor.email) {
          editor.email = `${editor.name.toLowerCase().replace(/\s+/g, "")}@mdhakaholding.com`;
          editor.password = "editor123";
          updated = true;
        }
      });
    }
    if (updated) {
      fs.writeFileSync(dbPath, JSON.stringify(parsed, null, 2), "utf-8");
    }
    return parsed;
  } catch (err) {
    console.error("Error reading database file", err);
    return { posts: [], designs: [], editors: [] };
  }
}

// Helper to safely write db
function writeDb(data: any) {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// Lazy init Gemini Client to avoid crashing on startup if key is missing
let ai: GoogleGenAI | null = null;
function getAiClient() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please set it in Settings > Secrets.");
    }
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// ================= API ROUTES =================

// Blog endpoints
app.get("/api/posts", (req, res) => {
  const db = readDb();
  res.json(db.posts);
});

// Editors endpoints
app.get("/api/editors", (req, res) => {
  const db = readDb();
  res.json(db.editors || []);
});

app.post("/api/editors", (req, res) => {
  const { name, role, email, password } = req.body;
  if (!name || !role || !email || !password) {
    return res.status(400).json({ error: "Name, professional role, email, and password are all required to register." });
  }

  const db = readDb();
  if (!db.editors) db.editors = [];

  // Check if email already registered
  const emailExists = db.editors.some((e: any) => e.email.toLowerCase().trim() === email.toLowerCase().trim());
  if (emailExists) {
    return res.status(400).json({ error: "An editor with this email is already registered." });
  }

  // Check if name already registered
  const nameExists = db.editors.some((e: any) => e.name.toLowerCase().trim() === name.toLowerCase().trim());
  if (nameExists) {
    return res.status(400).json({ error: "An editor with this name is already registered." });
  }

  const newEditor = {
    id: `editor-${Date.now()}`,
    name: name.trim(),
    role: role.trim(),
    email: email.toLowerCase().trim(),
    password: password
  };

  db.editors.push(newEditor);
  writeDb(db);
  
  // Return editor info without password
  const { password: _, ...safeEditor } = newEditor;
  res.status(210).json(safeEditor);
});

// Editor & Admin Login endpoint
app.post("/api/editors/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const cleanEmail = email.toLowerCase().trim();

  // 1. Check for Admin Login
  if (cleanEmail === "admin@mdhakaholding.com" && password === "admin123") {
    return res.json({
      id: "admin",
      name: "System Administrator",
      role: "System Administrator",
      email: "admin@mdhakaholding.com",
      isAdmin: true
    });
  }

  // 2. Check for Editor Login
  const db = readDb();
  const editor = (db.editors || []).find((e: any) => e.email.toLowerCase().trim() === cleanEmail);
  
  if (!editor || editor.password !== password) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const { password: _, ...safeEditor } = editor;
  res.json({ ...safeEditor, isAdmin: false });
});

// Delete Editor endpoint
app.delete("/api/editors/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.editors) db.editors = [];

  const initialLength = db.editors.length;
  db.editors = db.editors.filter((e: any) => e.id !== id);

  if (db.editors.length === initialLength) {
    return res.status(404).json({ error: "Editor not found." });
  }

  writeDb(db);
  res.json({ success: true, message: "Editor has been deleted from the registry." });
});

app.post("/api/posts", (req, res) => {
  const { title, summary, content, category, imageUrl, author } = req.body;
  if (!title || !summary || !content || !category || !imageUrl || !author) {
    return res.status(400).json({ error: "Missing required fields for blog post (including Author)." });
  }

  const db = readDb();
  
  // Validate that the author is a registered editor
  const authorNameClean = author.split(",")[0].trim().toLowerCase(); // e.g. "Marcus Thorne" from "Marcus Thorne, Principal Architect"
  
  const isRegistered = (db.editors || []).some((e: any) => {
    const editorName = e.name.toLowerCase().trim();
    return authorNameClean === editorName || 
           editorName.includes(authorNameClean) ||
           authorNameClean.includes(editorName);
  });

  if (!isRegistered) {
    return res.status(403).json({ 
      error: `Only registered editors are authorized to publish blog posts. Please register "${authorNameClean}" as an editor first!` 
    });
  }

  const newPost = {
    id: `post-${Date.now()}`,
    title,
    summary,
    content,
    category,
    imageUrl,
    date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
    author: author
  };

  db.posts.unshift(newPost); // Add to the top
  writeDb(db);
  res.status(210).json(newPost);
});

app.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const initialLength = db.posts.length;
  db.posts = db.posts.filter((p: any) => p.id !== id);
  if (db.posts.length === initialLength) {
    return res.status(404).json({ error: "Post not found." });
  }
  writeDb(db);
  res.json({ success: true, message: "Blog post deleted successfully." });
});

// Architectural designs endpoints
app.get("/api/designs", (req, res) => {
  const db = readDb();
  res.json(db.designs);
});

app.post("/api/designs", (req, res) => {
  const { title, style, description, imageUrl, specifications } = req.body;
  if (!title || !style || !description || !imageUrl || !specifications) {
    return res.status(400).json({ error: "Missing required fields for architectural design." });
  }

  const db = readDb();
  const newDesign = {
    id: `design-${Date.now()}`,
    title,
    style,
    description,
    imageUrl,
    specifications: {
      area: specifications.area || "2,500 sq ft",
      bedrooms: specifications.bedrooms || "3 Bedrooms",
      bathrooms: specifications.bathrooms || "2.5 Bathrooms",
      materials: specifications.materials || ["Timber", "Concrete", "Glass"],
      duration: specifications.duration || "12 Months"
    },
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.designs.unshift(newDesign);
  writeDb(db);
  res.status(210).json(newDesign);
});

app.delete("/api/designs/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const initialLength = db.designs.length;
  db.designs = db.designs.filter((d: any) => d.id !== id);
  if (db.designs.length === initialLength) {
    return res.status(404).json({ error: "Design not found." });
  }
  writeDb(db);
  res.json({ success: true, message: "Architectural design deleted successfully." });
});

// AI custom design generator
app.post("/api/generate-design", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.style || !payload.budget || !payload.bedrooms || !payload.bathrooms) {
      return res.status(400).json({ error: "Missing required spec fields for generator." });
    }

    const client = getAiClient();
    const prompt = `You are a world-class Principal Architect for a luxury modern construction and design company.
Analyze the following custom home specifications and generate a comprehensive structural proposal.

Style Preference: ${payload.style}
Desired Budget Bracket: ${payload.budget}
Bedrooms Count: ${payload.bedrooms}
Bathrooms Count: ${payload.bathrooms}
Preferred Building Materials: ${payload.materialsPreference || "Any professional recommendation"}
Additional Requests: ${payload.additionalRequests || "None"}

Generate a highly structured architectural response in JSON format. The response must match this schema exactly:
{
  "title": "A distinctive, elegant, and creative project name (e.g., 'The Obsidian Oasis', 'The Solstice Pavilion')",
  "styleDescription": "A sophisticated 2-3 sentence paragraph explaining the aesthetic direction, orientation, and structural rhythm of the home.",
  "materialsList": ["An array of exactly 4 specialized premium construction or cladding materials recommended for this design"],
  "estimatedCostRange": "A realistic high-end estimated cost range formatted with commas (e.g., '$750,000 - $900,000')",
  "constructionTimeline": "Estimated construction timeline (e.g., '12 - 14 Months')",
  "structuralFeatures": ["An array of exactly 3 cutting-edge architectural or energy features relevant to this spec (e.g., carbon-sequestering CLT frame, integrated sun tunnels, active water-recirculation wall)"],
  "designTips": ["An array of exactly 3 high-value design suggestions for maximizing natural light, interior volume, or material texture harmony"]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            styleDescription: { type: Type.STRING },
            materialsList: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedCostRange: { type: Type.STRING },
            constructionTimeline: { type: Type.STRING },
            structuralFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            designTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            "title",
            "styleDescription",
            "materialsList",
            "estimatedCostRange",
            "constructionTimeline",
            "structuralFeatures",
            "designTips"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response text from Gemini service.");
    }

    const result = JSON.parse(text.trim());
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Design Generation Error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate custom architectural proposal."
    });
  }
});

// ================= VITE OR STATIC SERVING =================

async function startServer() {
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
