/*import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ThreeDModel = ({ modelUid }) => {
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load Sketchfab API
    const script = document.createElement("script");
    script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
    
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const iframe = iframeRef.current;
      const client = new window.Sketchfab("1.12.1", iframe);

      client.init(modelUid, {
        success: function (api) {
          api.start();
          api.addEventListener("viewerready", () => {
            console.log("Viewer ready");

            // Optional: list all nodes (body parts)
            api.getNodeMap((err, nodes) => {
              if (!err) console.log("Nodes:", nodes);
            });

            // Click on body part
            api.addEventListener("click", (event) => {
              const partName = event.node.name; // clicked mesh
              console.log("Clicked part:", partName);

              // Redirect to question page
              navigate(`/questions/${partName}`);
            });
          });
        },
        error: function () {
          console.error("Sketchfab API init error");
        },
        autostart: 1,
      });
    };
  }, [modelUid, navigate]);

  return (
    <iframe
      ref={iframeRef}
      title="Sketchfab Viewer"
      width="800"
      height="600"
      //src={`https://sketchfab.com/models/edff2cf5209d467abc19e16c0d82cf56/embed`}
       src="https://sketchfab.com/models/edff2cf5209d467abc19e16c0d82cf56/embed?autostart=1&ui_infos=0&ui_stop=0&ui_watermark=0"
      allow="autoplay; fullscreen; vr"
      style={{ border: "none" }}
    />
  );
};

export default ThreeDModel;*/
//import { useRef } from "react";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {  Html,OrbitControls, useGLTF, TransformControls} from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import Nav from './Nav';
import * as THREE from "three";

