import React, { useEffect, useState } from "react";
import Nav from './Nav';
import Update from './Update';
import Search from './Search';
import Print from './Print';
import Login from './Login';
import Reports from "./Reports";
import Register from "./Register";
import Email from './Email'; 
import Upload from './Upload'; 
import axios from "axios";
import { pdfjs } from 'react-pdf';
//import ShowFiles from './ShowFiles';
import { Document, Page } from 'react-pdf';
import { useDropzone } from "react-dropzone";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function Files(){
    const [title,setTitle] = useState("");
    const [file,setFile] = useState(null);
    const [allPdf,setAllPdf] = useState(null);
    const [pdfFile,setPdfFile] = useState(null);
     const [numPages, setNumPages] = useState();
      const [pageNumber, setPageNumber] = useState(1);
    
    

    useEffect(() => {
        getpdf();
    },[]);

    const getpdf = async () =>{
        const result  = await axios.get("http://localhost:8080/files/getFile");
        console.log(result.data.data);
        setAllPdf(result.data.data);
    }

    const submitPdf = async (e) => {
        e.preventDefault();
        if (!file || !title) {
            alert("Please fill in both the title and select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("title",title);
        formData.append("file",file);
        //console.log(title,file)

    

    try{
        const result = await axios.post("http://localhost:8080/files/addFile",
        formData,{
            headers : {'Content-Type': 'multipart/form-data'}
        });
        console.log(result);

        if(result.data.status == 200){
            alert("Uploaded Successfully")
            getpdf();
        }else{
            alert("Upload error");
        }
    }catch(error){
        console.error("Error uploading: " + error.message);
        alert("Error uploading: ");
    }
};

const showPdf = (fileName) => {
    const fileUrl = `http://localhost:8080/files/${fileName}`;
    const extension = fileName.split('.').pop().toLowerCase();
    setPdfFile({ url: fileUrl, type: extension });
    //setPdfFile(fileUrl);
};
/*const showPdf = (file) =>{
    setPdfFile(`http://localhost:8080/files/${file}`);
};*/
const goToPreviousPage = () => {
    if (pageNumber > 1) {
        setPageNumber(pageNumber - 1);
    }
};

const goToNextPage = () => {
    if (pageNumber < numPages) {
        setPageNumber(pageNumber + 1);
    }
};

function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
}

const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
  accept: {
    "application/pdf": [".pdf"],
    "image/*": [".jpg", ".jpeg", ".png"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  },
  multiple: false,
  onDrop: (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]); // Set file to the same state used by your form
    }
  },
});


const containerStyle = {
    backgroundImage: "url('https://pix10.agoda.net/hotelImages/451/45143/45143_16022118510040077786.jpg?s=1024x768')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "Arial, sans-serif",
    margin: "0",
    padding: "0",
    minHeight: "100vh",
    paddingTop: "80px", // Add padding to account for Nav bar
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
};
  

const formStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background for form
    padding: "20px",
    width: "500px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
        gap: "20px",
       padding: "20px"
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

const inputStyle = {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        width: "70%",
        fontSize: "16px"
    };

    return(
        <div style={{ padding: '20px' ,backgroundColor: '#e0f7fa',justifyContent: "center",gap: "20px"}}>
           <form onSubmit={submitPdf} style={formStyle}>
            
            
       
            <label><h1>Upload your Medical Reports here</h1></label>
            <input type = "text" name = "Title" onChange = {(e)=>  setTitle(e.target.value) }required></input><br></br>
            <label><h3>Choose File</h3></label>
            <input type = "file" accept= ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"/*'application/pdf'*/name = "File"  onChange = {(e)=>  setFile(e.target.files[0])} required></input>
            <br></br><br></br>
             <div 
                    {...getRootProps({
                         className: "border-2 border-dashed border-blue-500 mt-4 p-6 rounded-xl text-center cursor-pointer hover:bg-blue-50",
                          })}>
                      <input {...getInputProps()} />
              <p>Drag & drop your document here, or click to select</p>
            </div>

            {file && (
                      <p style={{ marginTop: "10px", fontStyle: "italic" }}>
                        Selected file: {file.name}
                            </p>
                    )}
         {/*  <button type = "submit" style={buttonStyle}>Submit</button>*/}
            </form>
            {/*<div style={formStyle}>
           
                {allPdf && allPdf.length > 0 ? allPdf.map((data) => (
                    <div key={data._id}>
                        <h1>{data.Title}</h1>
                        <button onClick={() => showPdf(data.File)} style={buttonStyle}>Show File</button>
                    </div>
                )) : <p>No files available</p>}
            </div>*/}

            {pdfFile && (
  <div >
    {pdfFile.type === "pdf" ? (
      <div>
        <Document file={pdfFile.url} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber}  />
        </Document>
        <div>
          <button onClick={goToPreviousPage} disabled={pageNumber === 1}>Previous</button>
          <span>Page {pageNumber} of {numPages}</span>
          <button onClick={goToNextPage} disabled={pageNumber === numPages}>Next</button>
        </div>
      </div>
    ) : pdfFile.type === "jpg" || pdfFile.type === "jpeg" || pdfFile.type === "png" ? (
      <img src={pdfFile.url} alt="Uploaded File" style={{ maxWidth: '30%', height: 'auto' }} />
    ) : (
      <a href={pdfFile.url} target="_blank" rel="noopener noreferrer">
        View or Download {pdfFile?.type ? pdfFile.type.toUpperCase() : "File"} 
      </a>
    )}
  </div>
)}

            {/*{pdfFile && (
                <div>
                    <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <div>
                        <button onClick={goToPreviousPage} disabled={pageNumber === 1}>Previous</button>
                        <span>Page {pageNumber} of {numPages}</span>
                        <button onClick={goToNextPage} disabled={pageNumber === numPages}>Next</button>
                    </div>
                </div>
            )}*/}
        </div>
            );

}

export default Files