import { useState, useRef ,useEffect } from "react";
//import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; 
import Nav from "./Nav";


export default function PreviewPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const cardRef = useRef();

   const [inputs,setInputs] = useState(state?.answers ||{
          Question:[],
          Q1: "",
          Date: "",
          Image1: "",
          Image2: "",
          Severity: ""
  
      });
  if (!state) return <p>No preview data available.</p>;

  const { painType, selectedPart, selectedParts, severity, answers } = state;

  //const history = useNavigate();
  localStorage.setItem(
  "editState",
  JSON.stringify({ painType, selectedPart, selectedParts, severity, answers: inputs })
);
     
  

  const handleEdit = () => navigate(-1/*"/Questions"*/, { state: {
      painType,
      selectedPart,
      selectedParts,
      severity,
      answers: inputs   // Pass the current inputs
    }}/*{ state: { answers: inputs } }*/);
  const handleConfirm = (e) => {
   /*const handleSubmit =(e) =>{*/
      
        e.preventDefault();
        console.log(inputs);
       
        sendRequest().then(() => navigate('/MediData'));
    /*}*/

    /*console.log("Final Data Submitted:", state);
    alert("Pain report submitted successfully!");
    navigate("/thank-you");*/
  };

    const sendRequest = async () => {
  try {
    if (painType === "single") {
      if (!selectedPart) return;

      const realQuestions = questions.filter(q => !q.includes("No questions"));
     /* if (realQuestions.length === 0) {
        alert("No questions available for this body part. Cannot save.");
        return;
      }*/

      await axios.post("http://localhost:8080/mediData/add", {
        Question: inputs.Question,
        Q1: inputs.Q1,
        Date: inputs.Date ? new Date(inputs.Date) : null,
        Image1: { label: inputs.Image1 },
        Image2: { label: inputs.Image2 },
        Severity: Number(inputs.Severity) || 0,
        BodyPart: selectedPart
      }, { withCredentials: true, headers: { "Content-Type": "application/json" } });

    } else if (painType === "multiple") {
      await Promise.all(selectedParts.map(part => {
        const questionsForPart = questions
          .filter(q => q.startsWith(`${part}:`) && !q.includes("No questions"))
          .map(q => q.replace(`${part}: `, ""));
        if (!questionsForPart.length) return; // skip parts with no real questions

        return axios.post("http://localhost:8080/mediData/add", {
          Question: inputs.Question,
          Q1: inputs.Q1,
          Date: inputs.Date ? new Date(inputs.Date) : null,
          Image1: { label: inputs.Image1 },
          Image2: { label: inputs.Image2 },
          Severity: Number(inputs.Severity) || 0,
          BodyPart: selectedParts
        }, { withCredentials: true, headers: { "Content-Type": "application/json" } });
      }));
    }

  } 
  catch (error) {
  console.error(error);
  if (error.response) {
    console.error(error.response.data);
    alert("Failed to add data: " + JSON.stringify(error.response.data));
  } else {
    alert("Failed to add data. Please try again.");
  }
}/*catch (error) {
    console.error("Error occurred while adding data:", error);
    alert("Failed to add data. Please try again.");
    
  }*/
}; 

const containerStyle = {
   backgroundColor: "#e6f2ff",
      //backgroundImage: "url('https://wallpaperaccess.com/full/960592.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: "100vh",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    };

const cardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  lineHeight: "1.6",
  textAlign: "left",
  fontSize: "20px",
  animation: "card-entrance 0.8s var(--ease-out-quart) forwards",
  position: "relative",
   boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
   gap:"20px"
};



  return (
    
    
     <div >
      <Nav />
    <div style={{ fontFamily: "Segoe UI", backgroundColor: "#e6f2ff", minHeight: "100vh" }}>
      

     
      <div
        style={{
          maxWidth: "700px",
          margin: "80px auto",
          background: "white",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize:"20px" }}><b>🩺 Review Your Pain Report</b></h2>



                <div
          //key={index}
          //ref={cardRef}
          //className="card"
          style={cardStyle}
         
        >
       
        <p><b>Pain Type:</b> {painType}</p>
        </div>
        <div style={cardStyle}>
        <p><b>Body Parts:</b> {painType === "single" ? selectedPart : selectedParts.join(", ")}</p>
        </div>
        <div style={cardStyle}>
        <p><b>Severity:</b> {severity}/10</p>
        </div>
        <div style={cardStyle}>
        <p><b>Date:</b> {answers.Date}</p>
        </div>
        <div style={cardStyle}>
        <p><b>Previously Experienced:</b> {answers.Q1}</p>
        </div>
       <div style={cardStyle}>
        <h3>Answers:</h3>
        <ul>
          {Object.entries(answers.Question || {}).map(([q, a]) => (
            <li key={q}>
              <b>{q}</b>: {a}
            </li>
          ))}
        </ul>
        </div>
        <div style={{ marginTop: "20px" }}>
          <div style={cardStyle}>
          <p><b>Pain Feeling:</b> {answers.Image1 || "Not selected"}</p>
          </div>
           <div style={cardStyle}
         
        >
          <p><b>Pain Cause:</b> {answers.Image2 || "Not selected"}</p>

          </div>
        </div>

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button
            onClick={handleEdit}
            style={{
              backgroundColor: "#aaa",
              color: "white",
              border: "none",
              padding: "10px 20px",
              marginRight: "10px",
              borderRadius: "6px",
            }}
          >
            Edit
          </button>
          <button
            onClick={handleConfirm}
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
            }}
          >
            Confirm & Submit
          </button>
       
      </div>
</div>
      </div>
    </div>
  );
}

/*import React, { useState } from "react";
import Modelz from "./Modelz";
import Questions from "./Questions";

export default function Combine() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedParts, setSelectedParts] = useState([]);
  const [painType, setPainType] = useState("single");
  const [severity, setSeverity] = useState(0);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      <div style={{ flex: 1 }}>
        <Modelz
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          selectedParts={selectedParts}
          setSelectedParts={setSelectedParts}
          painType={painType}
          setPainType={setPainType}
          severity={severity}
          setSeverity={setSeverity}
        />
      </div>

      
      <div style={{ width: "500px", overflowY: "auto" }}>
        <Questions
          selectedPart={selectedPart}
          selectedParts={selectedParts}
          painType={painType}
          severity={severity}
        />
      </div>
    </div>
  );
}*/