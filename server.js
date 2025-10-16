//Simple ExpressJS server built for retrieving one random cat fact at a time

import express from "express";
import axios from "axios";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const CATFACT_URL = process.env.CATFACT_URL || "https://catfact.ninja/fact";
const CATFACT_TIMEOUT_MS = process.env.CATFACT_TIMEOUT_MS
  ? Number(process.env.CATFACT_TIMEOUT_MS)
  : 5000;

//Middleware
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 60,
});
app.use(limiter);

// Helper for getting user variables
function getUser() {
  return {
    name: process.env.USER_NAME || "Esih Egwurube",
    email: process.env.USER_EMAIL || "desmondesih@gmail.com",
    stack: process.env.USER_STACK || "NodeJS/Express",
  };
}

app.get("/me", async (req, res) => {
  res.setHeader("Cache-Control", "no-store, must-revalidate");

  try {
    const apiResp = await axios.get(CATFACT_URL, {
      timeout: CATFACT_TIMEOUT_MS,
    });

    const fact = apiResp?.data?.fact;
    if (!fact || typeof fact !== "string") {
      throw new Error("Invalid response from Cat Facts API");
    }

    const payload = {
      status: "success",
      user: getUser(),
      timestamp: new Date().toISOString(),
      fact,
    };

    res.status(200).json(payload);
  } catch (err) {
    console.error("Cat Facts API error:", err?.message || err);

    const fallbackFact =
      process.env.FALLBACK_CAT_FACT ||
      "Cat fact currently unavailable. Please try again later.";

    const payload = {
      status: "failure",
      user: getUser(),
      timestamp: new Date().toISOString(),
      fact: fallbackFact,
      error: "Upstream cat facts provider error",
    };

    res.status(502).json(payload);
  }
});

app.listen(PORT, () => {
  console.log(`Random Cat Fact app listening on port ${PORT}`);
});
