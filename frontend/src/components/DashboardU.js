import React, { useState, useEffect, useRef ,Suspense} from "react";
import Nav from './Nav';

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";


function Reports(){
    const [newstock, setnewstock] = useState([]);
    const [newuser, setnewuser] = useState([]);
    const navigate = useNavigate();//paste
    const ComponentsRef = useRef();
    const cardRef = useRef();

    const [filteredStock, setFilteredStock] = useState([]);
    const [filteredUser, setFilteredUser] = useState([]);
    const [searchQuery,setSearchQuery] = useState("");
    const [noResults,setNoResults] = useState(false);

    const [painAreas, setPainAreas] = useState([]);
     const [meshData, setMeshData] = useState([]);

     const [meshColors, setMeshColors] = useState({});
const [activeTooltip, setActiveTooltip] = useState(null);

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get('http://localhost:8080/mediData' , {
                withCredentials: true
            });

            const loggedInUserId = localStorage.getItem("userId");

      const userSpecificData = response.data.filter(
        (item) => item.UserId?._id === loggedInUserId
      );
                setnewstock(userSpecificData); 
                setFilteredStock(userSpecificData);
                //setnewstock(response.data); 
                //setFilteredStock(response.data); 
            } catch (error) {
                console.error("Error fetching data:", error);
                setnewstock([]) ; 
                setFilteredStock([]);
            }
        };
        fetchHandler();
        }, []); 
    
    
   /* if (!newstock) {
       return <h2>Loading details...</h2>;
    }
    const {_id,Question,Q1,Date,Image1,Image2} = newstock;*/
    
    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get('http://localhost:8080/User' , {
                withCredentials: true
            });
                setnewuser(response.data); 
                setFilteredUser(response.data); 
            } catch (error) {
                console.error("Error fetching data:", error);
                setnewuser([]) ; 
                setFilteredUser([]);
            }
        };
        fetchHandler();
        }, []); 

       /* if (!newuser) {
       return  <h2>Loading details...</h2>;
    }*/
    const {UserName,Gender,Age} = newstock;

     useEffect(() => {
  if (filteredStock.length > 0) {
    // Map each stock item to its pain area(s)
    const areas = filteredStock.flatMap(item => {
      // Handle both single and multiple body parts
      if (Array.isArray(item.BodyPart)) {
        return item.BodyPart.map(part => ({ BodyPart: part, Severity: item.Severity, Date: item.Date, }));
      }
      return [{ BodyPart: item.BodyPart, Severity: item.Severity, Date: item.Date }];
    });

    setPainAreas(areas);
  } else {
    setPainAreas([]);
  }
}, [filteredStock]);

    const fetchStock = async () => {
        try {
          const response = await axios.get('http://localhost:8080/stock');
          return response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
          return [];
        }
      };

       const fetchUser = async () => {
        try {
          const response = await axios.get('http://localhost:8080/User');
          return response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
          return [];
        }
      };
    
     function Model({ painAreas ,setMeshData}) {
      //useGLTF.preload("/models/anatomy.glb");
      const { scene } = useGLTF("/models/AnatomyV4.glb");
  //const { scene } = useGLTF("/models/body.glb"); // same model you used
  
  useEffect(() => {
     const tempData = [];
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = obj.material.clone();

         const matches = painAreas./*find*/filter(
          (area) =>
            area.BodyPart?.toLowerCase() === obj.name.toLowerCase() ||
            area.BodyParts?.some((part) => part.toLowerCase() === obj.name.toLowerCase())
        ); 
        // Highlight if its name matches any pain area
      /*  const isPainful = painAreas.some((area) => 
          area.BodyPart?.toLowerCase() === obj.name.toLowerCase() || 
          area.BodyParts?.some(part => part.toLowerCase() === obj.name.toLowerCase())
          //area.BodyPart === obj.name || area.BodyParts?.includes(obj.name)
        );*/

         if (/*match*/matches.length > 0) {
          obj.material.color.set("red");
           matches.forEach(match => {
          tempData.push({
            name: obj.name,
            position: obj.position.clone(),
            Date: match.Date,
          });
          });
        } else {
          obj.material.color.set("white");
        }
      
        //obj.material.color.set(isPainful ? "red" : "white");
      }
    });
    setMeshData(tempData);
  }, [painAreas, scene, setMeshData]);

  return <primitive object={scene} scale={0.4}  position={[0, -0.1, -1]}/>;
} 
      

    /*const handleSearch = async () => {
        const data = await fetchStock();
        const filtered = data.filter((stock) =>
          Object.values(stock).some((val) =>
            val.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        setnewstock(filtered);
        setNoResults(filtered.length === 0);
      };*/

      

    const handleSavePDF = async (cardRef, filename = "submission.pdf") => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  };


  const handleSearch = /*async*/ () => {
        const filtered = newstock.filter((item) =>
            item.UserId?.UserName && item.UserId?.UserName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStock(filtered);
        setNoResults(filtered.length === 0);
    };
    
    const containerStyle = {
      backgroundColor: "#e6f2ff",
      //backgroundImage: "url('https://wallpaperaccess.com/full/960592.jpg')",
      //backgroundColor:"#374151",
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: "100vh",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      scrollbehavior: "smooth",
      boxsizing: "border-box",
      //margin:"20px"
    };

    const searchBoxStyle = {
        width: "100%",
        maxWidth: "500px",
        marginBottom: "20px",
        display: "flex",
        gap: "10px",
        justifyContent: "center"
    };

    const inputStyle = {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        width: "70%",
        fontSize: "16px"
    };

    const tableContainerStyle = {
      width: "90%",
      maxWidth: "1200px",
      margin: "20px auto",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
    };

    const tableStyle = {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden"
    };

    const thStyle = {
      padding: "12px 16px",
      textAlign: "center",
      borderBottom: "1px solid #e2e8f0",
      color: "#64748b",
      fontWeight: "600",
      fontSize: "16px",
      backgroundColor: "#f8fafc"
    };

    const tdStyle = {
      padding: "12px 16px",
      textAlign: "center",
      color: "#334155",
      fontSize: "16px",
      borderBottom: "1px solid #e2e8f0"
    };

    const gridContainer = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr", // 2 columns
  gap: "20px",
  width: "90%",
   margin:"30px"

};



