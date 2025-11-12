import React, { useState, useEffect, useRef } from "react";
import Nav2 from './Nav2';
import Update from './Update';
import Search from './Search';
import Print from './Print';
import Email from './Email';
import Files from './Files';

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";


function Reports(){
    const [newstock, setnewstock] = useState([]);
    const [newuser, setnewuser] = useState([]);
    const navigate = useNavigate();//paste
    const ComponentsRef = useRef();

    const [filteredStock, setFilteredStock] = useState([]);
    const [filteredUser, setFilteredUser] = useState([]);
    const [searchQuery,setSearchQuery] = useState("");
    const [noResults,setNoResults] = useState(false);

    const [severityFilter, setSeverityFilter] = useState("");
const [dateFilter, setDateFilter] = useState("");

const loggedInUserName = localStorage.getItem("username") || "User";

// Styles for the dropdowns
const selectStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px"
};

   

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


    const handleFilter = () => {
    let filtered = newstock;

    // Filter by severity
    if (severityFilter !== "") {
      filtered = filtered.filter(
        item => item.Severity?.toString() === severityFilter
      );
    }

    // Filter by date
    if (dateFilter !== "") {
      const now = new Date();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.Date);
        switch (dateFilter) {
          case "today":
            return itemDate.toDateString() === now.toDateString();
          case "7days":
            return itemDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          case "30days":
            return itemDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          default:
            return true;
        }
      });
    }

    setFilteredStock(filtered);
    setNoResults(filtered.length === 0);
  };
    
    

   

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
    
      
      const handleUserClick = (userId,itemId) => {
    // Navigate to Reports page and pass the selected userId
    navigate(`/UserRecord/${userId}/${itemId}`);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };
      

      const handleSearch = /*async*/ () => {
        const filtered = newstock.filter((item) =>
            item.UserId?.UserName && item.UserId?.UserName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStock(filtered);
        setNoResults(filtered.length === 0);
    };

    

     /* const getStatusColor = (status) => {
        // Log the status value for debugging
        console.log('Status value:', status);
        
        // Convert status to lowercase and trim whitespace
        const normalizedStatus = status?.toLowerCase().trim();
        
        switch(normalizedStatus) {
          case 'available':
            return { backgroundColor: '#dcfce7', color: '#166534' }; // green
          case 'repairing':
            return { backgroundColor: '#fef9c3', color: '#854d0e' }; // yellow
          case 'unavailable':
            return { backgroundColor: '#fee2e2', color: '#991b1b' }; // red
          default:
            return { backgroundColor: '#f3f4f6', color: '#374151' }; // gray
        }
      };

    */
    
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
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      //opacity: 0,
  //transform: "translateY(20px)",
  //animation: "fade-in 0.5s forwards"
    };

    const tableStyle = {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden",
      
      animation: "card-entrance 0.8s var(--ease-out-quart) forwards",
      transform: "translateY(10px)",
    };

    const thStyle = {
      padding: "12px 16px",
      textAlign: "center",
      borderBottom: "1px solid #e2e8f0",
      color: "#021024ff",
      fontWeight: "600",
      fontSize: "16px",
      backgroundColor: "#9bd7dbff"
    };

    const tdStyle = {
      padding: "12px 16px",
      textAlign: "center",
      color: "#334155",
      fontSize: "16px",
      borderBottom: "1px solid #e2e8f0"
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
      fontWeight: 'bold',
      zIndex: 10,   // add this
  position: 'relative' 
    };
    return(
      <div>
        <Nav2/>
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

         

<div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start", marginTop: "36px", padding: "0 20px" }}>
  <div style={{ fontSize: "36px" }}>
    <b>Welcome!</b> {loggedInUserName}<br/>
  </div>
</div>
          <h1 style={{fontSize:'36px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#071b38ff",}}><b>Recent Submissions</b></h1>
          <br></br>

          {/* <div>
  {newuser.map(user => (
    <button key={user._id} onClick={() => handleUserClick(user._id)}>
      {user.UserName}
    </button>
  ))}
</div>*/}

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
        <div>
             <select
            style={selectStyle}
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All Severities</option>
            {[...Array(11).keys()].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <select
            style={selectStyle}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>

          <button style={buttonStyle} onClick={handleFilter}>Apply Filter</button>
        </div>


          {noResults ? (
            <div style={{ 
              textAlign: "center", 
              color: "red",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "20px",
              borderRadius: "8px",
              margin: "20px"
            }}>
              <p>No Stock Found</p>
            </div>
          ) : (
            
            <div style={tableContainerStyle}>
              {/*newstock*/filteredStock && /*newstock*/filteredStock.length > 0 ? (
                <table style={tableStyle}>
                  <thead>
                    <tr  >
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Gender</th>
                      <th style={thStyle}>Age</th>
                      <th style={thStyle}>About Pain</th>
                      <th style={thStyle}>Severity</th>
                      <th style={thStyle}>Pain area</th>
                      <th style={thStyle}>Early Signs</th>
                      <th style={thStyle}>Pain type</th>
                      <th style={thStyle}>when</th>
                      <th style={thStyle}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*newstock*/filteredStock.map((stockItem,index) => (
                      <tr key={stockItem._id} style={{
        opacity: 0,
        transform: "translateY(20px)",
        animation: `fade-in 0.5s forwards`,
        animationDelay: `${index * 0.1}s`
      }}>
                        <td /*style={tdStyle}*/style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }} onClick={() => handleUserClick(stockItem.UserId?._id,stockItem._id)}>{stockItem.UserId?.UserName || "N/A"}</td>
      <td style={tdStyle}>{stockItem.UserId?.Gender || "N/A"}</td>
      <td style={tdStyle}>{stockItem.UserId?.Age || "N/A"}</td>
                         <td>{Array.isArray(stockItem.Question) ? stockItem.Question[0] : stockItem.Question}</td>
                         <td style={tdStyle}>
  {stockItem.Severity != null ? (
    <span style={severityBadgeStyle(stockItem.Severity)}>
      {stockItem.Severity} {/* Optional: add label like Mild/Moderate/Severe */}
    </span>
  ) : (
    "N/A"
  )}
</td>
      {/*<td style={tdStyle}>{stockItem.Severity ?? "N/A"}</td>*/}
      <td style={tdStyle}>{stockItem.BodyPart || "N/A"}</td>
      <td style={tdStyle}>{stockItem.Q1 || "N/A"}</td>
      <td style={tdStyle}>{stockItem.Image1?.label || "N/A"}</td>
      <td style={tdStyle}>{stockItem.Image2?.label || "N/A"}</td>
      <td style={tdStyle}>{stockItem.Date ? new Date(stockItem.Date).toLocaleDateString() : "N/A"}</td>
      
      </tr>
  ))}
                       { /*<td style={tdStyle}>{Array.isArray(stockItem.Question) ? stockItem.Question[0] : stockItem.Question}</td>
                        <td style={tdStyle}>{stockItem.Q1 || "N/A"}</td>
                        <td style={tdStyle}>{stockItem.Image1?.label || "N/A"}</td>
                        <td style={tdStyle}>{stockItem.Image2?.label || "N/A"}</td>
                        <td style={tdStyle}> {stockItem.Date ? new Date(stockItem.Date).toLocaleDateString() : "N/A"}</td>
                     
                      </tr>
                    ))}*/}
                  </tbody>
                </table>
              ) : (
                <p style={{ 
                  textAlign: "center", 
                  color: "#64748b",
                  padding: "20px"
                }}>No stocks available</p>
              )}
            </div>
          )}
         
          <br></br>
          {/* <h2 style={{ textAlign: "center", marginTop: "40px" }}>User Records</h2>*/}
     {/* {newuser.length > 0 ? (
        <table  style={tableContainerStyle}>
          <thead>
            <tr>
              <th>UserName</th>
              <th>Gender</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {newuser.map((user) => (
              <tr key={user._id}>
                <td>{user.UserName}</td>
                <td>{user.Gender}</td>
                <td>{user.Age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center" }}>No users found</p>
      )}*/}
        </div>
      </div>
    );
}


export default Reports