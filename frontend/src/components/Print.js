import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import Nav from './Nav';



function Print() {
    const [newstock, setnewstock] = useState([]);
    const navigate = useNavigate();
    const componentsRef = useRef();

    const [filteredStock, setFilteredStock] = useState([]);
        const [searchQuery,setSearchQuery] = useState("");
        const [noResults,setNoResults] = useState(false);

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get('http://localhost:8080/stock');
                setnewstock(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setnewstock([]);
            }
        };
        fetchHandler();
    }, []);

    const handlePrint = () => {
        const printContent = document.createElement('div');
        printContent.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="text-align: center; margin-bottom: 20px;">Stock Report</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #ddd;">
                    <thead>
                        <tr>
                            <th style="padding: 12px; border: 1px solid #ddd;">ID</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Name</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Category</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Quantity</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${/*newstock*/filteredStock.map(item => `
                            <tr>
                                <td style="padding: 12px; border: 1px solid #ddd;">${item.ID}</td>
                                <td style="padding: 12px; border: 1px solid #ddd;">${item.Name}</td>
                                <td style="padding: 12px; border: 1px solid #ddd;">${item.Category}</td>
                                <td style="padding: 12px; border: 1px solid #ddd;">${item.Quantity}</td>
                                <td style="padding: 12px; border: 1px solid #ddd;">${item.Status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Stock Report</title>
                    <style>
                        @media print {
                            @page {
                                size: A4;
                                margin: 20mm;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                    <script>
                        window.onload = function() {
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            };
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleSearch = async () => {
        const filtered = newstock.filter((stock) =>
            stock.Category && stock.Category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStock(filtered);
        setNoResults(filtered.length === 0);
    };

    const inputStyle = {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        width: "70%",
        fontSize: "16px"
    };
    const buttonStyle = {
        padding: "10px 20px",
        backgroundColor: "#4f46e5",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold"
    };
    return (
        <div>
        <Nav/>
        <br></br>
        <input
                        style={inputStyle}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        name="Search"
                        placeholder="Search stock details"
                        value={searchQuery}
                    />
        <button
                        style={buttonStyle}
                        onClick={handleSearch}
                    >
                        Search
                    </button>
        <div style={{ padding: '20px' ,backgroundColor: '#e0f7fa'}}>
            <div style={{ 
                padding: '20px',
                backgroundColor: 'white',
                marginBottom: '20px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Stock Report</h2>
                {newstock && /*newstock*/filteredStock.length > 0 ? (
                    <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        marginBottom: '20px',
                        border: '1px solid #ddd'
                    }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>ID</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Name</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Category</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Quantity</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/*newstock*/filteredStock.map((stockItem) => (
                                <tr key={stockItem._id}>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{stockItem.ID}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{stockItem.Name}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{stockItem.Category}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{stockItem.Quantity}</td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{stockItem.Status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No stocks available</p>
                )}
            </div>
            <button
                onClick={handlePrint}
                style={{
                    padding: '12px 24px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    display: 'block',
                    margin: '0 auto',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
            >
                Print Report
            </button>
        </div>
        </div>
    );
}

export default Print