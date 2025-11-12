import React, { useState, useEffect, useRef ,Suspense} from "react";
import Nav2 from './Nav2';

import Update from './Update';
import Search from './Search';
import Print from './Print';
import Email from './Email';
import Files from './Files';

 

import { useNavigate ,useParams} from "react-router-dom";
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
  
    const { userId,itemId } = useParams();
    const [filteredStock, setFilteredStock] = useState([]);
    const [filteredUser, setFilteredUser] = useState([]);
    const [searchQuery,setSearchQuery] = useState("");
    const [noResults,setNoResults] = useState(false);

    const [painAreas, setPainAreas] = useState([]);
     const [meshData, setMeshData] = useState([]);

     const [userData, setUserData] = useState([]);

      const [inputs,setInputs] = useState({ Suggestion: "",Note: "" });

    /*useEffect(() => {
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
        }, []); */

        useEffect(() => {
    if (!userId || !itemId) return;

    const fetchData = async () => {
      try {
        // Fetch both users and mediData
        const [userRes, mediRes] = await Promise.all([
          axios.get("http://localhost:8080/user"), 
          axios.get("http://localhost:8080/mediData"),
        ]);

        const users = userRes.data;
        const mediData = mediRes.data;

        // Find the selected mediData record
        const selectedRecord = mediData.find(
          (item) => String(item._id) === String(itemId)
        );

        // Find matching user for that mediData
        const selectedUser = users.find(
          (u) => String(u._id) === String(userId)
        );

        if (selectedRecord && selectedUser) {
          // Merge user + mediData manually
          setFilteredStock([{ ...selectedRecord, UserId: selectedUser }]);
          setUserData([selectedUser]);
        } else {
          setFilteredStock([]);
          setUserData([]);
        }
      } catch (err) {
        console.error("Error fetching user or mediData:", err);
        setFilteredStock([]);
      }
    };

    fetchData();
  }, [userId, itemId]);

     /*  useEffect(() => {
            if (!userId ) return;
    const fetchUserReports = async () => {
      try {
        const response = await axios.get("http://localhost:8080/mediData");
        const selectedUserData = response.data.filter(
          (item) => item.UserId?._id === userId
        );

       

        setUserData(selectedUserData);
        setFilteredStock(selectedUserData);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserReports();
  }, [userId]);*/
    
    
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
        return item.BodyPart.map(part => ({ BodyPart: part, Severity: item.Severity, Date: item.Date,Note: item.Note }));
      }
      return [{ BodyPart: item.BodyPart, Severity: item.Severity, Date: item.Date,Note: item.Note }];
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
      const { scene } = useGLTF("/models/anatomy.glb");
  //const { scene } = useGLTF("/models/body.glb"); // same model you used
  const [meshColors, setMeshColors] = useState({});

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
            Note: match.Note || null,
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

  return <primitive object={scene} scale={0.4}  position={[0, -0.1, 0]}/>;
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

     const handleSubmit = (e) => {
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
    if (!inputs.Suggestion.trim() || filteredStock.length === 0) return;

  const currentRecord = filteredStock[0];
        try {
            await axios.put(`http://localhost:8080/mediData/${currentRecord._id}`, {
             // UserId: currentRecord.UserId._id,
        Suggestion: inputs.Suggestion,
        
        //ReferenceRecordId: currentRecord._id,
                //Suggestion: inputs.Suggestion,
                
            },{ withCredentials: true });

            setFilteredStock(prev =>
      prev.map(item =>
        item._id === currentRecord._id
          ? { ...item, Suggestion: inputs.Suggestion }
          : item
      )

      
    );

   

    setInputs({ Suggestion: "" });
        } catch (error) {
            console.error("Error occurred while adding data:", error);
            alert("Failed to add data. Please try again.");
            
        }
    };

    
   const handleNoteSubmit = async (e) => {
  e.preventDefault();
  if (!inputs.Note.trim() || filteredStock.length === 0) return;

  const currentRecord = filteredStock[0];
  try {
    await axios.put(`http://localhost:8080/mediData/${currentRecord._id}`, {
      Note: inputs.Note,
    }, { withCredentials: true });

    setFilteredStock(prev =>
      prev.map(item =>
        item._id === currentRecord._id
          ? { ...item, Note: inputs.Note }
          : item
      )
    );
    setInputs(prev => ({ ...prev, Note: "" }));
    alert("Note added successfully!");
  } catch (error) {
    console.error("Error occurred while adding Note:", error);
    alert("Failed to add Note. Please try again.");
  }
};
     

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
      fontFamily: "Arial, sans-serif",
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

    const gridContainer = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", // 2 columns
  gap: "20px",
  width: "100%",
   

};

