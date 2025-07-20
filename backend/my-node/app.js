import express from 'express';
import dotenv from 'dotenv';
import connectDB from './connect/Mongoose.js'; 
import cors from 'cors';
import articleRoutes from "./routes/article.js";
import ownerRoutes from "./routes/Owner.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Owner from './models/Owner.js';
import { createOwner } from './controllers/Owner.js';


dotenv.config();

const app = express();
// app.use(cors());  

// app.use(cors({
//   origin: "http://localhost:5173",  // your React frontend URL
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],  // ✅ Very important
// }));

app.use(cors({
  origin: "http://localhost:5173",  // React frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],  // ✅ This is essential
  credentials: true,  // Optional: if you're using cookies (not needed for token-based auth)
}));


app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
connectDB();

// // Function to create default owner
// const createDefaultOwner = async () => {
//   try {
//     const existingOwner = await Owner.findOne();
//     if (existingOwner) {
//       console.log("Owner already exists.");
//       return;
//     }

//     const newOwner = new Owner({
//       name: "Narpat Choudhary",
//       phone: "9216519195",
//       email: "officialnarpatchoudhary0001@gmail.com",
//       password: "Narpat@#7297fit"
//     });

//     await newOwner.save();
//     console.log("Default Owner added.");
//   } catch (err) {
//     console.error("Error adding Owner:", err);
//   }
// };

// // connect DB and create default owner
// connectDB().then(createDefaultOwner);


// Default route
app.get('/', (req, res) => {
  res.send("Hello from Express!");
});

// ✅ Static serve uploads folder
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// articleRoutes
app.use("/articles", articleRoutes);

// ownerroutes
app.use("/api/owner", ownerRoutes);
// app.use("/owner/health/fitness/with/choudhary/fitness/profile/user", ownerRoutes);

app.get("/debug/owners", async (req, res) => {
  const owners = await Owner.find();
  res.json(owners);
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
