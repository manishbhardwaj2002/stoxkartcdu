import React, { useState, useEffect } from "react";
import Stx from "../../assets/secyre.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Stox from "../../assets/stoxkart.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputText } from "primereact/inputtext";
import { RingLoader } from "react-spinners";
import sessionStorage from "redux-persist/es/storage/session";
import SessionDialogBox from "../SessionDialogBox";


const Section = ({ baseReq, setBaseReq, setIsLoggedIn, setMobData }) => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState("");
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  const nameRegex = /^[A-Za-z0-9 ]+$/;
  const toastClientId = "client_id";
  const handleChange = (e) => {
    setBaseReq({
      ...baseReq,
      userCode: e.target.value.toUpperCase().replace(/[^A-Za-z0-9]/gi, ""),
    });
    setError("");
  };

  async function onFormSubmit(e) {
    e.preventDefault();

    const userData = {
      userUccCode: baseReq.userUccCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.userIP,
      userDevice: baseReq.userDevice,
      userEmailId: baseReq.userEmailId,
      userCode: baseReq.userCode,
      userOldMobile: baseReq.userOldMobile,
      userMobile: baseReq.userMobile,
      otp: baseReq.otp,
    };

    if (baseReq.userCode.length == 0) {
      toast.error("Client ID cannot be blank", { toastId: toastClientId });
      setTimeout(() => {
        setNotifications("");
      }, 1000);
      return;
    }

    if (!nameRegex.test(baseReq.userCode)) {
      toast.error("Please enter valid client ID", { toastId: toastClientId });

      setTimeout(() => {
        setNotifications("");
      }, 1000);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Login/sendOTP`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        { withCredentials: true }
      );

      if (res.data.result.flag && res.data.result.flag == 1) {
        toast.success("OTP Sent");
        setMobData(res.data.data);
        sessionStorage.setItem("mobData", res.data.data);
        sessionStorage.setItem("userCode", baseReq.userCode);

        navigate("/verify");
      } else if (res.data.result.flag && res.data.result.flag == 0) {
        navigate("/");
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      
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
      {loading && (
        <div className="contentLoder">
          <RingLoader color="green" size={120} />
        </div>
      )}

      {!loading && (
        <>
          <Header />
          <div className="section">
            <div className="section_1">
              <img src={Stx} alt="" />
              <h1 className="heading">
                {" "}
                Update us to stay{" "}
                <span style={{ color: "#0CA750" }}>Updated</span>
              </h1>
              <p className="paragraph">
                Update your existing details to never miss out on any
                communication from us
              </p>
              {/* <span className='advice'>advice</span></h1> */}
            </div>
            <div className="box">
              <div className="info">
                <h1>Hello again!</h1>
              </div>
              <form className="client">
                <label>Client ID</label>
                <input
                  type="text"
                  placeholder="Please Enter your Client ID"
                  maxLength={7}
                  onChange={handleChange}
                  value={baseReq.userCode.toUpperCase()}
                  name="number"
                />
                {/* <span className="p-input-icon-right">
                <InputText
                  value={baseReq.userCode}
                  onChange={handleChange}
                  placeholder="Please Enter your Client ID"
                  style={{border: "none", marginTop: "-200px"}}
                  maxLength={7}
                />
               {error ?  <i
                  className="pi 
  pi-exclamation-circle" style={{color: "red"}}
                /> : ""}
                  {successMsg ?  <i
                  className="pi 
                  pi-check-circle" style={{color: "green"}}
                /> : ""}
              </span> */}

                <button
                  className="button"
                  onClick={(e) => onFormSubmit(e)}
                  disabled={loading}
                >
                  {loading ? "Please wait" : "Send OTP"}
                </button>
                <p className="terms">
                  By clicking you are agreeing to our{" "}
                  <a
                    href="https://www.smctradeonline.com/privacy-policy"
                    target="_blank"
                  >
                    {" "}
                    <span style={{ color: "blue", cursor: "pointer" }}>
                      Terms & Conditions.
                    </span>
                  </a>
                </p>
              </form>
            </div>
            {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
          </div>
        </>
      )}
    </>
  );
};

export default Section;
