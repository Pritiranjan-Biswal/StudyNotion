const express = require("express");
const app = express();

// Import routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

// Import database
const database = require("./config/database");

// Import middleware/packages
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// Import Cloudinary
const { cloudinaryConnect } = require("./config/cloudinary");

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

// ================= DATABASE CONNECTION =================

database.connect();

// ================= MIDDLEWARE =================

// Parse JSON request body
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Enable CORS
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// Handle file uploads
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

// ================= CLOUDINARY =================

cloudinaryConnect();

// ================= ROUTES =================

app.use("/api/v1/auth", userRoutes);

app.use("/api/v1/profile", profileRoutes);

app.use("/api/v1/course", courseRoutes);

app.use("/api/v1/payment", paymentRoutes);

app.use("/api/v1/reach", contactUsRoute);

// ================= DEFAULT ROUTE =================

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running....",
    });
});

// ================= START SERVER =================

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});