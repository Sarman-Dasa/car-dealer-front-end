import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import "../../css/fileUpload.css";
import uploadImage from "../../image/file-upload.png";
import { v4 as uuid } from "uuid";
import Emitter from "../../services/emitter";
import notify from "../../services/notify";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit

export default function FileUpload({
  handelFileUpload,
  handelFileRemove,
  title,
  file = [],
  isMultiple = false,
  isInvalid = false,
  showFooter = false,
  errorMessage,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileRef = useRef();
  const uploadFile = () => {
    fileRef.current.click();
  };
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
    
      const newFiles = await Promise.all(
        Array.from(files)
          .filter((file) => {
            if (file.size > MAX_FILE_SIZE_BYTES) {
              notify.warn('Filesize must be 10MB or below');
              return false;
            }
            return true;
          })
          .map(async (file) => {
            const base64URL = await convertFileToBase64(file);
            return {
              id: uuid(),
              url: URL.createObjectURL(file),
              name: file.name,
              image: file, // Include the actual file object if needed
              base64URL: base64URL // Add base64 data URL
            };
          })
      );
      if (isMultiple) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      } else {
        setSelectedFiles(() => [...newFiles]);
      }
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSaveButtonClick = () => {
    handelFileUpload(selectedFiles);
  };

  //Remove File
  const removeImage = (id) => {
    const updatedFiles = selectedFiles.filter((file) => file.id !== id);
    handelFileRemove(id);
    setSelectedFiles(updatedFiles);
  };

  useEffect(() => {
    Emitter.on("CLEAR_FILE_DATA", () => {
      setSelectedFiles([]);
    });

    if (file) {
      setSelectedFiles(file);
    }
    return () => {
      Emitter.off("CLEAR_FILE_DATA");
    };
  }, []);

  useEffect(() => {
    if (!showFooter && selectedFiles.length > 0) {
      // console.log("Selected files:", selectedFiles);
      const files = selectedFiles.filter((obj) => obj.image);
      handelFileUpload(files);
    }
  }, [selectedFiles, showFooter]);

  return (
    <Container className="custome-file-upload">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{title ? title : "Add Images"}</Card.Title>
              <Form.Control
                type="file"
                multiple={isMultiple}
                className="d-none"
                onChange={handleFileChange}
                accept="image/*"
                ref={fileRef}
              />
              <div className="file-upload" onClick={uploadFile}>
                <img src={uploadImage} alt="not found" />
                <p>Browse file to upload </p>
              </div>
              {isInvalid && (
                <span className="text-danger"> {errorMessage} </span>
              )}
            </Card.Body>
            {showFooter && (
              <Card.Footer className="text-muted">
                <button
                  onClick={handleSaveButtonClick}
                  type="button"
                  className="btn btn-primary"
                >
                  Upload
                </button>
              </Card.Footer>
            )}
          </Card>
        </Col>
        {selectedFiles.map((file, index) => (
          <div key={index} className="col-md-3 my-2">
            <Card style={{ width: "18rem", height: "100%" }}>
              <div className="image-container">
                <Card.Img
                  variant="bottom"
                  src={file.url}
                  style={{ height: "200px", objectFit: "inherit" }}
                />

                <button
                  variant="danger"
                  type="button"
                  onClick={() => removeImage(file.id)}
                  className="deleteBtn"
                  style={{
                    position: "absolute",
                    top: "30%",
                    width: "100%",
                  }}
                >
                  Delete
                </button>
              </div>
              <Card.Body>
                <Card.Title className="h6">{file.name}</Card.Title>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Row>
    </Container>
  );
}
