import React, { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

import Update from './Update';
import Search from './Search';
import Print from './Print';
import Login from './Login';
import Reports from "./Reports";
import Register from "./Register";
//disabled={isSending}

    

function Email() {
   /* const form = useRef();
    const [isSending, setIsSending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  
    // Initialize EmailJS when component mounts
    useEffect(() => {
        emailjs.init('Vn5ynRSU5OKVla2cX');
    }, []);
  
    const sendEmail = (e) => {
      e.preventDefault();
      setIsSending(true);
      setErrorMessage('');
  
      
  
      console.log("Form data:", {
        user_name: form.current.user_name.value,
        user_email: form.current.user_email.value,
        message: form.current.message.value
      });
  
      // Add recipient email address
      const templateParams = {
        to_email: 'hanskulath@gmail.com',
        from_name: form.current.user_name.value,
        from_email: form.current.user_email.value,
        message: form.current.message.value
      };
      
      console.log("Template params:", templateParams);
  
      emailjs
        .send('service_w9syiqj', 'template_divhedo', templateParams, 'Vn5ynRSU5OKVla2cX')
        .then(
          (result) => {
            console.log('SUCCESS!', result);
            alert("Email sent successfully!");
            form.current.reset(); // Clear the form
          },
          (error) => {
            console.log('FAILED...', error);
            setErrorMessage(`Failed to send email: ${error.text || 'Unknown error'}`);
            alert(`Email not sent: ${error.text || 'Unknown error'}`);
          },
        )
        .finally(() => {
          setIsSending(false);
        });
    };*/
    const form = useRef();

    const sendEmail = (e) => {
      e.preventDefault();
  
      emailjs
        .sendForm('service_w9syiqj', 'template_divhedo', form.current, 'Vn5ynRSU5OKVla2cX')
        .then(
          () => {
            console.log('SUCCESS!');
            alert("success")
          },
          (error) => {
            console.log('FAILED...', error.text);
            alert("Email not sent")
          },
        );
    };

    const containerStyle = {
        padding: '20px',
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        
    };

    const inputStyle = {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px',
        //width:"100%"
    };

    const buttonStyle = {
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
    };

    const errorStyle = {
        color: 'red',
        marginTop: '10px'
    };
  
    return (
        <div style={containerStyle}>
            
           {/*} {errorMessage && <div style={errorStyle}>{errorMessage}</div>}*/}
            <form ref={form} onSubmit={sendEmail} style={formStyle}>

              <div style={{fontSize:"20px"}}>   <img src="https://icons.veryicon.com/png/Application/Mavrick/Mail.png" alt="Email Us" /*width="300"*/
                          style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}/>Email Us  </div>  <br></br>
                <div>
                    <label htmlFor="user_name">Name </label>
                    <input 
                        type="text" 
                        name="user_name" 
                        id="user_name" 
                        style={inputStyle}
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="user_email">Email  </label>
                    <input 
                        type="email" 
                        name="user_email" 
                        id="user_email" 
                        style={inputStyle}
                        required 
                         defaultValue="hanskulath@gmail.com"  
                      readOnly  
                    />
                </div>
                <div>
                    <label htmlFor="message">Message  </label>
                    <textarea 
                        name="message" 
                        id="message" 
                        style={{...inputStyle, minHeight: '100px'}}
                        required 
                    />
                </div>
                <button 
                    type="submit" 
                    style={buttonStyle}
                    
                >Send
                    {/*{isSending ? 'Sending...' : 'Send Email'}*/}
                </button>
            </form>
        </div>
    );
}

export default Email;