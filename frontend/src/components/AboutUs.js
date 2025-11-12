import React, { useState, useEffect } from "react";
//import React from "react";
import Nav from './Nav';
import Nav2 from './Nav2';


function About() {
  
  /* const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user info (saved during login)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);*/

  const [user, setUser] = useState({
  username: "",
  gender: "",
  age: "",
  occupation: "",
  role: ""
});

useEffect(() => {
  const storedUser = {
    username: localStorage.getItem("username") || "",
    gender: localStorage.getItem("gender") || "",
    age: localStorage.getItem("age") || "",
    occupation: localStorage.getItem("occupation") || "",
    role: localStorage.getItem("role") || "",
  };
  setUser(storedUser);
}, []);

  const handleSendReport = () =>{
          const phoneNumber = "";
          const message = `Enter your message here and send`
          const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

          window.open(WhatsAppUrl,"_blank");
      }

      const handlePhoneCall = () => {
  const phoneNumber = ""; // include country code
  const callUrl = `tel:${phoneNumber}`;
  window.open(callUrl, "_self");
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

    const buttonStyle = {
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        width:"400px"
    };

    const contactGridStyle = {
  display: 'flex',
   gridTemplateColumns: "1fr 1fr 1fr ", // 2 columns
  //gap: "20px",
  width: "100%",
  justifyContent: 'center',
  gap: '20px', 
  marginTop: '100px',
  flexWrap: 'wrap', 
  //maxWidth: '1200px',
};

const contactItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
};

const containerStyle1 = {
        backgroundColor: "rgba(173, 209, 223, 0.58)",
        padding: "40px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        width: "80%",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        alignItems:"center",
        //margin: "20px" ,// Add margin between stock items
        fontSize: '24px',
        margin: "0 auto",
        //fontWeight: 'bold'
        
    };

  return (
    <div>
        {/*{user?.role === "I am a doctor" ? <Nav2 /> : <Nav /> }*/}
        {user ? (
  user.role?.toLowerCase().trim() === "i am a doctor" ? <Nav2 /> : <Nav />
) : <Nav />}
        <div style={containerStyle}>
    
    <div>
        <h1 style={{fontSize:'40px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#071b38ff",}}><b>About Us</b></h1>
          <br></br>
          <div style={containerStyle1}>
          <div style={{fontSize:'24px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#071b38ff", textAlign:"left", margin:"20px",padding:"60px"}} >
           <b> How else would you ensure patients are improving when they are not in the clinic? </b><br></br>
<p>Improve the quality of care and pain management by helping patients report and communicate progress </p><br></br>


<b>COMMUNICATE
SIMPLY
❤️It only takes 30 seconds.</b><br></br>

 

<p>Simple drawings about the quality, intensity, and location of pain or discomfort are guided by our scientifically validated body avatars.  Receive real-time precision reports showing a detailed expression of a patients' pain experience.</p>
<br></br>
<b>DOCUMENT
EASILY</b><br></br>
<p>Pain and discomfort can change dramatically within or across days. Reporting these changes no longer needs to be challenging or reliant on a patients' recall.</p>

 

<p>Patients can easily communicate on a daily, weekly, or monthly basis.  Stay connected with patients and gain the insight needed to provide tailored care.</p>

<br></br>

<b>SAVE TIME</b><br></br>
<p>✔️Quickly review a patients' history and progress using our visualization timeline. </p>

 

<p>✔️Receive easy to understand metrics describing changes in pain or discomfort status.</p>

 

<p>✔️Show patients their progress and use the tool to motivate and educate. </p>
<br></br>
<b>Connect with patients.</b>
​<br></br>
<b>Offer tailored treatment and care.</b>
​<br></br>
<b>Improve patient satisfaction and trust.</b>
{/*<b>Empowering Recovery Through Innovation</b>

<p>Welcome to PhysioTrack, a cutting-edge digital platform designed to bridge the gap between patients and physiotherapists through the power of technology.
Our mission is simple — to make pain assessment, tracking, and treatment more accurate, visual, and personalized.</p>
<br></br>
<b>💡 Our Vision</b>

<p>To revolutionize the physiotherapy experience by combining 3D visualization, 
    data-driven insights, and patient-centered care, enabling better understanding, faster recovery, and improved communication between patients and therapists.</p>
<br></br>
<b>🩺 What We Do</b>

<p>At PhysioTrack, we help patients and physiotherapists collaborate more effectively through an interactive 3D human model and smart pain-tracking tools.</p>

<p>🧍‍♀️ For Patients:</p>
<p>Easily mark and describe pain points on a 3D body model, answer guided questions about symptoms, and share your pain history with your physiotherapist — all from one place.</p>

<p>🩻 For Physiotherapists:</p>
<p>Access detailed pain reports, visualize patient progress over time, and make more informed treatment decisions with 3D data visualization and history tracking.</p>
<br></br>
<b>🌍 Why Choose Us</b>

<p>✔️ User-friendly Interface – Simple, intuitive, and accessible for all ages.</p>

<p>✔️ 3D Pain Mapping – Precise and visual communication of pain areas.</p>

<p>✔️ Comprehensive Patient Records – Easy access to previous sessions and history.</p>

<p>✔️ Enhanced Collaboration – Strengthens the connection between patients and therapists.</p>
<br></br>
<b>❤️ Our Commitment</b>

<p>We believe that understanding pain is the first step to healing.
Our goal is to make every physiotherapy journey personalized, transparent, and data-informed, helping both patients and professionals achieve better outcomes.</p>

<b>🤝 Join Us in Redefining Physiotherapy</b>

<p>Whether you’re a patient seeking better pain management or a physiotherapist looking for smarter tools, [Your Website Name] is here to support you — every step of the way.</p>*/}
    </div>
     </div>
<div style={contactGridStyle}>
    
<div style={contactItemStyle}>
<img src="https://png.pngtree.com/png-clipart/20190516/original/pngtree-whatsapp-icon-png-image_3584845.jpg" alt="Whatsapp" /*width="300"*/ style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}/>
    <button 
              onClick={handleSendReport} 
              type="submit" 
              style={buttonStyle}
            >
              WhatsApp
            </button>
            </div>
            <div style={contactItemStyle}>
               
            <img src="https://static.vecteezy.com/system/resources/previews/002/079/984/original/phone-icon-flat-style-isolated-on-grey-background-telephone-symbol-call-illustration-sign-for-web-and-mobile-app-free-vector.jpg" alt="Call Us" /*width="300"*/
            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}/>
            <button style={buttonStyle} onClick={handlePhoneCall}>Call</button>
           
            </div>
       </div>     
    </div>
    </div>
    </div>
  );
}

export default About;