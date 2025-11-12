import React from "react";
import {useNavigate, Link } from 'react-router-dom';
import axios from "axios"; 

function Nav() {

    const navigate = useNavigate();

     const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/user/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    localStorage.removeItem("isLoggedIn");
    alert("Logout Success");
    navigate("/login");
  };

  const buttonStyle = {
    backgroundColor: "blue",
    color: "#cec2c3ff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

    const navStyle = {
        //backgroundColor: '#4f46e5',
        backgroundColor: 'white',
        padding: '1rem',
        position: "relative",
        
   boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        //boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    };

    const ulStyle = {
        display: 'flex',
        justifyContent: 'center',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        gap: '2rem'
    };

    const linkStyle = {
        color: 'black',
        textDecoration: 'none',
        fontWeight: '600',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        transition: 'all 0.3s ease'
    };

    const linkHoverStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fbbf24'
    };

     const bodyParts = [
    "neck",
    "shoulder",
    "knee",
    "left_leg",
    "right_leg",
    "wrist_hand",
    "hip",
    "elbow",
    "forearm",
    "upper_arm",
    "lower_back",
    "upper_back",
    "ankle_foot",
    "pelvis",
    "thighs_hamstrings",
    "calves",
    "face_head",
  ];

    return (
        <div>
            <nav style={navStyle}>
                <ul style={ulStyle}>
                     <li>
                        <Link 
                            to="/DashboardU" 
                            style={linkStyle}
                            onMouseEnter={(e) => e.target.style.backgroundColor = linkHoverStyle.backgroundColor}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/ThreeDModel" 
                            style={linkStyle}
                            onMouseEnter={(e) => e.target.style.backgroundColor = linkHoverStyle.backgroundColor}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            Records
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/AboutUs" 
                            style={linkStyle}
                            onMouseEnter={(e) => e.target.style.backgroundColor = linkHoverStyle.backgroundColor}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                           About Us
                        </Link>
                    </li>
                    
                   {/*<li>
                        <Link 
                            to="/Stock" 
                            style={linkStyle}
                            onMouseEnter={(e) => e.target.style.backgroundColor = linkHoverStyle.backgroundColor}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            page2
                        </Link>
                    </li>
                    
                    <li>
                        <Link
                            to="/MediQAdd/neck"   // Default body part
                             style={linkStyle}
                             onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = linkHoverStyle.backgroundColor)
                                    }
                         onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                         >
    page4
  </Link>
                        
                    </li>
                   
                    <li>
                        <Link 
                            to="/PatientData" 
                            style={linkStyle}
                            onMouseEnter={(e) => e.target.style.backgroundColor = linkHoverStyle.backgroundColor}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            page6
                        </Link>
                    </li>*/}
                     <button
          style={buttonStyle}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "#fbbf24")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "white")
          }
          onClick={handleLogout}
        >
          Logout
        </button>
       {/*<div style={{ position: "absolute", right: "1rem", top: "1rem" }}>*/}
  <button style={buttonStyle}
   
    onClick={() => navigate("/profile")}
  >
    Profile
  </button>
                
                </ul>
               
 
            </nav>
        </div>
    );
}

export default Nav;