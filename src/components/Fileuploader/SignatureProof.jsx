import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cloud from "../../assets/cloudimage.svg";
import SessionDialogBox from "../SessionDialogBox";

const SignatureProof = ({
  store,
  baseReq,
  select,
  setOpen,
  getFile,
  setGetFile,
  setPicname,
  setSegmentView,
  setBtn,
  setShowimg,
  showimg,
  setImageShow,
}) => {
  const [highlight, setHighlight] = React.useState(false);
  const [preview, setPreview] = React.useState("");
  const [drop, setDrop] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [naming, setNaming] = useState("");
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  const handleClose = () => {
    setOpen(false);
    setShowimg(false);
    if (!getFile.length == 0) {
      setShowimg(true);
    } else if (getFile == "") {
      setShowimg(false);
    }
  };

  const handleEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    preview === "" && setHighlight(true);
  };

  const handleOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    preview === "" && setHighlight(true);
  };

  const handleLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setHighlight(false);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setHighlight(false);
    setDrop(true);

    const [file] = e.target.files || e.dataTransfer.files;

    uploadFile(file);
    setGetFile(file);
  };

  function uploadFile(file) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = () => {
      // this is the base64 data
      const fileRes = btoa(reader.result);

      setPreview(`data:image/jpg;base64,${fileRes}`);
      setImageShow(`data:image/jpg;base64,${fileRes}`);
    };

    reader.onerror = () => {
      toast.error("There is a problem while uploading...");
    };
  }
  async function onFormSubmit() {
    const formData = new FormData();
    formData.append("UserUccCode", store.userCode);
    formData.append("UserProduct", baseReq.userProduct);
    formData.append("UserIP", baseReq.ip);
    formData.append("UserDevice", baseReq.UserDevice);
    formData.append("UserEmailId", store.userEmail);
    formData.append("UserCode", store.userCode);
    formData.append("UserEmail", store.userEmail);
    formData.append("UserMobile", store.userMobile);
    formData.append("UserName", store.userName);
    formData.append("UserPan", store.userPAN);
    formData.append("UserMobileNumber", store.userMobile);
    formData.append("SegmentProofDoc", getFile);
    formData.append("SegmentProofType", "SIGNATURE");

    const MIN_FILE_SIZE = 1; // 1KB
    const MAX_FILE_SIZE = 3072; // 3MB

    const fileSizeKiloBytes = getFile.size / 1024;

    if (fileSizeKiloBytes < MIN_FILE_SIZE) {
      toast.error("File size is less than minimum limit");
      return;
    }
    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      toast.error("File size is greater than 3MB");
      return;
    }

    setLoading(true);
    setShow(false);
    setBtn(false);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Segment/saveSegmentProof`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.result.flag === 1 && res.data.result.flagMsg) {
        setSegmentView(true);
        toast.success(res.data.result.flagMsg);
        setOpen(false);
        setShowimg(true);
      } else if (res.data.result.flag === 0 && res.data.result.flagMsg) {
        toast.error(res.data.result.flagMsg);
        setOpen(true);
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

      if (e.response && e.response.status !== "") {
        toast.error(e.response.data.result.flagMsg);
      } else {
        toast.error("Something went wrong. Please try again later!");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="signature_upload">
        <div className="cancelled">
          <p>Upload your Signature</p>
        </div>
        <button className="btn_close_fail" onClick={handleClose}>
          X
        </button>
        <div className="cheque">
          <p>Please make sure your signature fit into the box</p>
        </div>
        <div className="upload_files_check">
          <div
            onDragEnter={(e) => handleEnter(e)}
            onDragLeave={(e) => handleLeave(e)}
            onDragOver={(e) => handleOver(e)}
            onDrop={(e) => handleUpload(e)}
            className={`upload${
              highlight ? " is-highlight" : drop ? " is-drop" : ""
            }`}
            style={{
              backgroundImage: getFile ? `url(${preview})` : `url(${Cloud})`,
            }}
          >
            {getFile ? (
              <div className="upload-button">
                <input
                  type="file"
                  className="upload-file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e)}
                />{" "}
              </div>
            ) : (
              <input
                type="file"
                className="upload-file"
                accept="image/*"
                onChange={(e) => handleUpload(e)}
              />
            )}
          </div>
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

export default SignatureProof;
