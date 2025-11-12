import React from "react";
import { useState } from 'react';
import { Document, Page } from 'react-pdf';

function ShowFiles({ pdfFile }) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  if (!pdfFile) {
    return <p>No PDF file selected</p>;  // Display a message if no file is selected
  }

  return (
    <div>
        
      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}

export default ShowFiles