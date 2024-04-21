import React, { useState, useRef } from "react";
import "./Header.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Header = () => {
    const [selectedFileName, setSelectedFileName] = useState("");
    const [extractedText, setExtractedText] = useState("");
    const extractedTextRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleExtractText = async () => {
        const file = fileInputRef.current.files[0];
        if (!file) {
            toast.error("Please select a file to extract text.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/api/v1/extract_text", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setExtractedText(response.data.text);
            setSelectedFileName(""); // Reset selected file name
            toast.success("Text extracted successfully!");
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else if (error.request) {
                // The request was made but no response was received
                toast.error("Network Error: No response received from the server.");
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error("Error: Something went wrong. Please try again later.");
            }
        }
    };

    const copyText = () => {
        const extractedTextElement = extractedTextRef.current;
        if (extractedTextElement && extractedTextElement.value.trim() !== "") {
            extractedTextElement.select();
            document.execCommand("copy");
            toast.success("Text has been copied to the clipboard");
        } else {
            toast.info("There is no text to copy.");
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFileName(file.name); // Set selected file name
    };

    return (
        <div>
            <div className="header-container" id="header">
                <h1>Sinhala Image to Text Converter</h1>
                <p className="header-text">
                    Turn pictures into text with our free image to text converter. Simply
                    upload your photos in our online OCR and extract text from the image
                    with a single click.
                </p>
                <div className="upload-box">
                    <div className="box-content">
                        {selectedFileName && <p>Selected File: {selectedFileName}</p>}
                        <input
                            type="file"
                            id="image_file"
                            name="myfile"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="file-input"
                        />
                        <label htmlFor="image_file" className="custom-file-upload">
                            Upload File
                        </label>
                        <button className="extract-text-button" onClick={handleExtractText}>
                            Extract Text
                        </button>
                    </div>
                </div>
            </div>
            <div className="divider">
                <div className="result-container box-content">
                    <div className="converted-text-container">
                        <textarea
                            id="extracted_text"
                            ref={extractedTextRef}
                            className="form-control"
                            rows="5"
                            style={{ width: '500px' }}
                            readOnly
                            placeholder="Extracted text will appear here"
                            value={extractedText}
                        ></textarea>
                    </div>
                    <div>
                        <button className="copy-text-button" onClick={copyText}>
                            Copy Text
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
