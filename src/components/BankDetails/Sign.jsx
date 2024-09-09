import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import SessionDialogBox from "../SessionDialogBox";

const Sign = ({
  store,
  baseReq,
  select,
  setOpen,
  setPreview,
  preview,
  showSign,
  setShowSign,
  open,
  handleClose,
  setFailView,
  setEsignView,
  setEsignData,
  esignData,
  setBankingSign,
}) => {
  const [highlight, setHighlight] = React.useState(false);

  const [drop, setDrop] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [getFile, setGetFile] = useState("");
  const [openBank, setOpenBank] = useState(false);
  const [uplingFile, setUplingFile] = useState("");
  const [close, setClose] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  const navigate = useNavigate();

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
    setUplingFile(file);
  };

  function uploadFile(file) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = () => {
      // this is the base64 data
      const fileRes = btoa(reader.result);

      setPreview(`data:image/jpg;base64,${fileRes}`);
    };

    reader.onerror = () => {
      toast.error("There is a problem while uploading...");
    };
  }

  async function onFormSubmit() {
    const userData_Segment = new FormData();

    userData_Segment.append("UserUccCode", store.userCode);
    userData_Segment.append("UserProduct", baseReq.userProduct);
    userData_Segment.append("UserIP", sessionStorage.getItem("ip"));
    userData_Segment.append("UserDevice", baseReq.UserDevice);
    userData_Segment.append("UserEmailId", store.userEmail);
    userData_Segment.append("UserCode", store.userCode);
    userData_Segment.append("UserEmail", store.userEmail);
    userData_Segment.append("UserMobile", store.userMobile);
    userData_Segment.append("UserName", store.userName);
    userData_Segment.append("UserPan", store.userPAN);
    userData_Segment.append("UserMobileNumber", store.userMobile);
    userData_Segment.append("BankDocument", uplingFile);
    userData_Segment.append("BankProofType", "CHEQUE");

    const MIN_FILE_SIZE = 1; // 1KB
    const MAX_FILE_SIZE = 3072; // 10MB

    const fileSizeKiloBytes = uplingFile.size / 1024;

    if (fileSizeKiloBytes < MIN_FILE_SIZE) {
      toast.error("File size is less than the minimum limit");
      return;
    }
    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      toast.error("File size is greater than 3MB");
      return;
    }

    setShowSign(false);
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Bank/saveBankDocument`,
        userData_Segment,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          },
        }
      );

      setShowSign(false);
      if (res.data.result.flag === 1) {
        toast.success(res.data.result.flagMsg);
        setOpen(false);
        setEsignView(true);
        setFailView(false);
        navigate("/bank");
      } else if (res.data.result.flag === 0) {
        toast.error(res.data.result.flagMsg);
        setEsignView(false);
        setOpen(true);
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

      if (e.response.status !== "") toast.error(e.response.data.result.flagMsg);
      else toast.error("Something went wrong. Please try again later.");
      setLoading(false);
      setTimeout(() => {}, 2000);
    }
  }

  return (
    <>
      {loading && (
        <div className="contentLoder">
          <RingLoader color="green" size={120} />
        </div>
      )}
      <div className="signature_upload">
        <h6 className="cheque_upload">New Bank Details </h6>
        <div className="cancelled">
          <p>Upload Cancelled Cheque</p>
        </div>
        <button className="btn_close_fail" onClick={() => setFailView(false)}>
          X
        </button>
        <div className="cheque">
          <p>
            Upload a copy of the cancelled cheque which shows your Name, Bank
            account number and IFSC code
          </p>
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
        </div>
        <p className="esign_remark">{esignData}</p>
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

export default Sign;
