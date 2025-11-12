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


function Reports(){
    const [newstock, setnewstock] = useState([]);
    const navigate = useNavigate();//paste
    const ComponentsRef = useRef();

    const [filteredStock, setFilteredStock] = useState([]);
    const [searchQuery,setSearchQuery] = useState("");
    const [noResults,setNoResults] = useState(false);

    const handlePrint = useReactToPrint({
        content: () => ComponentsRef.current,
        documentTitle: "Stock Report",
        onBeforeGetContent: () =>
            new Promise((resolve) => {
              setTimeout(resolve, 500); 
              resolve();
            }),
        onAfterPrint:() => alert("Report successfully download"),
    })

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get('http://localhost:8080/stock');
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
    
    
    if (!newstock) {
       return <h2>Loading stock details...</h2>;
    }
    const {_id,ID,Name,Category,Quantity,Status} = newstock; 

    
    

    const deleteHandler = async (_id) => {
        try {
            await axios.delete(`http://localhost:8080/stock/delete/${_id}`);
            alert("Deleted successfully!");
            navigate("/DisplayDetails");
        } catch (error) {
            console.error("Error deleting stock:", error);
        }
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
    
      
      const handleSendReport = () =>{
          const phoneNumber = "+94775484476";
          const message = `Check new availability of stock - - Total Items: ${newstock.length}`
          const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

          window.open(WhatsAppUrl,"_blank");
      }

    const handleSearch = async () => {
        const data = await fetchStock();
        const filtered = data.filter((stock) =>
          Object.values(stock).some((val) =>
            val.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        setnewstock(filtered);
        setNoResults(filtered.length === 0);
      };

      const getStatusColor = (status) => {
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

    /*const handleSearch = () =>{
        fetchHandler().then((data)=>{
            const filteredStock = data.users.filter((stock)=>
            Object.values(stock).some((field)=>
                field.toString().toLowerCase().includes(searchQuery.toLowerCase())
            ))
            setnewstock(filteredStock);
            setNoResults(filteredStock.length === 0);
        })
    }*/
    
    const containerStyle = {
      backgroundImage: "url('https://pix8.agoda.net/hotelImages/2289889/0/69df83d5ca8c6e64ebdcf4f87974a9e0.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
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

    const statusBadgeStyle = (status) => ({
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
    });

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
    return(
      <div>
        <Nav/>
        <div style={containerStyle}>
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
              {newstock && newstock.length > 0 ? (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Quantity</th>
                      <th style={thStyle}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newstock.map((stockItem) => (
                      <tr key={stockItem._id}>
                        <td style={tdStyle}>{stockItem.ID}</td>
                        <td style={tdStyle}>{stockItem.Name}</td>
                        <td style={tdStyle}>{stockItem.Category}</td>
                        <td style={tdStyle}>{stockItem.Quantity}</td>
                        <td style={tdStyle}>
                          <span style={statusBadgeStyle(stockItem.Status)}>
                            {stockItem.Status}
                          </span>
                        </td>
                      </tr>
                    ))}
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
          <div >
            <button 
              onClick={handleSendReport} 
              type="submit" 
              style={buttonStyle}
            >
              WhatsApp
            </button>
            <Email/>
          </div>
          <br></br>
          <div>
          <Files/>
          </div>
        </div>
      </div>
    );
}


export default Reports