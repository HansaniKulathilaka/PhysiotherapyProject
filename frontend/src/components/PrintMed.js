import React, { useState, useEffect, useRef } from "react";
import Nav from './Nav';

import Update from './Update';
import Search from './Search';
import Print from './Print';
import Email from './Email';
import Files from './Files';

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";


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

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get('http://localhost:8080/mediData' , {
                withCredentials: true
            });
                setnewstock(response.data); 
                setFilteredStock(response.data); 
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

        if (!newuser) {
       return <h2>Loading details...</h2>;
    }
    const {UserName,Gender,Age} = newstock;


    
    
    


   

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

      /*const handleSavePDF = async (cardRef, filename = "submission.pdf") => {
  if (!cardRef.current) return;

  // Convert the content to canvas
  const canvas = await html2canvas(cardRef.current, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  // Create a new PDF
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

  // Instead of saving directly, open in new tab for preview
  const pdfBlob = pdf.output("bloburl"); // creates a Blob URL
  window.open(pdfBlob, "_blank"); // opens PDF in new tab
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
      backgroundImage: "url('https://wallpaperaccess.com/full/960592.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
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
  gridTemplateColumns: "1fr 1fr 1fr", // 2 columns
  gap: "20px",
  width: "100%",
};

// Card style
const cardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  lineHeight: "1.6",
  textAlign: "left",
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
            <Nav/>
  <div style={containerStyle}>
  <h1 style={{fontSize:'36px', color: "#071b38", marginBottom: "20px"}}><b>Recent Submissions</b></h1>

  <div style={searchBoxStyle}>
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
       
        <h1 style={{fontSize:"24px"}}><b>Patient Report</b></h1><br></br>
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
          
          </div>
         <button
                  onClick={() => handleSavePDF(cardRef, `submission_${index + 1}.pdf`)}
                  style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Save as PDF
                </button>
              <br></br>  
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

);
}


export default Reports