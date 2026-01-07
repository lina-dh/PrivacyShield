import express from "express"; // Import the Express engine
// Import the "recipe" we created in the controller
import { analyzeLink } from "../controllers/analyzeController.js";

const router = express.Router(); // Create a new router (extension line)

// Define the address: POST http://localhost:5000/api/analyze-model
// We connect the address to the controller function
router.post("/link-scanner/analyze", analyzeLink);

export default router; // Export the router to the main server file
