const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config(); // Load .env variables

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
    // Optionally throw an error to prevent startup without the key
    throw new Error("GEMINI_API_KEY environment variable is not set.");
    // Or process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);


const generationConfig = {
    temperature: 0.9, // Adjust creativity/determinism (0.0 - 1.0)
    topK: 1,
    topP: 1,
    maxOutputTokens: 8192, // Adjust based on expected output size & model limits
};

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

    const systemInstruction = `
    when I send you stock name ,category and location , generate  the details of stores in that location which sells those stock items according to following json format                                                                {
        "searchQuery": {
          "stockName": "Nvidia RTX 4090", // Echoed from user input
          "category": "Electronics",      // Echoed from user input
          "location": "San Francisco, CA" // Echoed from user input
        },
        "searchTimestamp": "2023-10-27T10:30:00Z", // ISO 8601 timestamp of the search execution
        "searchStatus": "success", // Possible values: "success", "no_results", "error", "partial_success"
        "errorMessage": null, // Relevant message if searchStatus is "error"
        "results": [
          // Array of stores found matching the criteria
          {
            "storeId": "STORE123", // Optional: Unique identifier for the store
            "storeName": "Best Buy - Downtown SF",
            "address": {
              "street": "123 Market St",
              "city": "San Francisco",
              "state": "CA",
              "postalCode": "94103",
              "country": "USA",
              "coordinates": { // Optional: For map integration
                "latitude": 37.7749,
                "longitude": -122.4194
              }
            },
            "contact": {
              "phone": "+1-415-555-1212",
              "website": "https://www.bestbuy.com/store/ca-san-francisco-123" // Link to the specific store page
            },
            "distance": { // Optional: If user location is precise enough to calculate
              "value": 1.5,
              "unit": "miles" // or "km"
            },
            "openingHours": "Mon-Sat: 10am-9pm, Sun: 11am-7pm", // Can be more structured if needed
            "stockInfo": {
              "availability": "Check Availability", // Key field indicating likelihood. Values: "Likely In Stock", "Limited Stock", "Check Availability", "Call Store", "Out of Stock", "Unknown", "Not Sold Here"
              "price": { // Optional: Price if available
                "amount": 1599.99,
                "currency": "USD"
              },
              "productUrl": "https://www.bestbuy.com/site/nvidia-geforce-rtx-4090-24gb-gddr6x-graphics-card-titanium-and-black/6521430.p?skuId=6521430", // Direct link to the *product* on *this store's* website (or the main site filtered for the store if possible)
              "lastChecked": "2023-10-27T08:15:00Z", // Optional: Timestamp of when this *specific* stock info was last potentially updated (can be approximate)
              "notes": "High demand item. Online reservation recommended." // Any extra useful info
            }
          },
          {
            "storeId": "STORE456",
            "storeName": "Central Computer",
            "address": {
              "street": "456 Folsom St",
              "city": "San Francisco",
              "state": "CA",
              "postalCode": "94105",
              "country": "USA",
              "coordinates": {
                "latitude": 37.7880,
                "longitude": -122.3998
              }
            },
            "contact": {
              "phone": "+1-415-555-8888",
              "website": "https://www.centralcomputer.com/sf-store"
            },
            "distance": {
              "value": 2.1,
              "unit": "miles"
            },
            "openingHours": "Mon-Fri: 9am-6pm, Sat: 10am-5pm, Sun: Closed",
            "stockInfo": {
              "availability": "Call Store", // Suggests calling is the best way to confirm
              "price": null, // Price might not be readily available online
              "productUrl": "https://www.centralcomputer.com/nvidia-rtx-4090-search-results", // Link might be to a search results page if specific product page isn't guaranteed
              "lastChecked": null,
              "notes": "Specialty store, may have stock when others don't."
            }
          },
          {
            "storeId": "STORE789",
            "storeName": "Target - Metreon",
             "address": {
              "street": "789 Mission St",
              "city": "San Francisco",
              "state": "CA",
              "postalCode": "94103",
              "country": "USA",
              "coordinates": {
                "latitude": 37.7830,
                "longitude": -122.4040
              }
            },
             "contact": {
              "phone": "+1-415-555-0000",
              "website": "https://www.target.com/sl/san-francisco-metreon/1234"
            },
             "distance": {
              "value": 1.8,
              "unit": "miles"
            },
            "openingHours": "Mon-Sun: 8am-10pm",
            "stockInfo": {
              "availability": "Not Sold Here", // Explicitly state if the store doesn't typically carry this item/category
              "price": null,
              "productUrl": null,
              "lastChecked": null,
              "notes": "This store primarily focuses on other categories."
            }
          }
          // ... more stores if found
        ]
    }`

    const chat = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest", // Or your preferred model
        generationConfig,
        safetySettings,
        systemInstruction: systemInstruction,
    });

    module.exports = chat;