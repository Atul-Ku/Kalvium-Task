import React, { useState, useEffect } from 'react';
import './App.css';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { io } from 'socket.io-client';
import '@react-pdf-viewer/core/lib/styles/index.css';

const socket = io('http://localhost:3000');

function App() {
  const [page, setPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Receive the current page from server on initial load and updates
    socket.on('page-update', (newPage) => {
      setPage(newPage);
    });
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (isAdmin) {
      console.log('newPage', newPage);
      socket.emit('change-page', newPage);
    }
  };

  return (
    <div className="App">
      <h1>PDF Sync Viewer</h1>
      <button onClick={() => setIsAdmin(!isAdmin)}>
        Toggle Admin ({isAdmin ? 'ON' : 'OFF'})
      </button>
      <div className="viewer-container">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl="/sample.pdf"
            initialPage={page - 1}
            onPageChange={(e) => handlePageChange(e.currentPage + 1)}
          />
        </Worker>
      </div>
    </div>

  );
}

export default App;
