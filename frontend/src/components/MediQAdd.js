import React, { useState , useEffect} from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import axios from "axios";
import Nav2 from './Nav2';

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

const partMap = {
  
  left_forearm: "forearm",
  right_forearm: "forearm",
  left_thigh_hamstring:"thighs_hamstrings",
  
};


function MediQAdd(){

     const {sel } = useParams(); // e.g. /questions/neck → partName = "neck"
     const [selectedPart, setSelectedPart] = useState(sel ||"");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

   useEffect(() => {
    if(sel) setSelectedPart(sel);
  }, [sel]);
  // Fetch questions from backend
  useEffect(() => {
    if (!selectedPart) return;
    axios
    
      .get(`http://localhost:8080/mediQ`)
      .then((res) => {
  const filtered = res.data.filter((q) => q.bodyPart === selectedPart);
  setQuestions(filtered);
})
      .catch((err) => console.error(err));
  }, [selectedPart]);

  // Add question
  const addQuestion = async () => {
    await axios.post("http://localhost:8080/mediQ/add", {
  bodyPart: selectedPart,
  Question: newQuestion,
});
// Re-fetch
const refreshed = await axios.get("http://localhost:8080/mediQ/");
setQuestions(refreshed.data.filter((q) => q.bodyPart === selectedPart));
setNewQuestion("");
    /*if (!newQuestion.trim()) return;
    try {
      const res = await axios.post("http://localhost:8080/mediQ/add", {
        bodyPart: partName,
        Question: newQuestion,
      });
      setQuestions([...questions, res.data]);
      setNewQuestion("");
    } catch (err) {
      console.error(err);
    }*/
  };

  // Update question
  const updateQuestion = async (id, newText) => {
    try {
      await axios.put(`http://localhost:8080/mediQ/update/${id}`, {
        Question: newText,
      });
      setQuestions(
        questions.map((q) =>
          q._id === id ? { ...q, Question: newText } : q
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete question
  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/mediQ/delete/${id}`);
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const containerStyle = {
    //backgroundColor: "#e6f2ff",
        backgroundImage: "url('https://img.freepik.com/premium-photo/medical-related-background-with-doctors-students_1045156-37875.jpg')", // Background image URL
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        //fontFamily: "Arial, sans-serif",
        margin: "0",
        padding: "0",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: '30px',
        //fontWeight: 'bold'
    };

    const formStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background for form
        padding: "20px",
        width: "600px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    };

    const buttonStyle = {
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: 'black',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
    };

    const buttonStyle1 = {
        padding: '10px 15px',
        backgroundColor: '#d4482fff',
        color: 'black',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
    };
    return(
        <div>
            <Nav2/>
        <div style={containerStyle}>
            <form  style={formStyle}>
           <div style={{ padding: "20px" }}>
            <h2>Select Body Part:</h2>
        <select
          value={selectedPart}
          onChange={(e) => setSelectedPart(e.target.value)}
          style={{ padding: "8px", fontSize: "18px" }}
        >
          <option value="">-- Choose a body part --</option>
          {bodyParts.map((part) => (
            <option key={part} value={part}>
              {part.replace("_", " ")}
            </option>
          ))}
        </select>
      <h2>Questions about {selectedPart}</h2>

      {/* Add Question */}
      <input
        type="text"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        placeholder="enter new question"
        style={{ padding: "8px", width: "300px",borderRadius: "5px",
        border: "1px solid #ccc", fontSize: "18px"}}
      />
      <br></br>
      <button 
      onClick={(e) => {
    e.preventDefault(); // prevent form submission reload
    addQuestion();
  }}
  style={buttonStyle}
  //style={{ marginLeft: "10px" }}
      /*onClick={addQuestion} style={{ marginLeft: "10px" }}*/>
        Add
      </button>

      <br></br>
     
      <ul style={{ marginTop: "20px" }}>
        {questions.map((q) => (
          <li key={q._id}>
            <input
              type="text"
              defaultValue={q.Question}
              onChange={(e) => (q.newText = e.target.value)}
             // onBlur={(e) => updateQuestion(q._id, e.target.value)}
              style={{ width: "300px", padding: "5px" ,borderRadius: "5px",
        border: "1px solid #ccc", fontSize: "18px"}}
            />
            <br></br>
             <button
        onClick={() => updateQuestion(q._id, q.newText || q.Question)}
        //style={{ marginLeft: "10px", color: "blue" }}
        style={buttonStyle}
      >
        Update
      </button>
            
           <t></t>
            <button
              onClick={() => deleteQuestion(q._id)}
              //style={{ marginLeft: "10px", color: "red" }}
              style={buttonStyle1}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
           
</form>

<form>
  <p></p>
</form>
        </div>
        </div>
    )
}

export default MediQAdd