// Card style
const cardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  //boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  lineHeight: "1.6",
  textAlign: "left",
  fontSize: "20px",
  border: "1px solid #dbdbdbff",
 // opacity: "0",
  //transform: "translateY(30px)",
  animation: "card-entrance 0.8s var(--ease-out-quart) forwards",
  
 // transform: "translateY(-5px)",
  //boxshadow: "0 2px 6px rgba(0,0,0,0.1)",
  position: "relative",
  margin:"30px"
};

const cardHoverStyle = {
  transform: "translateY(-5px)",
  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
  zIndex: 10
};

 
    
    

    /*const statusBadgeStyle = (status) => ({
      padding: "4px 8px",
      borderRadius: "9999px",
      fontSize: "14px",
      fontWeight: "600",
      display: "inline-block",
      
      ...(status?.toLowerCase() === 'available' ? {
        backgroundColor: "#dcfce7",
        color: "#166534"
      } : status?.toLowerCase() === 'repairing' ? {
        backgroundColor: "#fef9c3",
        color: "#854d0e"
      } : status?.toLowerCase() === 'unavailable' ? {
        backgroundColor: "#fee2e2",
        color: "#991b1b"
      } : {
        backgroundColor: "#f3f4f6",
        color: "#374151"
      })
    });*/
    const severityBadgeStyle = (severity) => {
  let bgColor = "#f3f4f6"; // default gray
  let color = "#374151";   // default text color

  if (severity >= 0 && severity <= 3) {
    bgColor = "#dcfce7"; // green
    color = "#166534";
  } else if (severity >= 4 && severity <= 7) {
    bgColor = "#fef9c3"; // yellow
    color = "#854d0e";
  } else if (severity >= 8 && severity <= 10) {
    bgColor = "#fee2e2"; // red
    color = "#991b1b";
  }

  return {
    padding: "4px 8px",
    borderRadius: "9999px",
    fontSize: "14px",
    fontWeight: "600",
    display: "inline-block",
    backgroundColor: bgColor,
    color: color
  };
};



    const buttonStyle = {
      padding: '10px 20px',
      backgroundColor: '#100c35ff',
      color: 'white',
      border: 'bold',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '30px',
      fontWeight: 'bold'
    };
    return (

       
        <div>
            <Nav/>
            <style>
        {`
          @keyframes card-entrance {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          :root {
             --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --shadow-glow: 0 8px 16px rgba(0, 0, 0, 0.2);
          }
            .card {
    transition: all 0.3s ease;
     position: relative;
  }

  .card:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: var(--shadow-glow);
    z-index: 10;
  }

        `}
      </style>
  <div style={containerStyle}>

   {filteredStock.length > 0 && filteredStock[0].UserId && (
    <div style={{ width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: "36px",
      padding: "0 20px",}}>
      <div style={{ /*marginLeft: "auto",*/ fontSize: "36px" }}>
      <b>Welcome!  </b> {filteredStock[0].UserId.UserName || "This user"}<br/>
      </div>
    </div>
  )}
     

<div style={{ width: "100%", display: "flex", justifyContent: "flex-end", /*marginBottom: "20px",*/ marginTop:"36px", marginRight:"500px"}}>
    <button style={buttonStyle}
    onClick={() => {
    navigate("/ThreeDModel");
    // Refresh the page after 300ms to ensure new data loads
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }}
    //</div>onClick={() => navigate("/ThreeDModel")
     
    //}
    
  >
    Add new pain
  </button>
  </div>

  {/*<div style={searchBoxStyle}>
                    <input
                        style={inputStyle}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        name="Search"
                        placeholder="Search records"
                        value={searchQuery}
                    />
                    <button
                        style={buttonStyle}
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>*/}
{filteredStock.length > 0 && filteredStock[0].UserId && (
    <div style={{ marginBottom: "20px", fontSize: "30px"}}>
      <b>Name :</b> {filteredStock[0].UserId.UserName || "This user"}<br/>
      <b>Age :</b> {filteredStock[0].UserId.Age ? ` ${filteredStock[0].UserId.Age} ` : ""}<br/>
      <b>Gender :</b> {filteredStock[0].UserId.Gender ? ` ${filteredStock[0].UserId.Gender}` : ""}<br/><br/>
    </div>
  )}

  <h1 style={{fontSize:'36px', color: "#071b38", marginBottom: "20px"}}><b>Recent Submissions</b></h1>

  <div style={{ width: "100%", height: "80vh", position: "relative",justifyContent:"center",}}>
    <center>
    <div
    style={{
      width: "800px",          // width of the rectangular window
      height: "600px",         // height of the rectangular window
      border: "2px solid #000",// border around the window
      borderRadius: "10px",    // optional rounded corners
      overflow: "hidden",      // ensures model doesn't spill outside
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    }}
  >
  <Canvas style={{ pointerEvents: "auto" }}  camera={{ position: [0, 1, 3], fov: 50 }}  >
        <ambientLight intensity={0.6} />
        <color attach="background" args={["#0e0c0cff"]} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <OrbitControls
            enablePan={false}
            enableZoom={true}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
            onPointerMissed={(e) => e.stopPropagation()}
          />
          <Suspense fallback={null}>
        <Model painAreas={painAreas} setMeshData={setMeshData}
        />





         {meshData.map((mesh, index) => (
        <Html
          key={index}
          //position={[mesh.position.x, mesh.position.y + 0.09, mesh.position.z]}
          position=/*{mesh.position}*/{[mesh.position.x, mesh.position.y + 0.09* (index + 1), mesh.position.y]}
         // transform        // makes the Html stick to 3D correctly
  //occlude={false} 
   zIndexRange={[100, 0]}
          style={{
            color: "red",
            fontWeight: "bold",
            backgroundColor: "rgba(255,255,255,0.7)",
            padding: "2px 4px",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer",
            pointerEvents: "auto" 
          }}
         
           onPointerDown={(e) => {
    e.stopPropagation(); // prevent 3D scene from capturing the click
     alert("Clicked mesh:", index);
    setActiveTooltip(index);
  }}
          //onClick={() => setActiveTooltip(index)}
        >
          {mesh.Date ? new Date(mesh.Date).toLocaleDateString() : ""}

           {activeTooltip === index && (
      <div style={{
        position: "relative",
        top: "20px",
        left: "10px",
        background: "rgba(255,255,255,0.95)",
        padding: "8px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        fontSize: "14px",
        maxWidth: "220px"
      }}>
        <b>Date:</b> {mesh.Date ? new Date(mesh.Date).toLocaleDateString() : "N/A"}<br/>
        <b>Pain Area:</b> {mesh.name || "N/A"}<br/>
        {mesh.Severity != null && (
          <>
            <b>Severity:</b> <span style={severityBadgeStyle(mesh.Severity)}>{mesh.Severity}</span>
          </>
        )}
        <br/>
        <button 
          onClick={() => setActiveTooltip(null)}
          style={{
            marginTop: "6px",
            padding: "2px 6px",
            fontSize: "12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#100c35ff",
            color: "white"
          }}
        >
          Close
        </button>
      </div>
    )}
        </Html>
      ))}
       
        </Suspense>

       
      </Canvas>
</div>
  </center>     
</div>
    <div
    style={{
      width: "90vw",          // width of the rectangular window
      height: "43vh",         // height of the rectangular window
      border: "2px solid #000",// border around the window
      borderRadius: "10px",
       overflowY: "auto",      // enables scrolling
    overflowX: "hidden",    // optional rounded corners
      //overflow: "hidden",      // ensures model doesn't spill outside
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    }}
  >             
<div style={gridContainer}>

    


  {filteredStock && filteredStock.length > 0 ? (
    filteredStock.map((stockItem, index) => {
         //const cardRef = useRef();
      const questionText = Array.isArray(stockItem.Question)
        ? stockItem.Question[0]
        : stockItem.Question;

         const cardRef = React.createRef();

      return (
        <div >

            {/* <b>Patient name :</b>{stockItem.UserId?.UserName || "This user"}<br></br>
            <b>Age :</b>{stockItem.UserId?.Age ? ` ${stockItem.UserId.Age} ` : ""} <br></br>
            <b>Gender :</b>{stockItem.UserId?.Gender ? ` ${stockItem.UserId.Gender}` : ""} <br></br><br></br>*/}

                <div
          key={index}
          ref={cardRef}
          className="card"
          style={cardStyle}
         
        >
       
        
         
            
           
            {/*{stockItem.UserId?.UserName || "This user"}
            {stockItem.UserId?.Age ? ` (${stockItem.UserId.Age} years old)` : ""}, 
            {stockItem.UserId?.Gender ? ` ${stockItem.UserId.Gender}` : ""}, 
            has given the answer for pain related questions as: {questionText ? questionText.toString().toLowerCase() : "a condition"}
            {stockItem.Q1 ? `. For the previous experience in pain is: ${stockItem.Q1}` : ""}.
          
            {stockItem.Image1?.label ? `The pain type is similar as ${stockItem.Image1.label}.` : ""}
            {stockItem.Image2?.label ? ` Pain occurs when: ${stockItem.Image2.label}.` : ""}
            {stockItem.Severity != null && (
              <> Severity level of the pain is: <span style={severityBadgeStyle(stockItem.Severity)}>{stockItem.Severity}</span>.</>
            )}
            {stockItem.Date ? `, from the starting date of ${new Date(stockItem.Date).toLocaleDateString()}.` : ""}
            <br></br>*/}
             <strong>Pain Area:    </strong>
            {stockItem.BodyPart || "N/A"}<br></br>
            <strong>Severity:    </strong>
           
             {stockItem.Severity != null ? (
    <span style={severityBadgeStyle(stockItem.Severity)}>
      {stockItem.Severity} {}
    </span>
  ) : (
    "N/A"
  )}<br></br>
<p>
    <strong>Answer for questions:    </strong> {Array.isArray(stockItem.Question) ? stockItem.Question[0] : stockItem.Question}<br></br>
      <strong>Previous experience:    </strong> { stockItem.Q1 || "N/A"}
      </p>
      <b>Pain type:    </b>
      {stockItem.Image1?.label || "N/A"}<br></br>
      <b>What caused the pain:    </b>
      {stockItem.Image2?.label || "N/A"}<br></br>
      <b>Date happened:    </b>
      {stockItem.Date ? new Date(stockItem.Date).toLocaleDateString() : "N/A"}<br></br>
         
          
          </div>
        
        </div>
        
      );
      
    })
  ) : (
    <p style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
      No submissions available
    </p>
    
    
  )}

  </div>
  
  </div>
  

</div>

</div>



);
}


export default Reports





