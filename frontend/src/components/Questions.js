import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; 
import Nav from './Nav';
import Modelz from './Modelz';
import MedicalReport from './MedicalReport';
import { useLocation } from "react-router-dom";

import { Canvas } from "@react-three/fiber";
import {Html, OrbitControls, useGLTF, TransformControls} from "@react-three/drei";
import * as THREE from "three";
//import Sidebar from './Sidebar.js';
import AboutUs from './AboutUs';




/*const questionBank = {
  left_leg: ["1)When did the pain start?", "2)Is it sharp or dull?"],
  right_leg: ["1)Difficulty moving leg?", "2)Does it hurt at night?"],
    left_hand: ["1)Rate your pain level?", "2)Difficulty moving fingers?"],
    right_hand: ["1)How often did the pain happening?"],
  
    face_head: ["Do you feel stiffness or locking in the jaw","Do you notice jaw clicking/grinding or jaw locking?","Do headaches occur with this pain, and at what time of day?"],
    neck: ["Does the pain radiate into your shoulder or arm?","Do you experience dizziness, headaches, or vision changes with neck pain?","Any numbness/tingling in the hands or fingers?"],
    shoulder: ["Do you feel weakness or loss of range of motion?","Any clicking/grinding and does it hurt when that happens?","Do you notice swelling, warmth, or redness?"],
    upper_arm: ["Do you have sudden muscle cramps or spasms?","Does the pain change during activity or at rest?","Does it start at the neck/shoulder and travel down?"],
    elbow: ["Triggered by gripping, typing, or lifting a kettle/pan?","Is the soreness pin‑point at inner/outer elbow or does it spread?","Do you feel stiffness in the morning or after rest?"],
    forearm: ["Do you experience shaking or trembling when gripping?","Do you notice visible swelling or bulging muscles?","Does the pain radiate to your wrist, elbow, or hand?"],
    wrist_hand: ["Does pain or numbness wake you at night?","Do you drop objects or feel clumsy with buttons/keys?","Do you have difficulty with grip strength or dropping objects?"],
    upper_back: ["Do you feel tightness when breathing deeply?","Pain with deep breathing, rotation, or reaching behind?","Do you feel numbness or tingling radiating to the chest/arms?"],
    lower_back: ["Triggered by bending, lifting, or getting out of a chair?","Do you feel morning stiffness that improves during the day?","Any leg symptoms (numbness, tingling, weakness) or night pain?"],
    pelvis: ["Pain with walking, stairs, or single‑leg standing?","Do you feel instability as if the joint is slipping?","Morning stiffness that eases with movement?"],
    hip: ["Worse with walking, stairs, squatting, or getting in/out of car?","Any clicking/grinding; does that correlate with pain?","Do you feel stiffness when rotating your hip or tying shoes?"],
    thighs_hamstrings: ["Did it start suddenly during activity (sprint, kick)?","Do you feel weakness when climbing stairs or squatting?","Is pain only with exercise or also at rest/next day?"],
    knee: ["Do you hear or feel grinding/clicking when bending your knee?","Any swelling, warmth, or giving‑way/instability?","Pain at the front (patellar), inside, outside, or back of the knee?"],
    calves: ["Do walking/running bring on cramps or tightness?","Do you get night cramps or tightness after walking?","Any night cramps or calf tightness in the morning?"],
    ankle_foot: ["Do you feel instability when standing on one foot?","Do you experience swelling around the ankle/foot at the end of the day?","Do shoes/insoles change the pain (better or worse)?"],
    
};*/

