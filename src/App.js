import React, { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FiUpload } from "react-icons/fi";
import { MdContentPaste } from "react-icons/md";

import { MdOutlinePictureAsPdf } from "react-icons/md";


import './App.css';

function DocQueryComponent() {
    const [file, setFile] = useState(null);
    const [question, setQuestion] = useState('');
    const [Error, setError] = useState('');
    const [resQuestion, setresQuestion] = useState('');
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [disable, setdisable] = useState(true);
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
        if (question == '') {
            return
        }
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
            data.timestamp = new Date().getTime();
            console.log('Timestamp added:', data);

            setDataArray((priv) => ([...priv, data]))
            setLoading(false);
            setError('')
            setQuestion('')
            window.scrollTo({
                top: document.documentElement.scrollHeight - window.innerHeight + 30,
                behavior: 'smooth' // You can change this to 'auto' for instant scroll
            });
        } else if (file == null) {
            setError('Please Upload File')
            setLoading(false);
            setQuestion('')

        } else {
            setError(data.error)
            setLoading(false);
            setQuestion('')

        }
    };
    useEffect(() => {
        if (question) {
            setdisable(false)
        }
    }, [question])

    return (
        <div className="container">
            <div className="form-container">
                <div style={{ marginBottom: "50px" }}>
                    <div style={{ position: "relative" }}>
                        <div className='stickyhedear' >
                            {/* <div> */}
                            {/* <h1>InvoiceQA</h1> */}
                            {/* <p style={{ fontWeight: "bold", fontSize: '16px' }}>Simply choose a file, enter your question, and click submit to get the answer!</p> */}
                            {/* </div> */}
                            <div className="file-input-container">
                                <label className='inputhover' htmlFor="fileInput"> <span style={{ fontSize: "40px" }}><MdOutlinePictureAsPdf /></span> <span>{fileName ? ` ${fileName} ` : 'Upload File'}</span> </label>
                                <input className='inputhover' type="file" id="fileInput" onChange={handleFileChange} />
                            </div>

                        </div>
                        {
                            DataArray.length > 0 ?
                                DataArray.map((item) => {
                                    return (
                                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", }}>
                                            <div className='hoveriffect answerArea' >
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <span style={{ textAlign: "left", margin: "10px 0px", color: "#6e6b6b", position: "relative" }}>
                                                        <span> Question </span>  <span className='activeOnhover' style={{ position: "absolute", right: "0px", top: "0px", fontSize: "13px" }} >  {item?.timestamp ? new Date(item.timestamp).toLocaleString() : null} </span>
                                                    </span>
                                                    <div className="question-display">{item?.question} </div>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column" }} className="answer-display" >
                                                    <span style={{ margin: "10px 0px 10px -10px", color: "#6e6b6b", position: "relative" }}>
                                                        <span> Answer </span>  <span className='activeOnhover' style={{ position: "absolute", right: "0px", top: "0px", fontSize: "13px" }} onClick={() => handleCopyToChailboard(item)}> <MdContentPaste /> Copy </span>
                                                    </span>

                                                    {/* <span onClick={() => handleCopyToChailboard(item)} style={{ position: "absolute", right: "10px", top: "-20px", color: "black", fontSize: "14px", cursor: "pointer", }}>Copy</span>  */}
                                                    <div style={{ fontWeight: "bold", padding: '10px 10px 10px 0px' }}> {item?.answer} </div></div>
                                            </div>
                                        </div>)
                                }) : (
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                        <div className='headers'>
                                            <div>
                                                <h1>InvoiceQA</h1>
                                                <p>
                                                    Simply choose a file, enter your question, and click submit to get the answer!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                        }
                    </div>
                    <form id="uploadForm" onSubmit={handleSubmit}>

                        {/* <label style={{fontWeight:"bold",fontSize:"16px"}}>Question : </label> */}
                        <div style={{ display: "flex", justifyContent: "center" }} >
                            <div className='questionArea' >
                                <div >
                                    {Error ?
                                        <span style={{ color: "red", fontWeight: "400", fontSize: "18px" }}>Error : {Error}</span>
                                        : null}
                                </div>
                                <div>
                                    <input className='input' type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter your question" />
                                    <button disabled={loading || disable} type="submit " className='submit'><div style={{ display: "flex", alignItems: 'center', gap: '10px' }}> {loading ? 'Submit' : "Submit"} <div className="loader" style={{ display: loading ? 'block' : 'none' }}></div> </div></button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DocQueryComponent;
