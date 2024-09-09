/* eslint-disable no-undef */
import React, { useState } from "react";
import axios from "axios";
import SessionDialogBox from "../SessionDialogBox";

const Upload = () => {
  const [highlight, setHighlight] = React.useState(false);
  const [preview, setPreview] = React.useState("");
  const [drop, setDrop] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  const handleEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("enter!");

    preview === "" && setHighlight(true);
  };

  const handleOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("over!");

    preview === "" && setHighlight(true);
  };

  const handleLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("leave!");
    setHighlight(false);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("drop!");
    setHighlight(false);
    setDrop(true);

    const [file] = e.target.files || e.dataTransfer.files;

    uploadFile(file);
  };

  function uploadFile(file) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = () => {
      // this is the base64 data
      const fileRes = btoa(reader.result);
      console.log(`data:image/jpg;base64,${fileRes}`);
      setPreview(`data:image/jpg;base64,${fileRes}`);
    };

    reader.onerror = () => {
      console.log("There is a problem while uploading...");
    };
  }

  async function onFormSubmit() {
    const userData_Segment = {
      UserUccCode: store.userCode,
      UserProduct: baseReq.userProduct,
      UserIP: "17.0.16.201",
      UserDevice: "Web",
      UserEmailId: store.userEmail,
      UserCode: store.userCode,
      UserMobileNumber: store.userMobile,
      BankProofType: "Cheque",
      BankDocument: preview,
    };

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Bank/savebankDocument`,
        userData_Segment,
        {
          withCredentials: true,
        }
      );

      console.log(res);
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      if (res.data.result.flag == 1) {
      } else if (res.data.result.flag == 0) {
      }
    } catch (e) {
      if (e.response.status != "") toast.error(e.response.data.result.flagMsg);
      else toast.error(" Some thing Went wrong try after a while! ");
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }

  return (
    <>
      <div className="signature_upload">
        <h1>New Bank Details</h1>
        <div className="cancelled">
          <p>Upload Canclled Cheque</p>
        </div>
        <div className="cheque">
          <p>
            Upload a copy of the cancelled cheque which shows your Name, Bank
            account number and IFSC code
          </p>
        </div>
        <div
          onDragEnter={(e) => handleEnter(e)}
          onDragLeave={(e) => handleLeave(e)}
          onDragOver={(e) => handleOver(e)}
          onDrop={(e) => handleUpload(e)}
          className={`upload${
            highlight ? " is-highlight" : drop ? " is-drop" : ""
          }`}
          style={{ backgroundImage: `url(${preview})` }}
        >
          <form class="my-form">
            <p>Drag and Drop image here</p>
            <div className="upload-button">
              <input
                type="file"
                className="upload-file"
                accept="image/*"
                onChange={(e) => handleUpload(e)}
              />

              <p>Browse Here</p>
            </div>
          </form>
        </div>
        <div className="active_upload">
          <button
            className="button"
            onClick={(e) => onFormSubmit(e)}
            disabled={loading}
          >
            {loading ? "Please wait" : "Confirm"}
          </button>
        </div>
        {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
      </div>
    </>
  );
};

export default Upload;
