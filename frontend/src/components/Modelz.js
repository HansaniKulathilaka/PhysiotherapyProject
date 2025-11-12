
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from './Nav';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";

import Questions from "./Questions";
export default function Modelz() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedParts, setSelectedParts] = useState([]);
  const [painType, setPainType] = useState("single");  
  const [severity, setSeverity] = useState(0);
  const navigate = useNavigate();
  const [showQuestions, setShowQuestions] = useState(false);

  const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100vh",
};

  const handleNext = () => {
    /*if (selectedPart) {
      navigate(`/questions/${selectedPart}` , {
      state: { selectedPart, severity } 
    });
      
    } else {
      alert("Please select a body part first!");
    }*/
    if (painType === "single") {
    if (!selectedPart) {
      alert("Please select a body part!");
      return;
    }
   /* navigate(`/questions/${selectedPart}`, {
      state: { painType: "single", selectedPart, severity }
    });*/
  } 
  else if (painType === "multiple") {
    if (!selectedParts || selectedParts.length === 0) {
      alert("Please select at least one body part!");
      return;
    }
   /* navigate(`/questions/${selectedParts.join(",")}`, {
      state: { painType: "multiple", selectedParts, severity }
    });*/
  } 
  else {
    alert("Please select a pain type first!");
  }
  setShowQuestions(true);
  };


   if (showQuestions) {
    return (
      <Questions
        selectedPart={selectedPart}
        selectedParts={selectedParts}
        painType={painType}
        severity={severity}
      />
    );
  }
  return (
    <div>
      {/*<Nav/>*/}
    <div style={containerStyle}>
      <div
        style={{
          width: "500px",
          height: "100vh",
          background: "#b9ddeeff",
          padding: "20px",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
      {/*}  <h2>Navigation</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><a href="/home">🏠 Home</a></li>
          <li><a href="/instructions">📖 Instructions</a></li>
          <li><a href="/questions">❓ Questions</a></li>
        </ul>*/}
     <br></br><br></br><br></br>
      <h3><b>Instructions</b></h3><br></br>
        <ol>
        <li> Answer the given questions according to the pain</li><br></br>
       {/*} <li> Drag to rotate the model.</li><br></br>
        <li> Scroll to zoom.</li>*/}
        </ol>

        <div>
          <br></br>
 {/* <h3>Select Pain Type:</h3>*/}
  <br></br>
 {/*<label>
    <input
      type="radio"
      value="single"
      checked={painType === "single"}
      onChange={(e) => {
  const newType = e.target.value;
  setPainType(newType);

  
  if (newType === "single") {
    setSelectedParts([]); 
  } else {
    setSelectedPart(null); 
  }
}} 
    />
    Localized Pain
  </label>*/}
  <br />
  {/*<label>
    <input
      type="radio"
      value="multiple"
      checked={painType === "multiple"}
      onChange={(e) => {
  const newType = e.target.value;
  setPainType(newType);

  // Clear highlights when switching pain type
  if (newType === "single") {
    setSelectedParts([]); // clear multiple selection
  } else {
    setSelectedPart(null); // clear single selection
  }
}} 
    />
    Radiating Pain
  </label>*/}
</div>

        {/*} {selectedPart && (
            <div style={{ marginTop: "20px", fontWeight: "bold" }}>
              Selected: {selectedPart}

            </div>
          )}

           {((painType === "single" && selectedPart) || (painType === "multiple" && selectedParts.length > 0)) &&(
            <div style={{ marginTop: "20px" }}>
              <label htmlFor="severity"><b>Pain Severity:</b></label>
              <input
                type="range"
                id="severity"
                min="0"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                style={{ width: "100%", marginTop: "10px" }}
              />
              <progress value={severity} max="10" style={{ width: "100%" }}></progress>
              <div>Level: {severity}/10</div>
            </div>
          )}
            */}

         {/* <button
            onClick={handleNext}
            disabled={
               (painType === "single" && !selectedPart) ||
    (painType === "multiple" && (!selectedParts || selectedParts.length === 0))
              }
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: selectedPart ? "blue" : "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: selectedPart ? "pointer" : "not-allowed",
            }}
          >
            Next →
          </button>

          */}
      </div>
    

       

    
    </div>
    </div>
  );
}