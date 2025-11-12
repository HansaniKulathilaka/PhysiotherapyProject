import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
//hansani
//H@nsani2001

function Register(){
    
    const history = useNavigate();
    const [inputs,setInputs] = useState({
        UserName:"",
        Password: "",
        Email: "",
        Gender: "",
        Age: "",
        Occupation: "",
        Role:""
    });
    

    const handleChange = (e) => {
        setInputs((prevState)=> ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit =(e) =>{
        e.preventDefault();
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!passwordRegex.test(inputs.Password)) {
        alert("Password must be at least 8 characters with at least one letter, one number, and one special character.");
        return;
    }
        console.log(inputs);
        //navigate after submit
        sendRequest().then(() => history('/Stock'));
    }

    
    const sendRequest = async () => {
        try {
            await axios.post("http://localhost:8080/User/add", {
                UserName: inputs.UserName,
                Password: inputs.Password,
                Email: inputs.Email,
                Gender: inputs.Gender,
                Age: inputs.Age,
                Occupation: inputs.Occupation,
                Role: inputs.Role,
            });
        } catch (error) {
            console.error("Error occurred while adding stock:", error);
            alert("Failed to add stock. Please try again.");
        }
    };

    const navigate = useNavigate();
    const containerStyle = {
        backgroundImage: "url('https://wallpaperaccess.com/full/960592.jpg')", // Background image URL
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
        margin: "0",
        padding: "0",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };
    const formStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background for form
        padding: "20px",
        width: "500px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontSize: '30px',
        fontWeight: 'bold'
    };
    const buttonStyle = {
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: 'black',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
        width:"400px"
    };
    return(
        <div style={containerStyle}>

            <div>
                
           <h1 style={{fontSize:'40px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#f10e0eff",margin: "100px"}}><b>Join with us!<br></br> Find your physiotherapy solutions</b></h1>
            <h1 style={{fontSize:'40px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#1b0707ff",margin: "100px"}}><b>Register Now →</b></h1>
            
            
            <br></br><br></br>
           </div>
            
            <form onSubmit={handleSubmit} style={formStyle}>
            <label><h1>User Name</h1></label>
            <input type = "text" name = "UserName" onChange = {handleChange} value={inputs.UserName || "" }required></input><br></br>
            <label><h1>Email</h1></label>
            <input type = "email" name = "Email" onChange = {handleChange} value={inputs.Email || "" }required></input><br></br>
            
            <label><h1>Password</h1></label>
            <input type = "password" name = "Password"  onChange = {handleChange} value={inputs.Password || ""} required></input>
            <br></br>
            <label><h1>Gender</h1></label>
            <input type = "text" name = "Gender" onChange = {handleChange} value={inputs.Gender || "" }required></input><br></br>
            <label><h1>Age</h1></label>
            <input type = "text" name = "Age" onChange = {handleChange} value={inputs.Age || "" }required></input><br></br>
            <label><h1>Occupation</h1></label>
            <input type = "text" name = "Occupation" onChange = {handleChange} value={inputs.Occupation || "" }required></input><br></br>
            <br></br>
            <label><h1>Role</h1></label>
             <select
         name="Role"
        value={inputs.Role}
        onChange={handleChange}
        style={{ /*...inputStyle,*/ width: "100%" }}
        >
        <option value="I am a patient">I am a patient</option>
        <option value="I am a doctor">I am a doctor</option>
        </select>
        <br/><br/><br></br>

            <button type = "submit" style={buttonStyle}>Submit</button>
            </form>

        </div>
    )
}

export default Register