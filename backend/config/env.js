import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env
const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

// Log which env vars are loaded
console.log("📝 Environment Configuration:");
console.log("  GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✓ Loaded" : "✗ Missing");
console.log("  GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✓ Loaded" : "✗ Missing");
console.log("  MONGO_URI:", process.env.MONGO_URI ? "✓ Loaded" : "✗ Missing");
console.log("  JWT_SECRET:", process.env.JWT_SECRET ? "✓ Loaded" : "✗ Missing");
