import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import "../../css/fileUpload.css";
import uploadImage from "../../image/file-upload.png";
import { v4 as uuid } from "uuid";
import Emitter from "../../services/emitter";
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
      const newFiles = Array.from(files)
        .filter((file) => {
          if (file.size > MAX_FILE_SIZE_BYTES) {
            return false;
          }
          return true;
        })
        .map((file) => ({
          id: uuid(),
          url: URL.createObjectURL(file),
          name: file.name,
          image: file, // Include the actual file object if needed
        }));
      if (isMultiple) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      } else {
        setSelectedFiles(() => [...newFiles]);
      }
    }
  };

  const handleSaveButtonClick = () => {
    handelFileUpload(selectedFiles);
  };

  //Remove File
  const removeImage = (id) => {
    let index = selectedFiles.findIndex((item) => item.id === id);
    let updatedFiles = [...selectedFiles];
    let file = updatedFiles.splice(index, 1);

    handelFileRemove(file);
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
      console.log("Selected files:", selectedFiles);
      handelFileUpload(selectedFiles);
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
           {showFooter && <Card.Footer className="text-muted">
              <button
                onClick={handleSaveButtonClick}
                type="button"
                className="btn btn-primary"
              >
                Upload
              </button>
            </Card.Footer>}
          </Card>
        </Col>
        {selectedFiles.map((file, index) => (
          <div key={index} className="col-md-3 my-2">
            <Card style={{ width: "18rem", height: "100%" }}>
              <Card.Img
                variant="bottom"
                src={file.url}
                style={{ height: "200px", objectFit: "contain" }}
              />
              <Card.Body>
                <Card.Title>{file.name}</Card.Title>
              </Card.Body>
              <Card.Footer className="text-muted">
                <button type="button" onClick={() => removeImage(file.id)}>
                  Delete
                </button>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </Row>
    </Container>
  );
}