function Model({ selectedPart, setSelectedPart, selectedParts, setSelectedParts, painType ,setTooltip,setTooltips}) {
  const { scene } = useGLTF("/models/AnatomyV9.glb"); // Path in public folder
  const [originalColors, setOriginalColors] = useState(new Map());
  
  const navigate = useNavigate();

  const [tooltipPos, setTooltipPos] = useState(null);
  
  //const isDragging = useRef(false);

/*  const handlePointerDown = () => {
    isDragging.current = false;
  };

  const handlePointerMove = () => {
    isDragging.current = true; // mark as drag
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) {
      // this is a click, not drag
      const partName = e.object.name;
      console.log("Clicked part:", partName);
      navigate(`/questions/${partName}`);
    }
  };*/
   useEffect(() => {
    // Save original colors of meshes
    const colors = new Map();
    scene.traverse((child) => {
      if (child.isMesh) {
      // Clone material so each mesh has its own
      child.material = child.material.clone();
      colors.set(child.uuid, child.material.color.clone());

       child.material.color.multiplyScalar(0.5);
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

  const worldPos = new THREE.Vector3();
    e.object.getWorldPosition(worldPos);
    //worldPos.y += 0.2;
    //setTooltipPos(worldPos);

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
    //setTooltip({ name: partName, position: worldPos });
    setTooltip({ name: partName, position: worldPos.clone().add(new THREE.Vector3(0, 0.15, 0)) }); 

  } else { // multiple
    setSelectedParts((prev) => {
      let updated;
      if (prev.includes(partName)) {
        updated = prev.filter((p) => p !== partName);
      } else {
        updated = [...prev, partName];
      }

      // Reset colors then highlight updated
      scene.traverse((child) => {
        if (child.isMesh && originalColors.has(child.uuid)) {
          child.material.color.copy(originalColors.get(child.uuid));
        }
        if (child.isMesh && updated.includes(child.name)) {
          child.material.color.set("red");
        }
      });

       //setTooltip({ name: partName, position: worldPos });
       //setTooltip({ name: partName, position: worldPos.clone().add(new THREE.Vector3(0, 0.15, 0)) }); 
       // Update tooltips array
      const newTooltips = updated.map(name => {
        const mesh = scene.getObjectByName(name);
        const pos = new THREE.Vector3();
        if (mesh) mesh.getWorldPosition(pos);
        return { name, position: pos.clone().add(new THREE.Vector3(0, 0.15, 0)) };
      });
      setTooltips(newTooltips);

      return updated;
    });
  }
   /* if (!e.object) return;
    const partName = e.object.name; // name of the mesh
    console.log("Clicked part:", partName);
    //navigate(`/questions/${partName}`);
if(painType === "single"){
     scene.traverse((child) => {
      if (child.isMesh && child.material && originalColors.has(child.uuid)) {
        child.material.color.copy(originalColors.get(child.uuid));
      }
    });

    // Highlight clicked mesh
    if (e.object.material) {
      e.object.material.color.set("red");
    }
  
    setSelectedPart(partName);
  }
  else{
    setSelectedParts((prev) => {
      let updated;
      if (prev.includes(partName)) {
        updated = prev.filter((p) => p !== partName);
      } else {
        updated = [...prev, partName];
      }

      // Reset colors then highlight updated
      scene.traverse((child) => {
        if (child.isMesh && originalColors.has(child.uuid)) {
          child.material.color.copy(originalColors.get(child.uuid));
        }
        if (child.isMesh && updated.includes(child.name)) {
          child.material.color.set("red");
        }
      });

      return updated;
    });
  }*/
  };

   
  /* return (
    <primitive
      object={scene}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  );*/
  //return <primitive object={scene} onClick={handleClick} scale={0.35} position={[0, -1.5, 0]} />;
  return <primitive object={scene} onClick={handleClick} scale={0.85} position={[-1, 0, -0.8]}  />;
}

const containerStyle = {
        //backgroundImage: "url('https://images.freecreatives.com/wp-content/uploads/2016/04/Best-Website-New-Wallpaper.jpg')", // Background image URL
       backgroundColor: "#e6f2ff",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        margin: "0",
        padding: "0",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: '30px',
        //fontWeight: 'bold'
    };

export default function ThreeDModel() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedParts, setSelectedParts] = useState([]);
  const [painType, setPainType] = useState("single");  
  const [severity, setSeverity] = useState(0);
  const navigate = useNavigate();

  const [tooltip, setTooltip] = useState(null);
  const [tooltips, setTooltips] = useState([]);

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
    navigate(`/questions/${selectedPart}`, {
      state: { painType: "single", selectedPart, severity }
    });
  } 
  else if (painType === "multiple") {
    if (!selectedParts || selectedParts.length === 0) {
      alert("Please select at least one body part!");
      return;
    }
    navigate(`/questions/${selectedParts.join(",")}`, {
      state: { painType: "multiple", selectedParts, severity }
    });
  } 
  else {
    alert("Please select a pain type first!");
  }
  };
  return (
    <div>
      <Nav/>
      <style>
        {`
          @keyframes fade-in {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    <div style={containerStyle}>
      <div
        style={{
          width: "500px",
          height: "100vh",
          background: "#b9ddeeff",
          padding: "20px",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
           //animation: "card-entrance 0.8s var(--ease-out-quart) forwards",
      //transform: "translateY(10px)",
        }}
      >
        {/*<h2>Navigation</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><a href="/home">🏠 Home</a></li>
          <li><a href="/instructions">📖 Instructions</a></li>
          <li><a href="/questions">❓ Questions</a></li>
        </ul>*/}

        <h3><b>Instructions</b></h3><br></br>
        
        
        Click the place the pain happened.<br></br>
         Drag to rotate the model.<br></br>
        Scroll to zoom.
        

        <div>
          <br></br>
  <h3><b>Select Pain Type:</b></h3>
  <br></br>
  <label>
    <input
      type="radio"
      value="single"
      checked={painType === "single"}
      onChange=/*{(e) => setPainType(e.target.value)}*/{(e) => {
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
    Localized Pain
  </label>
  <br />
  <label>
    <input
      type="radio"
      value="multiple"
      checked={painType === "multiple"}
      onChange=/*{(e) => setPainType(e.target.value)}*/{(e) => {
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
  </label>
</div>

         {selectedPart && (
            <div style={{ marginTop: "20px", fontWeight: "bold" }}>
              Selected: {selectedPart}

            </div>
          )}

           {/*selectedPart && */((painType === "single" && selectedPart) || (painType === "multiple" && selectedParts.length > 0)) &&(
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
              <progress value={severity} max="10" style={{ width: "100%", borderRadius: "15px", }}></progress>
              <div>Level: {severity}/10</div>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={
               (painType === "single" && !selectedPart) ||
    (painType === "multiple" && (!selectedParts || selectedParts.length === 0))
              /*!selectedPart*/}
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

          <br></br><br></br>

          <button
  style={{ padding: "10px 20px", backgroundColor: "#191b1dff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
  onClick={() => window.location.reload()}
>
  Start again
</button>
  
      </div>

     <div
    style={{
      display:"flex",
      width: "50vw",          
      height: "90vh",         
      border: "2px solid #000",
      borderRadius: "10px",    
      overflow: "hidden",      
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      justifyContent:"center",
       alignItems: "center",
      marginLeft:"40px",
      backgroundColor: "#d9f0ff02",
    }}
  >
      

    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      
      {/*<Model />*/}
      <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minPolarAngle={Math.PI / 2} 
            maxPolarAngle={Math.PI / 2}
            //target={[0, 0, 0]}
      />
       <TransformControls mode="translate">
         {/*<Model />*/}
         <Model  selectedPart={selectedPart}
  setSelectedPart={setSelectedPart}
  selectedParts={selectedParts}
  setSelectedParts={setSelectedParts}
  painType={painType} 
  setTooltip={setTooltip} 
  tooltips={tooltips}        
  setTooltips={setTooltips} />
  
        </TransformControls>

     {tooltip && (
    <Html
      position={tooltip.position}
      style={{
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

  {tooltips.map((tip, index) => (
  <Html
    key={tip.name}
    position={tip.position.clone().add(new THREE.Vector3(0, 0.15 + index * 0.20, 0))}
    //position={tip.position}
    style={{
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
    </Canvas>

    </div>
    </div>
    </div>
  );
}