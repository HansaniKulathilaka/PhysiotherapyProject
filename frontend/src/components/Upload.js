import React, { useState } from "react";
import Nav from './Nav';
import Update from './Update';
import Search from './Search';
import Print from './Print';
import Login from './Login';
import Reports from "./Reports";
import Register from "./Register";
import Email from './Email'; 
//import { GoogleGenAI } from "@google/generative-ai";



function Upload(){
    const [stockName, setStockName] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");

    // State for API interaction
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Backend Interaction Logic ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setResults(null);

        const backendApiUrl = "http://localhost:8080/chat/api/find-stores";

        try {
            const response = await fetch(backendApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    stockName: stockName,
                    category: category,
                    location: location,
                }),
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! Status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (parseError) {
                    // Ignore if response body isn't valid JSON
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setResults(data);

        } catch (err) {
            console.error("API Call failed:", err);
            setError(err.message || "Failed to fetch data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Styles
    const containerStyle = {
        //maxWidth: '800px',
        //margin: '0 auto',
        //padding: '20px',
        //fontFamily: 'Arial, sans-serif'
        backgroundImage: "url('https://www.hudalighting.com/wp-content/uploads/2020/06/hilton-hotel-ksa-huda-lighting-03.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
        margin: "0",
        padding: "0",
        minHeight: "100vh",
        paddingTop: "80px", // Add padding to account for Nav bar
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    };

    const formStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: '20%',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
    };

    const inputGroupStyle = {
        marginBottom: '15px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#333'
    };

    const inputStyle = {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px'
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        width: '100%'
    };

    const resultsContainerStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: "70%",
        padding: '20px',
        margin: "20px",
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const storeCardStyle = {
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: 'white'
    };

    return (
        <div>
        <Nav/>
        <div style={containerStyle}>
            <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Find Store Stock</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={inputGroupStyle}>
                    <label htmlFor="stockNameInput" style={labelStyle}>Stock Name:</label>
                    <input
                        type="text"
                        id="stockNameInput"
                        name="Name"
                        value={stockName}
                        onChange={(e) => setStockName(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="categoryInput" style={labelStyle}>Category:</label>
                    <input
                        type="text"
                        id="categoryInput"
                        name="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="locationInput" style={labelStyle}>Location:</label>
                    <input
                        type="text"
                        id="locationInput"
                        name="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading} style={buttonStyle}>
                    {isLoading ? "Searching..." : "Search"}
                </button>
            </form>

            {isLoading && <p style={{textAlign: 'center'}}>Loading results...</p>}
            {error && <p style={{color: 'red', textAlign: 'center'}}>Error: {error}</p>}

            {results && !isLoading && !error && ( // Added !isLoading and !error check here too for safety
                <div style={resultsContainerStyle}>
                    {/* Optional: Display Search Query Summary */}
                    {results.searchQuery && (
                       <p style={{ fontSize:'0.9em', color:'#555', marginBottom: '15px'}}>
                           Showing results for "{results.searchQuery.stockName}"...
                       </p>
                   )}

                    {/* Optional but Recommended: Display ErrorMessage if present */}
                   {results.errorMessage && (
                       <p style={{ color: '#8B4513', /* Brownish color for warning */ fontWeight: 'bold', marginBottom: '15px', border: '1px solid #DEB887', /* Burlywood border */ padding: '10px', borderRadius: '4px', backgroundColor: '#FFF8DC' /* Cornsilk background */ }}>
                           Note: {results.errorMessage}
                       </p>
                   )}

                   <h3 style={{marginBottom: '15px'}}>Results:</h3>

                   {/* --- CORE LOGIC CHANGE IS HERE --- */}
                   {(results.searchStatus === 'success' || results.searchStatus === 'partial_success') && results.results && results.results.length > 0 ? (
                        <div>
                            {results.results.map((store, index) => (
                                <div key={store.storeId || index} style={storeCardStyle}>
                                    {/* Store Name */}
                                    <h3 style={{margin: '0 0 10px 0', color: '#333'}}>{store.storeName || 'Store Name N/A'}</h3>

                                    {/* Address - Safer Access */}
                                    {store.address && (
                                        <p style={{color: '#666', margin: '5px 0'}}>
                                            {store.address.street ? `${store.address.street}, ` : ''}
                                            {store.address.city ? `${store.address.city}, ` : ''}
                                            {store.address.zipCode || ''}
                                        </p>
                                     )}

                                    {/* Info Flex Container */}
                                    <div style={{display: 'flex', gap: '20px', marginTop: '10px'}}>
                                        {/* Quantity - Safer Access */}
                                        {store.stockInfo && (
                                            <div>
                                                <span style={{display: 'block', color: '#666', fontSize: '14px'}}>Quantity</span>
                                                <span style={{fontWeight: 'bold'}}>{store.stockInfo?.quantity ?? '-'}</span>
                                            </div>
                                        )}

                                        {/* CORRECTED Price Display */}
                                        {store.stockInfo?.price?.amount != null ? (
                                             <div>
                                                 <span style={{ display: 'block', color: '#666', fontSize: '14px' }}>Price</span>
                                                 <span style={{ fontWeight: 'bold' }}>
                                                     {store.stockInfo.price.currency} {store.stockInfo.price.amount.toLocaleString()}
                                                 </span>
                                             </div>
                                        ) : store.stockInfo?.price === null ? (
                                            <div>
                                                <span style={{ display: 'block', color: '#666', fontSize: '14px' }}>Price</span>
                                                <span style={{ fontWeight: 'bold' }}>Not Specified</span>
                                            </div>
                                        ) : null}
                                    </div>
                                    {store.contact && ( // Check if distance is not null
                                        <p style={{color: '#666', margin: '5px 0'}}>
                                        {store.contact.phone ? `${store.contact.phone}, ` : ''}
                                        <br></br>
                                        {store.contact.website ? `${store.contact.website}, ` : ''}
                                       
                                    </p>
                                    
                                    )}
                                    {/* Distance - Safer Display */}
                                    {store.distance != null && ( // Check if distance is not null
                                        <div style={{marginTop: '10px', color: '#666', fontSize: '14px'}}>
                                            {/* Ideally, distance would be an object { value: 1.5, unit: 'miles' } */}
                                            {/* Assuming it's just a number for now */}
                                            Distance: {store.distance} {/* Avoid hardcoding units unless certain */}
                                        </div>
                                    )}
                                </div> // End Store Card
                            ))}
                        </div>
                    ) : results.searchStatus === 'no_results' ? ( // Explicitly handle no_results
                        <p style={{textAlign: 'center', color: '#666'}}>No stores found matching your criteria.</p>
                    ) : ( // Handle other cases (e.g., error status from backend, or unexpected status)
                        <p style={{textAlign: 'center', color: '#888'}}>Could not display results. Status: {results.searchStatus || 'Unknown'}</p>
                    )}
                     {/* --- END OF CORE LOGIC CHANGE --- */}
                </div>
            )}
            {/*{results && (
                <div style={resultsContainerStyle}>
                    <h3 style={{marginBottom: '15px'}}>Results:</h3>
                    {results.searchStatus === 'success' && results.results && results.results.length > 0 ? (
                        <div>
                            {results.results.map((store, index) => (
                                <div key={store.storeId || index} style={storeCardStyle}>
                                    <h3 style={{margin: '0 0 10px 0', color: '#333'}}>{store.storeName || 'Store Name N/A'}</h3>
                                    {store.address?.street && (
                                        <p style={{color: '#666', margin: '5px 0'}}>
                                            {store.address.street}, {store.address.city}, {store.address.zipCode}
                                        </p>
                                    )}
                                    <div style={{display: 'flex', gap: '20px', marginTop: '10px'}}>
                                        <div>
                                            <span style={{display: 'block', color: '#666', fontSize: '14px'}}>Quantity</span>
                                            <span style={{fontWeight: 'bold'}}>{store.stockInfo.quantity ?? 'N/A'}</span>
                                        </div>
                                        {store.stockInfo?.price?.amount != null ? (
                                    <div>
                                     <span style={{ display: 'block', color: '#666', fontSize: '14px' }}>Price</span>
                                        <span style={{ fontWeight: 'bold' }}>
                                             {store.stockInfo.price.currency} {store.stockInfo.price.amount.toLocaleString()}
                                        </span>
                                     </div>
                                     ) : store.stockInfo?.price === null ? ( // Handle explicit null price
                                         <div>
                                         <span style={{ display: 'block', color: '#666', fontSize: '14px' }}>Price</span>
                                             <span style={{ fontWeight: 'bold' }}>Not Specified</span>
                                            </div>
                                            ): null
                                       /*{store.stockInfo.price && (
                                            <div>
                                                <span style={{display: 'block', color: '#666', fontSize: '14px'}}>Price</span>
                                                <span style={{fontWeight: 'bold'}}>${store.stockInfo.price}</span>
                                            </div>
                                        )}*/}



                                    {/*</div>
                                    {store.distance && (
                                        <div style={{marginTop: '10px', color: '#666', fontSize: '14px'}}>
                                            {store.distance} miles away
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{textAlign: 'center', color: '#666'}}>No stores found matching your criteria.</p>
                    )}
                </div>*/}




           {/* )}*/}
        </div>
        </div>
    );
    
}

export default Upload