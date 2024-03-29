import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import './App.css';

function DocQueryComponent() {
    const [file, setFile] = useState(null);
    const [question, setQuestion] = useState('');
    const [Error, setError] = useState('');
    const [resQuestion, setresQuestion] = useState('');
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [DataArray, setDataArray] = useState([]);


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile.name);
    };
    const handleCopyToChailboard = (content) => {
        const data = content?.answer
        navigator.clipboard.writeText(data)
            .then(() => {
                console.log('data copied to clipboard successfully:', data);
                // You can add additional logic here, such as showing a success message
            })
            .catch((error) => {
                console.error('Unable to copy data to clipboard:', error);
                // You can add additional logic here, such as showing an error message
            });

    }
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
        if (data.answer && data.question) {
            setDataArray((priv) => ([...priv, data]))
            setLoading(false);
            setError('')
            setQuestion('')
            window.scrollTo({
                top: document.documentElement.scrollHeight - window.innerHeight + 30,
                behavior: 'smooth' // You can change this to 'auto' for instant scroll
            });
        } else {
            setError(data.error)
            setLoading(false);
            setQuestion('')

        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <div style={{ marginBottom: "80px", position: "relative" }}>
                    <div className='stickyhedear' >
                        <div>
                            <h1>Upload PDF or JPEG files and get answers to your questions</h1>
                            <p style={{ fontWeight: "bold", fontSize: '16px' }}>Simply choose a file, enter your question, and click submit to get the answer!</p>
                        </div>
                        <div className="file-input-container">
                            <label className='inputhover' htmlFor="fileInput">Select File</label>
                            <input className='inputhover' type="file" id="fileInput" onChange={handleFileChange} />
                        </div>
                        <div id="fileName"> {fileName ? `File Name : ${fileName} ` : null}</div>
                    </div>
                    {
                        DataArray.length > 0 ?
                            DataArray.map((item) => {
                                return (
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                        <div style={{ backgroundColor: "white", width: "70%", padding: "20px", borderRadius: "10px" }}>
                                            <div className="question-display">{item?.question} </div>
                                            <div className="answer-display" > <span onClick={() => handleCopyToChailboard(item)} style={{ position: "absolute", right: "10px", top: "-20px", color: "black", fontSize: "14px", cursor: "pointer", }}>Copy</span> <span> {item?.answer} </span></div>
                                        </div>
                                    </div>)
                            }) : null
                    }
                </div>
                <form id="uploadForm" onSubmit={handleSubmit}>

                    {/* <label style={{fontWeight:"bold",fontSize:"16px"}}>Question : </label> */}
                    <div style={{ display: "flex", justifyContent: "center" }} >
                        <div style={{ width: "100%", backgroundColor: "black", padding: "10px 0px" }} >
                            <div >
                                {Error ?
                                    <span style={{ color: "red", fontWeight: "400", fontSize: "18px" }}>Error : {Error}</span>
                                    : null}
                            </div>
                            <input className='input' type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter your question" />
                            <button disabled={loading} type="submit " className='submit'><div style={{ display: "flex", alignItems: 'center', gap: '10px' }}> {loading ? 'Submit' : "Submit"} <div className="loader" style={{ display: loading ? 'block' : 'none' }}></div> </div></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DocQueryComponent;
