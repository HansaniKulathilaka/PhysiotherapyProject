import React, { useState, useEffect } from "react";
//import React from "react";
import Nav from './Nav';
import Nav2 from './Nav2';
//import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";
//import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";

function Profile() {
  const username = localStorage.getItem("username");
  const gender = localStorage.getItem("gender");
  const age = localStorage.getItem("age");
  const occupation = localStorage.getItem("occupation");
  const role = localStorage.getItem("role");


  const [user, setUser] = useState({
    username: "",
    gender: "",
    age: "",
    occupation: "",
    photo: "", // URL of profile photo
    role:""
  });

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = {
      username: localStorage.getItem("username") || "",
      gender: localStorage.getItem("gender") || "",
      age: localStorage.getItem("age") || "",
      occupation: localStorage.getItem("occupation") || "",
      photo: localStorage.getItem("photo") || "", // optional
      role: localStorage.getItem("role") || "",
    };

    setUser(storedUser);
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUser((prev) => ({ ...prev, photo: reader.result }));
        localStorage.setItem("photo", reader.result); // save for now in localStorage
      };
      reader.readAsDataURL(file);
    }
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

    const cardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  lineHeight: "1.6",
  textAlign: "left",
  fontSize: "24px",
  width:"600px",
  animation: "card-entrance 0.8s var(--ease-out-quart) forwards",  
  position: "relative",
   boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
   gap:"20px"
};

  return (
    <div>
        {user.role === "I am a doctor" ? <Nav2 /> : <Nav />}
        <div style={containerStyle}>
    <div style={{ padding: "36px", textAlign: "center", fontSize: "30px", fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
      <div style={{  fontSize: "50px", fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
      Profile<br></br>
      </div>
      <br></br>
        {/* Profile photo */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <img
          src={user.photo || "https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"}
          alt="Profile"
          style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}
        />
        <br />
        <input type="file" accept="image/*" onChange={handlePhotoChange}  id="fileInput" style={{ display: "none" }} />
         <label
    htmlFor="fileInput"
    style={{
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "#a8c42bff",
      color: "white",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "24px",
      cursor: "pointer",
      border: "2px solid white",
    }}
  >
    +
  </label>
      </div>
      <br></br><br></br>
       <div style={cardStyle}>
      <p  ><strong>Username:</strong> {username}</p>
     </div>
     <br></br>
     <div style={cardStyle}>
      <p ><strong>Gender:</strong> {gender}</p>
     </div>
     <br></br>
     <div style={cardStyle}>
      <p ><strong>Age:</strong> {age}</p>
      </div>
      <br></br>
      <div style={cardStyle}>
      <p ><strong>Occupation:</strong> {occupation}</p>
      </div>
      <br></br>
    </div>
    </div>
    </div>
  );
}

export default Profile;