const gridContainer1 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",/*"1fr 1fr 1fr",*/ // 2 columns
  gap: "20px",
  width: "100%",
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
 // opacity: "0",
  //transform: "translateY(30px)",
  animation: "card-entrance 0.8s var(--ease-out-quart) forwards",
 // transform: "translateY(-5px)",
  //boxshadow: "0 2px 6px rgba(0,0,0,0.1)",
  position: "relative"
};

const cardHoverStyle1 = {
  transform: "translateY(-5px)",
  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
  zIndex: 10
};


const cardStyle1 = {
  backgroundColor: "#f6fcf3ff",
  padding: "20px",
  borderRadius: "8px",
  //boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  //lineHeight: "1.6",
  textAlign: "left",
  fontSize: "20px",
 // opacity: "0",
  //transform: "translateY(30px)",
  animation: "card-entrance 0.8s var(--ease-out-quart) forwards",
 // transform: "translateY(-5px)",
  //boxshadow: "0 2px 6px rgba(0,0,0,0.1)",
  position: "relative"
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
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold'
    };
    return (

       
        <div>
            <Nav2/>
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
    <div style={{ marginBottom: "20px", fontSize: "30px"}}>
      <b>Patient name :</b> {filteredStock[0].UserId.UserName || "This user"}<br/>
      <b>Age :</b> {filteredStock[0].UserId.Age ? ` ${filteredStock[0].UserId.Age} ` : ""}<br/>
      <b>Gender :</b> {filteredStock[0].UserId.Gender ? ` ${filteredStock[0].UserId.Gender}` : ""}<br/><br/>
    </div>
  )}
 
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
                </div>
{filteredStock.length > 0 && filteredStock[0].UserId && (
    <div style={{ marginBottom: "20px", fontSize: "30px"}}>
      <b>Patient name :</b> {filteredStock[0].UserId.UserName || "This user"}<br/>
      <b>Age :</b> {filteredStock[0].UserId.Age ? ` ${filteredStock[0].UserId.Age} ` : ""}<br/>
      <b>Gender :</b> {filteredStock[0].UserId.Gender ? ` ${filteredStock[0].UserId.Gender}` : ""}<br/><br/>
    </div>
  )}

  <h1 style={{fontSize:'36px', color: "#071b38", marginBottom: "20px"}}><b>Recent Submissions</b></h1><br></br>*/}
   <div
  style={{
    display: "flex",
    //justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
     //height: "auto",
    height: "80vh",
    marginTop: "40px",
    gap: "20px",
  }}
> 

<div
    style={{
      flex: "1",
      overflowY: "auto",
      backgroundColor: "rgba(255,255,255,0.9)",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      height: "100%",
    }}
  >
{/*<div style={gridContainer}>*/}

   


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
          style={cardStyle1}
         
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
             <div style={cardStyle}>
             <b>Pain Area: </b>
            {stockItem.BodyPart || "N/A"}</div><br></br>
            <div style={cardStyle}>
            <b>Severity   </b>
           
             {stockItem.Severity != null ? (
    <span style={severityBadgeStyle(stockItem.Severity)}>
      {stockItem.Severity} {}
    </span>
  ) : (
    "N/A"
  )}</div><br></br>
   <div style={cardStyle}>
<p>
 
    <strong>Answer for pain type questions: </strong> {Array.isArray(stockItem.Question) ? stockItem.Question[0] : stockItem.Question}<br></br>
    
      <b>Previous experience on this pain: </b> { stockItem.Q1 || "N/A"}
      </p>
      
     
      <b>Pain type:  </b>
      {stockItem.Image1?.label || "N/A"}<br></br>
     
      <b>What caused the pain: </b>
      {stockItem.Image2?.label || "N/A"}<br></br>
     
      <b>Date happened: </b>
      {stockItem.Date ? new Date(stockItem.Date).toLocaleDateString() : "N/A"}<br></br>
          </div>
          
          </div>
       
        </div>
        
      );
      
    })
  ) : (
    <p style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
      No submissions available
    </p>
    
    
  )}
  
