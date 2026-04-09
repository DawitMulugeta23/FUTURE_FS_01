const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dnjwdbxxt",
  api_key: process.env.CLOUDINARY_API_KEY || "566278348486541",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "8jALQ7CNAySDMw6kFr9D2Hsp7SA",
});

// Email Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "dawitmulugetas23@gmail.com",
    pass: process.env.SMTP_PASS || "",
  },
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image and PDF files are allowed"));
    }
  },
});

// CORS middleware - Configured for production
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://dawitmulugeta23.github.io",
    "http://localhost:5173",
    "http://localhost:3000",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "eyu-love";

// MongoDB Connection with retry logic
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";

const connectWithRetry = async () => {
  const options = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    retryWrites: true,
    retryReads: true,
  };

  try {
    await mongoose.connect(MONGODB_URI, options);
    console.log("✅ MongoDB Connected successfully");

    // Only after connection succeeds, run seed and data initialization
    await seedData();
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.log("⚠️ Retrying in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

// Connection event listeners
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// ==================== SCHEMAS ====================

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tech: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, required: true },
  desc: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Project = mongoose.model("Project", projectSchema);

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    default: "Intermediate",
  },
  category: { type: String, default: "Frontend" },
  createdAt: { type: Date, default: Date.now },
});
const Skill = mongoose.model("Skill", skillSchema);

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  img: { type: String, required: true },
  link: { type: String, default: "#" },
  completed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
const Certificate = mongoose.model("Certificate", certificateSchema);

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});
const Setting = mongoose.model("Setting", settingSchema);

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", contactSchema);

// ==================== MIDDLEWARE ====================

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

// ==================== IMAGE UPLOAD ROUTE ====================

app.post(
  "/api/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const base64Image = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "portfolio",
        transformation: [{ quality: "auto" }],
      });

      res.json({
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  },
);

app.delete("/api/upload/:publicId", authMiddleware, async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// ==================== CONTACT ROUTES ====================

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const newMessage = new Contact({ name, email, subject, message });
    await newMessage.save();

    try {
      if (process.env.SMTP_PASS) {
        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
          to: process.env.EMAIL_FROM || "dawitmulugetas23@gmail.com",
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Message From Your Portfolio Viewer</h2>
              <div style="margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 10px;">
                  <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
              </div>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #6b7280;">
                <p>This message was sent from your portfolio website contact form.</p>
                <p>Sent at: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `,
          text: `New Message From Your Portfolio Viewer\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
        });
        console.log(`📧 Email sent to ${process.env.EMAIL_FROM} from ${email}`);
      }
    } catch (emailError) {
      console.error("Email sending error (non-critical):", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully! I will get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res
      .status(500)
      .json({ error: "Failed to send message. Please try again." });
  }
});

