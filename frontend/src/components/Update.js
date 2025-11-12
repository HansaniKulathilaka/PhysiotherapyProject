import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

function Update() {
    const [inputs, setInputs] = useState({ ID: '', Name: '', Category: '', Quantity: '', Status: '' });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/stock/get/${id}`);
                console.log("Fetched data:", response.data);
                
                // Check if the response has a data property
                if (response.data && response.data.data) {
                    setInputs(response.data.data);
                } else {
                    setInputs(response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Stock not found!");
                navigate("/Stock");
            }
        };
        fetchHandler();
    }, [id, navigate]);

    const sendRequest = async () => {
        try {
            console.log("Sending update request with data:", inputs);
            
            const response = await axios.put(`http://localhost:8080/stock/update/${id}`, {
                ID: Number(inputs.ID),
                Name: inputs.Name,
                Category: inputs.Category,
                Quantity: Number(inputs.Quantity),
                Status: inputs.Status,
            });
            
            console.log("Update response:", response);
            
            if (response.status === 200) {
                alert('Stock updated successfully');
                navigate('/Stock', { replace: true }); // Use replace to force a refresh
            }
        } catch (error) {
            console.error("Error occurred while updating stock:", error);
            alert("Failed to update stock. Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to:`, value);
        
        setInputs((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", inputs);
        sendRequest();
    };

    const containerStyle = {
        backgroundImage: "url('https://static1.bigstockphoto.com/2/5/5/large1500/552076.jpg')", // Background image URL
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
        margin: "0",
        padding: "0",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: '30px',
        fontWeight: 'bold'
    };
    const formStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background for form
        padding: "20px",
        width: "500px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    };
    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h1>Update Stock</h1>
                <label><h1>Id</h1></label>
                <input type="number" name="ID" onChange={handleChange} value={inputs.ID || ""} required></input><br></br>
                <label><h1>Name</h1></label>
                <input type="text" name="Name" onChange={handleChange} value={inputs.Name || ""} required></input>
                <br></br>
                <label><h1>Category</h1></label>
                <input type="text" name="Category" onChange={handleChange} value={inputs.Category || ""} required></input>
                <br></br><br></br>
                <label><h1>Quantity</h1></label>
                <input type="number" name="Quantity" onChange={handleChange} value={inputs.Quantity || ""} required></input><br></br>
                <label><h1>Status</h1></label>
                <input 
                    type="text" 
                    name="Status" 
                    onChange={handleChange} 
                    value={inputs.Status || ""} 
                    required
                ></input>
                <br></br><br></br>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Update