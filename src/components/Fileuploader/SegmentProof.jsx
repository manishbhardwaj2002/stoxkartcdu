import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PDF from "../../assets/file-pdf.png";
import Cloud from "../../assets/cloudimage.svg";
import SessionDialogBox from "../SessionDialogBox";

const SegmentProof = ({
  store,
  baseReq,
  add,
  setOpen,
  setPicname,
  imageFile,
  setImageFile,
  setProofView,
  setBtn,
  setShowimg,
  showimg,
}) => {
  const [highlight, setHighlight] = React.useState(false);
  const [preview, setPreview] = React.useState("");
  const [drop, setDrop] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [naming, setNaming] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ip, setIP] = useState("");
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");

    setIP(res.data.IPv4);
  };

  const handleClose = () => {
    setOpen(false);
    if (!imageFile.length == 0) {
      setShowimg(true);
      setBtn(false);
    } else setImageFile("");
    setBtn(false);
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
    setImageFile(file);
  };

  function uploadFile(file) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = () => {
      // this is the base64 data
      const fileRes = btoa(reader.result);

      setPicname(`data:image/jpg;base64,${fileRes}`);
      setPreview(`data:image/jpg;base64,${fileRes}`);
    };

    reader.onerror = () => {
      toast.error("There is a problem while uploading...");
    };
  }

  async function onFormSubmit() {
    const formData = new FormData();
    formData.append("UserUccCode", store.userCode);
    formData.append("UserProduct", "CDU");
    formData.append("UserIP", ip);
    formData.append("UserDevice", "Mobile");
    formData.append("UserEmailId", store.userEmail);
    formData.append("UserCode", store.userCode);
    formData.append("UserMobileNumber", store.userMobile);
    formData.append("SegmentProofType", add);
    formData.append("SegmentProofDoc", imageFile);

    const MIN_FILE_SIZE = 1; // 1KB
    const MAX_FILE_SIZE = 3072; // 3MB

    const fileSizeKiloBytes = imageFile.size / 1024;

    if (fileSizeKiloBytes < MIN_FILE_SIZE) {
      toast.error("File size is less than minimum limit");
      return;
    }
    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      toast.error("File size is greater than 3MB");
      return;
    }

    setLoading(true);
    setBtn(false);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Segment/saveSegmentProof`,
        formData, // Use formData here
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.result.flag === 1 && res.data.result.flagMsg) {
        toast.success(res.data.result.flagMsg);
        setProofView(true);
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
          <p>Segment Proof</p>
        </div>
        <button className="btn_close_fail" onClick={handleClose}>
          X
        </button>
        <div className="cheque">
          <p>Please upload your valid Document</p>
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
              backgroundImage: imageFile ? `url(${PDF})` : `url(${Cloud})`,
            }}
          >
            {/* <img src={imageFile ? PDF : ""} height={100} style={{marginLeft: "40%"}} /> */}

            {imageFile ? (
              <div className="upload-button">
                <input
                  type="file"
                  className="upload-file"
                  accept="application/pdf"
                  onChange={(e) => handleUpload(e)}
                />{" "}
              </div>
            ) : (
              <form class="my-form">
                {/* <p>Drag and Drop here</p>  */}
                <div className="upload-button">
                  <input
                    type="file"
                    className="upload-file"
                    accept="application/pdf"
                    onChange={(e) => handleUpload(e)}
                  />

                  {/* <p>Browse Here</p> */}
                </div>
              </form>
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

export default SegmentProof;