const Questions = () => {
  const { partName } = useParams();
  const [questions, setQuestions] = useState([]);
  //const questions = questionBank[partName] || ["Please select the correct body part that pain occured."];
const [selectedImage, setSelectedImage] = useState({});
const [answer, setAnswer] = useState("");
 const location = useLocation();
  const { painType,/*selectedParts,selectedPart,*/ severity } = location.state || {};


  //const navigate = useNavigate();

const [selectedPart, setSelectedPart] = useState(location.state?.selectedPart || null);
const [selectedParts, setSelectedParts] = useState(location.state?.selectedParts || []);

  const [tooltip, setTooltip] = useState(null);
  const [tooltips, setTooltips] = useState([]);

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6;

const savedState = JSON.parse(localStorage.getItem("editState") || "{}");
  const defaultInputs = {
    Question: [],
    Q1: "",
    Date: "",
    Image1: "",
    Image2: "",
    Severity: ""
  };

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [currentStep]);
  const handlePreview = () => {
    navigate("/Combine", {
      state: {
        painType,
        selectedPart,
        selectedParts,
        severity,
        answers: inputs,
      },
    });
  };

  
 function Model({ selectedPart, setSelectedPart, selectedParts, setSelectedParts, painType, tooltips, setTooltips }) {
  const { scene } = useGLTF("/models/AnatomyV3.glb"); // Path in public folder
  const [originalColors, setOriginalColors] = useState(new Map());
  
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

 


   useEffect(() => {
    // Save original colors of meshes
    const colors = new Map();
    scene.traverse((child) => {
      if (child.isMesh) {
      // Clone material so each mesh has its own
      child.material = child.material.clone();
      colors.set(child.uuid, child.material.color.clone());
    }
      {/*
      if (child.isMesh && child.material) {
        colors.set(child.uuid, child.material.color.clone());
      }*/}
    });
    setOriginalColors(colors);
  }, [scene]);

  const handleClick = (e) => {
    if (!e.object) return;
  const partName = e.object.name;
   const position = e.object.getWorldPosition(new THREE.Vector3());

  if(painType === "single") {
    // Clear all previous highlights
    scene.traverse((child) => {
      if (child.isMesh && child.material && originalColors.has(child.uuid)) {
        child.material.color.copy(originalColors.get(child.uuid));
      }
    });

    // Highlight clicked mesh
    e.object.material.color.set("red");
    setSelectedPart(partName);

     setTooltips([{
    name: partName,
    position: e.object.getWorldPosition(new THREE.Vector3())
  }]);
  } else { // multiple
    setSelectedParts((prev) => {
      let updated;
      if (prev.includes(partName)) {
        updated = prev.filter((p) => p !== partName);
      } else {
        updated = [...prev, partName];
      }

       const newTooltips = [];

      // Reset colors then highlight updated
      scene.traverse((child) => {
        if (child.isMesh && originalColors.has(child.uuid)) {
          child.material.color.copy(originalColors.get(child.uuid));
        }
        if (child.isMesh && updated.includes(child.name)) {
         // child.material.color.set("red");
         newTooltips.push({
            name: child.name,
            position: child.getWorldPosition(new THREE.Vector3()),
          });
        }
      });
      setTooltips(newTooltips);

      return updated;
    });
  }
   
  };

   
  
  return <primitive object={scene} onClick={handleClick} scale={/*0.85*/0.95} position={[-1, 0, -1]}  />;
}








  useEffect(() => {
  if (!partName) return;

  // fetch questions using partName
}, [partName]);

   const history = useNavigate();

   const [inputs, setInputs] = useState(location.state?.answers || defaultInputs);
    /*const [inputs,setInputs] = useState(location.state?.answers ||{
        Question:[],
        Q1: "",
        Date: "",
        Image1: "",
        Image2: "",
        Severity: ""

    });*/

    

    useEffect(() => {
    const fetchQuestions = async (part) => {
      try {
        const res = await axios.get("http://localhost:8080/mediQ");
        const filtered = res.data
          .filter((q) => q.bodyPart === part)
          .map((q) => `${part}: ${q.Question}`);
        return filtered.length ? filtered : [`${part}: No questions found.`];
      } catch (err) {
        console.error(err);
        return [`${part}: Failed to load questions.`];
      }
    };

    const loadAll = async () => {
      if (painType === "single" && selectedPart) {
        const qs = await fetchQuestions(selectedPart);
        setQuestions(qs);
      } else if (painType === "multiple" && selectedParts?.length) {
        let allQs = [];
        for (let part of selectedParts) {
          const qs = await fetchQuestions(part);
          allQs = [...allQs, ...qs];
        }
        setQuestions(allQs);
      }
    };

    loadAll();
  }, [painType, selectedPart, selectedParts]);

    useEffect(() => {
    if (severity !== undefined) setInputs(prev => ({ ...prev, Severity: severity }));
  }, [severity]);

    

    const handleQuestionChange = (index, value) => {
  setInputs(prev => {
    const newQuestions = [...prev.Question];
    newQuestions[index] = value;
    return { ...prev, Question: newQuestions };
  });
};
    

    const handleChange = (e) => {
        setInputs((prevState)=> ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

   /* const handleSubmit =(e) =>{
      
        e.preventDefault();
        console.log(inputs);
       
        sendRequest().then(() => history('/MediData'));
    }*/

    
   /* const sendRequest = async () => {
        try {
            await axios.post("http://localhost:8080/mediData/add", {
                Question: inputs.Question,
                Q1: inputs.Q1,
                Date: inputs.Date,
                Image1: { label: inputs.Image1 },
                Image2: { label: inputs.Image2 },
                Severity: inputs.Severity,
            },
             {
        withCredentials: true, 
        headers: {
          "Content-Type": "application/json",
        },
      }
          );
        } catch (error) {
            console.error("Error occurred while adding data:", error);
            alert("Failed to add data. Please try again.");
        }
    };*/
 /*   const sendRequest = async () => {
  try {
    if (painType === "single") {
      if (!selectedPart) return;

      const realQuestions = questions.filter(q => !q.includes("No questions"));
      if (realQuestions.length === 0) {
        alert("No questions available for this body part. Cannot save.");
        return;
      }

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

  } catch (error) {
    console.error("Error occurred while adding data:", error);
    alert("Failed to add data. Please try again.");
  }
};
*/
   const navigate = useNavigate(); 

 useEffect(() => {
    if (!partName) return;

    const fetchQuestions = async () => {
      try {
        const res = await axios.get("http://localhost:8080/mediQ");
        const filtered = res.data
          .filter((q) => q.bodyPart === partName)
          .map((q) => q.Question); // Only get question text
        setQuestions(filtered.length ? filtered : ["No questions found for this part."]);
      } catch (err) {
        console.error(err);
        setQuestions(["Failed to load questions."]);
      }
    };

    fetchQuestions();
  }, [partName]);

  const containerStyle = {
     backgroundColor: "#e6f2ff",
        //backgroundImage: "url('https://www.incomeactivator.com/images/freebg11.jpg')", // Background image URL
        backgroundSize: "cover",
        backgroundPosition: "center",
        //fontFamily: "Arial, sans-serif",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        margin: "0",
        padding: "0",
        minHeight: "calc(100vh - 60px)",
        //height: "100vh",
        flexDirection: "row", 
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        //alignItems: "center",
        fontSize: '25px',
        gap: "20px",
        //fontWeight: 'bold'
    };
    const buttonStyle = {
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: 'black',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        width:"400px"
    };
    const formStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background for form
        padding: "30px",
        width: "600px",
        borderRadius: "10px",
        marginLeft: "60px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        float: "right",
        justifyContent:"center",
        transition: "transform 0.3s ease, border-color 0.3s ease"
     

    };
    const inputStyle = {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        width: "70%",
        fontSize: "16px"
    };

    const OrderContainerStyle = {
       // width: "100%",
        maxWidth: "500px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
        padding: "20px"
    };

    const formGrid = {
      backgroundColor:"rgba(179, 192, 209, 1)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
      display: "grid",
      gridTemplateColumns: "1fr ",
      //gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "6rem",
      margin: "0 auto",
      padding: "2rem",
      borderRadius: "10px",
      
      
      };


    const images = [
   
    { url: "/Images/sharp.png", label: "Sharp Pain" },
  { url: "/Images/dull.png", label: "Dull Pain" },
  { url: "/Images/Burning.png", label: "Burning Pain" },
  { url: "/Images/throbbing.png", label: "Throbbing" }
  ];

   const images1 = [
    
    { url: "/Images/sportA.png", label: "Sport Activity" },
  { url: "/Images/Injury.png", label: "Injury" },
  { url: "/Images/Work.png", label: "Work strain" },
  { url: "/Images/Jerk.png", label: "Sudden jerk" }
  ];

     const handleImageClick = (type, label) => {
       setInputs(prev => ({
    ...prev,
    [type]: label, // type is 'Image1' or 'Image2'
  }));
      //setSelectedImage(prev => ({ ...prev, [questionIndex]: url }));
    //setSelectedImage(url);
  };
  return (
    <div>
      <Nav/>
    <div style={containerStyle}>
    
    {/*<Modelz/>*/}

  {/*<div style={{ minWidth: "600px", height: "80vh" }}> */}
  <div style={{
  display: "flex",
  flexDirection: "row",
  width: "100%",
  height: "calc(100vh - 60px)", // full viewport height minus nav
  gap: "20px",
  padding: "20px",
  boxSizing: "border-box"
}}> 
<div style={{ /*width: "100%",*/minWidth: "600px", height: "100%" ,overflow: "visible",position: "relative"}}>
<div
    style={{
      display:"flex",
      width: "40vw",          
      height: "90vh",         
      border: "2px solid #000",
      borderRadius: "10px",    
      overflow: "hidden",      
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      justifyContent:"center",
       alignItems: "center",
      marginLeft:"40px",
      backgroundColor: "#d9f0ff",
    }}
  >
  <Canvas style={{flex: 1, /*width: "100%",*/ minWidth: "600px", height: "100%" }}>
{/*<Canvas style={{ flex: 2, background: "rgba(200,200,200,0.1)", width: "100%", height: "100%" }}>*/}
  <ambientLight intensity={0.5} />
  <directionalLight position={[5, 5, 5]} />
  
  <OrbitControls
    enablePan={false}
    enableZoom={true}
    minPolarAngle={Math.PI / 2}
    maxPolarAngle={Math.PI / 2}
  />
  
  <Model
    selectedPart={selectedPart}
    setSelectedPart={setSelectedPart}
    selectedParts={selectedParts}
    setSelectedParts={setSelectedParts}
    painType={painType}
    setTooltip={setTooltip} 
  tooltips={tooltips}        
  setTooltips={setTooltips}
  />

  {painType === "single" && tooltip && (
      <Html
      position={tooltip.position.clone().add(new THREE.Vector3(0, 0.15, 0))}
        //position={tooltip.position}
        style={{
          zIndex: 100,
          background: "white",
          padding: "5px 10px",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          pointerEvents: "none"
        }}
      >
        {tooltip.name}
      </Html>
    )}
{painType === "multiple" &&
   /* {*/tooltips.map((tip, index) => (
    <Html
    key={`${tip.name}-${index}`}
      //key={tip.name}
      position={tip.position.clone().add(new THREE.Vector3(0, 0.15 + index * 0.20, 0))}
      //position={tip.position}
      style={{
        zIndex: 100,
        background: "white",
        padding: "5px 10px",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        fontSize: "20px"
      }}
    >
      {tip.name}
    </Html>
  ))}
{/*}*/}
</Canvas>
</div>
</div>

<button
  style={{
    padding: "10px 20px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    position: "absolute",
    top: "80px",
    left: "30px"
  }}
  onClick={() => {
    navigate(-1);
    /*setTimeout(() => {
      window.location.reload();
    }, 300);*/
  }}
>
  Start again
</button>
{/*<Canvas  style={{
  flex: 1, background: "rgba(200,200,200,0.1)"
    
  }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      
     
      <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minPolarAngle={Math.PI / 2} 
            maxPolarAngle={Math.PI / 2}
      />
       <TransformControls mode="translate">
        
         <Model  selectedPart={selectedPart}
  setSelectedPart={setSelectedPart}
  selectedParts={selectedParts}
  setSelectedParts={setSelectedParts}
  painType={painType} />
        </TransformControls>
    </Canvas>*/}



{/*<div className="flex h-screen">
      <div className="w-1/2 bg-white overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800"></h2>*/}
    {/*<div style={OrderContainerStyle}>*/}


     {/*{isShowingSidebar && (
        <AboutUs />
      )}

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        </main>*/}
 <div
    style={{
      flex: 1,
      maxwidth: "800px",
       height: "100%",
      padding: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      overflowY: "auto",
      //zIndex: 1 // scroll only if content exceeds viewport
    }}
  >
      
      <h2>Answer the questions about pain in your {" "}
        {painType === "single" ? selectedPart : selectedParts?.join(", ")}
        </h2><br></br>

      
<div style={formGrid}>

      <form style={formStyle}  /*onSubmit={handleSubmit}*/>
        {currentStep === 0 && (
          <div>
      <ul>
        {questions.map((q, i) => (
          <li key={i}>{q}
          <br></br>
        
          <input type = "text" name = "Question" style={inputStyle} placeholder ="enter you answer" onChange = {(e) => handleQuestionChange(i, e.target.value)} value={inputs.Question[i] || "" }></input><br></br>
          </li>
        ))}
      </ul><br></br>
      </div>
        )}
        {currentStep === 1 && (
          <div>
           <label><h1> Have you experienced this pain before</h1></label>
            <label>
          <input type="radio" name="Q1" value="yes" checked={inputs.Q1 === "yes"}  onChange={handleChange}  />
          Yes
          </label><br></br>
          <label>
          <input type="radio" name="Q1" value="no"  checked={inputs.Q1 === "no"}  onChange={handleChange}/>
          No
          </label>
           <br></br>
           </div>
        )}
          {/*<label>When did the pain happen</label><br></br>
        <input type="date"/>
      <br></br><br></br>*/}
     {/*<button type="submit" style={buttonStyle}>submit</button>*/}
      </form>

      {/*<form style={formStyle}>
        <label>When did the pain happen</label><br></br>
        <input type="date"/>
      </form>*/}
{currentStep === 2 && (
        <div>
        
      
      <MedicalReport/>
    </div>
)}
        <form style={formStyle}  /*onSubmit={handleSubmit}*/>
        {currentStep === 3 && (
          <div>
        <label>1)When did the pain happen</label><br></br>
        <input type="date" name = "Date" style={inputStyle} onChange = {handleChange} value={inputs.Date || "" }/><br></br><br></br>
<br></br>
        <label>2)How do you feel th pain</label><br></br>
     <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
      {images.map((img, index) => (
      <label key={index}>
          <input type="radio" name="Image1" /*value={img.url}*/  style={{ display: "none" }} value={img.label} checked={inputs.Image1 === img.label} /*onChange={() => handleImageClick(img.url)}*/ onChange = {() => handleImageClick("Image1", img.label)} />
          <img
            src={img.url}
           /* alt="Option 2"*/
             alt={img.label || ""}
             style={{
                      width: "300px",
                      height: "100px",
                      cursor: "pointer",
                      border: inputs.Image1 === img.label ? "2px solid blue" : "2px solid transparent"
                    }}
            //style={{ width: "80px", cursor: "pointer", border: "2px solid transparent" }}
             onClick={() => handleImageClick("Image1", img.label)

           /* onClick={(e) => {
              e.target.style.border = "2px solid blue";
            }*/ 

           }
          />
           <div style={{ marginTop: "6px", fontSize: "14px", fontWeight: "bold" }}>
      {img.label}
    </div>
    
           </label> 
      ))}
       
       
        {/* <label> 
          
          <input type="radio"  value="option1" style={{ display: "none" }} />
          <img
            src="https://img.freepik.com/premium-photo/brown-background-with-brown-texture-that-says-grung_993265-46706.jpg"
            alt="Option 1"
            style={{ width: "80px", cursor: "pointer", border: "2px solid transparent" }}
            onClick={(e) => {
              // highlight clicked option
              e.target.style.border = "2px solid blue";
            }}
          />
        </label>
       <label>
          <input type="radio"  value="option1" style={{ display: "none" }} />
          <img
            src="https://img.buzzfeed.com/buzzfeed-static/static/2015-07/27/17/enhanced/webdr02/enhanced-9052-1438030862-29.jpg"
            alt="Option 1"
            style={{ width: "80px", cursor: "pointer", border: "2px solid transparent" }}
            onClick={(e) => {
              // highlight clicked option
              e.target.style.border = "2px solid blue";
            }}
          />
        </label>
        <label>
          <input type="radio"  value="option1" style={{ display: "none" }} />
          <img
            src="https://a.rgbimg.com/users/j/ja/jazza/600/2djrGbY.jpg"
           
           
            style={{ width: "80px", cursor: "pointer", border: "2px solid transparent" }}
            onClick={(e) => {
              
              e.target.style.border = "2px solid blue";
            }}
          />
        </label>*/}

     
 
        </div>
        </div>
        )}
        <br></br><br></br>

         {currentStep === 4 && (
          <div>
        <label>3)What cause the pain</label><br></br>
     <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}></div>
        {images1.map((img1, index) => (
      <label key={index}>
          <input type="radio" name="Image2" /*value={img1.url}*/  style={{ display: "none" }} onChange = {() => handleImageClick("Image2", img1.label)} value={inputs.Image2 || "" } checked={inputs.Image2 === img1.label} /*onChange={() => handleImageClick(img1.url)}*//>
          <img
            src={img1.url}
           /* alt="Option 2"*/
             alt={img1.label || ""}
             style={{
                      width: "200px",
                      height: "100px",
                      cursor: "pointer",
                      border: inputs.Image2 === img1.label ? "3px solid blue" : "3px solid transparent"
                    }}
            //style={{ width: "80px", cursor: "pointer", border: "2px solid transparent" }}
             onClick={() => handleImageClick("Image2", img1.label)

           /* onClick={(e) => {
              e.target.style.border = "2px solid blue";
            }*/ 

           }
          />
           <div style={{ marginTop: "6px", fontSize: "14px", fontWeight: "bold" }}>
      {img1.label}
    </div>
    
           </label> 
      ))}
      </div>
    )}

   {/* {currentStep === 4 && (
      <button
          onClick={handlePreview}
          style={{
            width: "100%",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          Preview All Details →
        </button>
      
    )}*/}

    <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", gap:"20px" }}>
    <button
      type="button"
      onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
      disabled={currentStep === 0}
      style={buttonStyle}
    >
      Previous
    </button>

    {currentStep < totalSteps - 1 && (
  <button
    type="button"
    onClick={() => setCurrentStep(prev => prev + 1)}
    style={buttonStyle}
  >
    Next
  </button>
)}

{currentStep === totalSteps - 1 && (
  <button
    type="button"
    onClick={handlePreview}
    style={{
      width: "100%",
      backgroundColor: "blue",
      color: "white",
      border: "none",
      padding: "10px",
      borderRadius: "6px",
      fontSize:"16px"
    }}
  >
    Preview All Details →
  </button>
)}

   {/* {currentStep < totalSteps - 1 ? (
      <button type="button" onClick={() => setCurrentStep((prev) => prev + 1)} style={buttonStyle}>
        Next
      </button>
    ) : (

      <button
          onClick={handlePreview}
          style={{
            width: "100%",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          Preview All Details →
        </button>
      
    
    )}*/}
 </div>
      
        
    {/*<button type = "submit"  style={buttonStyle}>Submit</button>*/}
      </form>

</div>


</div>









</div>
    </div>
   
  </div>
     
    
  );
};

export default Questions;


