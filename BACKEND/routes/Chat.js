const router = require("express").Router();
//let User = require("../models/User");
const chat = require("../models/chat.js");

router.post("/api/find-stores", async (req, res) => {
    console.log("Received request body:", req.body); // Log incoming data

    // 1. Extract data from request body
    const { stockName, category, location } = req.body;

    // 2. Basic Input Validation
    if (!stockName || !category || !location) {
        return res.status(400).json({
             message: "Missing required fields: stockName, category, and location are required."
        });
    }

    try {
        // 3. Construct the prompt for the AI
        const userPrompt = `Find stores selling "${stockName}" (category: ${category}) in ${location}.`;
        console.log("Sending prompt to Gemini:", userPrompt);


        // 4. Call the Gemini API
        const result = await chat.generateContent(userPrompt);
        const response = result.response; // Access the response object
        const aiTextResponse = response.text(); // Get the text part of the response

        console.log("Raw AI Response Text:", aiTextResponse);

        // 5. Parse the AI's text response (which should be JSON)
        let jsonData;
        try {
            const jsonMatch = aiTextResponse.match(/\{[\s\S]*\}|\[[\s\S]*\]/);

            if (!jsonMatch) {
                // Throw an error if no JSON structure ({...} or [...]) is found at all
                throw new Error("Could not find valid JSON structure in AI response.");
            }

            // 2. Get the extracted JSON string
            const extractedJsonString = jsonMatch[0];

            // 3. Parse the extracted string
            console.log("Attempting to parse extracted JSON:", extractedJsonString); // Log what's being parsed
            jsonData = JSON.parse(extractedJsonString);

            // Ensure accurate timestamp
            jsonData.searchTimestamp = new Date().toISOString();

            console.log("Successfully parsed extracted JSON.");
             //const cleanJsonString = aiTextResponse
                //.replace(/^```json\s*/, '') 
                //.replace(/```$/, '');      
             //jsonData = JSON.parse(cleanJsonString);

        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", parseError);
            console.error("AI Raw Text was:", aiTextResponse); // Log the text that failed parsing
            // Attempt to send a structured error based on the expected format
             return res.status(500).json({
                searchQuery: { stockName, category, location },
                searchTimestamp: new Date().toISOString(),
                searchStatus: "error",
                errorMessage: "AI response was not valid JSON. Check server logs.",
                results: []
             });
        }

        // 6. Send the parsed JSON back to the frontend
        console.log("Sending JSON response to client:", jsonData);
        res.status(200).json(jsonData);

    } catch (error) {
        console.error("Error calling Gemini API or processing request:", error);
        // Attempt to send a structured error based on the expected format
        res.status(500).json({
            searchQuery: { stockName, category, location }, // Echo input even on error
            searchTimestamp: new Date().toISOString(),
            searchStatus: "error",
            errorMessage: error.message || "An internal server error occurred while contacting the AI service.",
            results: []
        });
    }
});


module.exports = router;