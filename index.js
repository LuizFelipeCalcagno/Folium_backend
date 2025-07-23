import express from "express";
import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// 🟢 Configura o CORS antes das rotas
app.use(cors({
  origin: "https://splendid-sfogliatella-b8ee2d.netlify.app", // ✅ Seu domínio do Netlify
  methods: ["GET", "POST"],
  credentials: true
}));

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);



// Supabase config
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);