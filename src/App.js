import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import './App.css';

function DocQueryComponent() {
    const [file, setFile] = useState(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [fileName, setFileName] = useState('File Name');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('question', question);

        const response = await fetch('http://localhost:5000/query', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        setAnswer(data.answer);
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="form-container">
                <div>
                    <h1>Upload PDF or JPEG files and get answers to your questions</h1>
                    <p style={{fontWeight:"bold",fontSize:'16px'}}>Simply choose a file, enter your question, and click submit to get the answer!</p>
                </div>
                <form id="uploadForm" onSubmit={handleSubmit}>
                    <div className="file-input-container">
                        <label className='inputhover' htmlFor="fileInput">Choose File</label>
                        <input className='inputhover' type="file" id="fileInput" onChange={handleFileChange} />
                    </div>
                    <div id="fileName">File: {fileName}</div>
                    <label style={{fontWeight:"bold",fontSize:"16px"}}>Question : </label>
                    <input className='input' type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter your question" />
                    <button disabled={loading} type="submit " className='submit'><div style={{ display: "flex", alignItems: 'center', gap: '10px' }}> {loading ? 'Submit' : "Submit"} <div className="loader" style={{ display: loading ? 'block' : 'none' }}></div> </div></button>
                </form>
                <div className="answer-display" style={{ display: answer ? 'block' : 'none' }}>Answer: {answer}</div>
            </div>
        </div>
    );
}

export default DocQueryComponent;