app.get("/api/contact/messages", authMiddleware, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/contact/messages/:id/read", authMiddleware, async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/contact/messages/:id", authMiddleware, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PROJECT ROUTES ====================

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SKILL ROUTES ====================

app.get("/api/skills", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/skills", authMiddleware, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/skills/:id", authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!skill) return res.status(404).json({ error: "Skill not found" });
    res.json(skill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/skills/:id", authMiddleware, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CERTIFICATE ROUTES ====================

app.get("/api/certificates", async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/certificates", authMiddleware, async (req, res) => {
  try {
    const certificate = new Certificate(req.body);
    await certificate.save();
    res.status(201).json(certificate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/certificates/:id", authMiddleware, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!certificate)
      return res.status(404).json({ error: "Certificate not found" });
    res.json(certificate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/certificates/:id", authMiddleware, async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SETTINGS ROUTES ====================

app.get("/api/settings/work-status", async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: "workStatus" });
    if (!setting) {
      setting = await Setting.create({ key: "workStatus", value: true });
    }
    res.json({ workStatus: setting.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/settings/work-status", authMiddleware, async (req, res) => {
  try {
    const { workStatus } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: "workStatus" },
      { key: "workStatus", value: workStatus, updatedAt: Date.now() },
      { upsert: true, new: true },
    );
    res.json({ workStatus: setting.value });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/settings/cv", async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: "cvUrl" });
    if (!setting) {
      setting = await Setting.create({
        key: "cvUrl",
        value: "/assets/Dawitm.png",
      });
    }
    res.json({ cvUrl: setting.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/settings/cv", authMiddleware, async (req, res) => {
  try {
    const { cvUrl } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: "cvUrl" },
      { key: "cvUrl", value: cvUrl, updatedAt: Date.now() },
      { upsert: true, new: true },
    );
    res.json({ cvUrl: setting.value });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/settings/profile-image", async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: "profileImage" });
    if (!setting) {
      setting = await Setting.create({
        key: "profileImage",
        value: "/assets/profile.png",
      });
    }
    res.json({ profileImage: setting.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/settings/profile-image", authMiddleware, async (req, res) => {
  try {
    const { profileImage } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: "profileImage" },
      { key: "profileImage", value: profileImage, updatedAt: Date.now() },
      { upsert: true, new: true },
    );
    res.json({ profileImage: setting.value });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== ADMIN PATH ROUTE ====================

// Get admin path (default: 'love')
app.get("/api/settings/admin-path", async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: "adminPath" });
    if (!setting) {
      setting = await Setting.create({ key: "adminPath", value: "love" });
    }
    res.json({ adminPath: setting.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update admin path (protected - requires auth)
app.put("/api/settings/admin-path", authMiddleware, async (req, res) => {
  try {
    const { adminPath } = req.body;

    // Validate: only letters, numbers, and hyphens
    if (!/^[a-zA-Z0-9-]+$/.test(adminPath)) {
      return res.status(400).json({
        error: "Admin path can only contain letters, numbers, and hyphens",
      });
    }

    const setting = await Setting.findOneAndUpdate(
      { key: "adminPath" },
      { key: "adminPath", value: adminPath, updatedAt: Date.now() },
      { upsert: true, new: true },
    );
    res.json({ adminPath: setting.value });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== TEST ROUTE ====================

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() });
});

// ==================== SEED DATA ====================

const seedData = async () => {
  try {
    // Initialize admin path if not exists
    let adminPathSetting = await Setting.findOne({ key: "adminPath" });
    if (!adminPathSetting) {
      await Setting.create({ key: "adminPath", value: "love" });
      console.log("✅ Admin path initialized to: love");
    }

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: "Ecommerce Web App",
          tech: "MongoDB, Express, React, Nodejs, Cloudinary",
          link: "https://github.com/DawitMulugeta23/Ecommerce-web-app",
          image:
            "https://res.cloudinary.com/dnjwdbxxt/image/upload/v1/portfolio/ecommerce",
          desc: "A full-stack MERN platform featuring secure MongoDB integration, product management, and user authentication using jwt.",
        },
        {
          title: "Tkinter Python Project",
          tech: "Python, Tkinter (GUI)",
          link: "https://github.com/DawitMulugeta23/tkinter-python-project/blob/main/project.py",
          image:
            "https://res.cloudinary.com/dnjwdbxxt/image/upload/v1/portfolio/hrms",
          desc: "A desktop application developed using Python's Tkinter library.",
        },
        {
          title: "Video Post App",
          tech: "MERN Stack, Cloudinary",
          link: "https://github.com/DawitMulugeta23/video-Post-app-using-mern-stake",
          image:
            "https://res.cloudinary.com/dnjwdbxxt/image/upload/v1/portfolio/videopost",
          desc: "A social media style application for sharing and interacting with video content.",
        },
        {
          title: "Online Exam System",
          tech: "Java, MySQL",
          link: "https://github.com/DawitMulugeta23/Exam-System",
          image:
            "https://res.cloudinary.com/dnjwdbxxt/image/upload/v1/portfolio/exam",
          desc: "A secure system for conducting and managing academic examinations online.",
        },
      ]);
      console.log("✅ Projects seeded");
    }

    const certCount = await Certificate.countDocuments();
    if (certCount === 0) {
      await Certificate.insertMany([
        {
          title: "Fundamental Programming",
          provider: "Udacity",
          img: "https://res.cloudinary.com/dnjwdbxxt/image/upload/v1/portfolio/funprog",
          link: "https://www.udacity.com/certificate/e/d3724a90-9980-11f0-bb18-b7b34be26e27",
        },
        {
          title: "AI Certificate",
          provider: "Udacity",
          img: "https://res.cloudinary.com/dnjwdbxxt/image/upload/v1/portfolio/aicetify",
          link: "https://www.udacity.com/certificate/e/2b779ede-989b-11f0-b7f0-d3e369c6c483",
        },
      ]);
      console.log("✅ Certificates seeded");
    }

    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany([
        { name: "React.js", level: "Advanced", category: "Frontend" },
        { name: "Node.js", level: "Intermediate", category: "Backend" },
        { name: "Express.js", level: "Intermediate", category: "Backend" },
        { name: "MongoDB", level: "Intermediate", category: "Database" },
        { name: "JavaScript", level: "Advanced", category: "Frontend" },
        { name: "Python", level: "Intermediate", category: "Backend" },
      ]);
      console.log("✅ Skills seeded");
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

// Start the connection process
connectWithRetry();

// CRITICAL: Bind to '0.0.0.0' for Render deployment
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 API test: http://localhost:${PORT}/api/test`);
  console.log(`📍 MongoDB: Using Atlas`);
  console.log(`\n📊 Available endpoints:`);
  console.log(`   GET  /api/projects`);
  console.log(`   GET  /api/skills`);
  console.log(`   GET  /api/certificates`);
  console.log(`   GET  /api/settings/work-status`);
  console.log(`   GET  /api/settings/admin-path`);
  console.log(`   PUT  /api/settings/admin-path (protected)`);
  console.log(`   POST /api/contact`);
  console.log(`\n🔐 Admin access:`);
  console.log(`   Default admin path: love`);
  console.log(`   Update path via Admin Panel settings`);
  console.log(`\n`);
});