{/*  </div>*/}
</div>
  
  <div
    style={{
      flex: "1.5",
      height: "100%",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
  <div style={{ width: "100%", height: "80vh", position: "relative"}}>
  <Canvas camera={{ position: [0, 1, 3], fov: 50 } }>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <OrbitControls
            enablePan={false}
            enableZoom={true}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
          <Suspense fallback={null}>
        <Model painAreas={painAreas} setMeshData={setMeshData}
        />
         {meshData.map((mesh, index) => (
        <Html
          key={index}
          position=/*{mesh.position}*/{[mesh.position.x, mesh.position.y + 1.5* (index + 1), mesh.position.z]}
          style={{
            color: "red",
            fontWeight: "bold",
            backgroundColor: "rgba(255,255,255,0.7)",
            padding: "2px 4px",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          {mesh.Date ? new Date(mesh.Date).toLocaleDateString() : ""}
          <br></br>
            {mesh.Note && <><br />Note: {mesh.Note}</>}
          
        </Html>
      ))}
       
        </Suspense>

       
      </Canvas>


   </div>   
       
</div>
<br></br><br></br><br></br>
 <div
    style={{
      flex: "1",
      overflowY: "auto",
      backgroundColor: "rgba(255,255,255,0.9)",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      height: "100%",
    }}
  >
<h1 style={{fontSize:'36px', color: "#071b38", marginBottom: "20px"}}><b>Medical Report </b></h1><br></br>

{/*<div style={gridContainer1}>*/}
        {filteredStock && filteredStock.length > 0 ? (
          filteredStock.map((stockItem, index) => {
               //const cardRef = useRef();
            const questionText = Array.isArray(stockItem.Question)
              ? stockItem.Question[0]
              : stockItem.Question;
      
               const cardRef = React.createRef();
      
            return (
              <div >
      
                      <div
                key={index}
                ref={cardRef}
                style={cardStyle}
               /* style={{
                  backgroundColor: "white",
                  padding: "20px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  lineHeight: "1.6",
                }}*/
              >
             
             {/* <h1 style={{fontSize:"24px"}}><b>Patient Report</b></h1><br></br>
                <p>
                  
                  <b>Patient name :</b>{stockItem.UserId?.UserName || "This user"}<br></br>
                  <b>Age :</b>{stockItem.UserId?.Age ? ` ${stockItem.UserId.Age} ` : ""} <br></br>
                  <b>Gender :</b>{stockItem.UserId?.Gender ? ` ${stockItem.UserId.Gender}` : ""} <br></br><br></br>
                   
                  {stockItem.UserId?.UserName || "This user"}
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
                </p>
            */}     
               </div>
              {/*} <button
                        onClick={() => handleSavePDF(cardRef, `submission_${index + 1}.pdf`)}
                        style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                      >
                        Save as PDF
                      </button>*/}
                    <br></br>  
              </div>
              
            );
            
          })
        ) : (
          <p style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
            No submissions available
          </p>
          
          
        )}
       
 <form style={formStyle} onSubmit={handleSubmit}>
          <textarea
    name="Suggestion"
    style={{
      ...inputStyle,
      //width: "100%",
      height: "100px",
      resize: "none",
    }}
    placeholder="Enter your suggestion"
    value={inputs.Suggestion}
    onChange={(e) =>
      setInputs({ ...inputs, Suggestion: e.target.value })
    }
  />
  <br />
  
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
            }}
          >
            Submit
          </button>
        </form>

        <form style={formStyle} onSubmit={handleNoteSubmit}>
          <textarea
    name="Note"
    style={{
      ...inputStyle,
      //width: "100%",
      height: "100px",
      resize: "none",
    }}
    placeholder="Enter note"
    value={inputs.Note}
    onChange={(e) =>
      setInputs({ ...inputs, Note: e.target.value })
    }
  />
  <br />
  
          <button
            onClick={handleNoteSubmit}
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
            }}
          >
            Add Note
          </button>
        </form>
       
        
       
        </div>
        
       
</div> 

 

</div>

</div>



);
}


export default Reports





