import React, { useState, useEffect } from "react";
import OTPInput from "otp-input-react";
import Stx from "../../assets/secyre.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Stox from "../../assets/stoxkart.svg";
import Bank from "../../assets/bank.svg";
import ResendOTP from "./ResendOTP";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import OtpSucess from "./OtpSucess";
import OtpFail from "./OtpFail";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import SessionDialogBox from "../SessionDialogBox";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "100%",
    height: "100vh",
    transform: "translate(-50%, -50%)",
    background: "rgba(234, 244, 255, 0.95)",
  },
};

const VerifyOtp = ({
  baseReq,
  setBaseReq,
  setStore,
  setSegments,
  store,
  setIsLoggedIn,
  setIsVerified,
  setESignBtn,
  setEmaileSignBtn,
  seteMobileAndEmailSign,
  mobData,
  setMobData,
}) => {
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState("");
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [cookies, setCookies] = useState("");
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  
  // const [auth, setAuth] = useState(sessionStorage.getItem('store'))
  let subtitle;

  const navigate = useNavigate();
  const toastIdOtp = "otp123";

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    const mobData = sessionStorage.getItem("mobData");
    if (mobData) setMobData(mobData);

    setESignBtn(false);
    setEmaileSignBtn(false);
    seteMobileAndEmailSign(false);
  }, []);

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
      otp: OTP,
    };
    if (sessionStorage.getItem("userCode"))
      userData.userCode = sessionStorage.getItem("userCode");

    if (OTP.length == 0) {
      toast.error("OTP cannot be blank", { toastId: toastIdOtp });
      setTimeout(() => {
        setNotifications("");
      }, 1000);
      return;
    }

    if (OTP.length > 6) {
      toast.error("Please enter correct OTP", { toastId: toastIdOtp });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Login/validateOTP`,
        userData,

        { withCredentials: true }
      );

      if (data.result.flag == 1) {
        const result = data.data;

        sessionStorage.setItem("store", JSON.stringify(result));
        setSegments(data.data);
        setStore(data.data);
        setIsLoggedIn(true);
        sessionStorage.setItem("isLoggedIn", true);
        setBaseReq({
          userUccCode: baseReq.userUccCode,
          userProduct: baseReq.userProduct,
          userIP: baseReq.userIP,
          userDevice: baseReq.userDevice,
          userEmailId: "",
          userCode: baseReq.userCode,
          userOldMobile: baseReq.userOldMobile,
          userMobile: "",
          otp: "",
        });
        navigate("/nominee-details");
      } else if (data.result.flag == 0) {
        navigate("/verify");
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      if (e.response.status !== "")
        toast.error(e.response.data.result.flagMsg, { toastId: toastIdOtp });
      else toast.error(" Some thing Went wrong try after a while! ");
      setLoading(false);
      setTimeout(() => {
        navigate("/verify");
      }, 2000);
    }
  }

  const extractAndUseCookies = (headers) => {
    const setCookieHeader = headers["set-cookie"];

    if (setCookieHeader) {
      document.cookie = setCookieHeader.join("; ");

      setCookies(setCookieHeader.join("; "));
    }
  };
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
            </div>
            <div className="box">
              <div className="info">
                <h1>Hello again!</h1>
              </div>
              <div className="client">
                <label>Verify OTP</label>
                <div>
                  <p className="otp">Enter the OTP generated on {mobData}</p>
                </div>
                <div className="otpinput_1">
                  <OTPInput
                    value={OTP}
                    onChange={setOTP}
                    autoFocus
                    OTPLength={6}
                    otpType="number"
                    disabled={false}
                    name="otp"
                    placeholder={["-", "-", "-", "-", "-", "-"]}
                  />
                  <p className="red">{notifications}</p>
                </div>
                {/* <ResendOTP onResendClick={() => console.log("Resend clicked")} /> */}
                <div className="resend_verfiy">
                  <ResendOTP
                    baseReq={baseReq}
                    setStore={setStore}
                    setBaseReq={setBaseReq}
                    setOTP={setOTP}
                  />
                </div>
                <div className="btn_verify" style={{ marginTop: "1em" }}>
                  <button
                    className="button"
                    onClick={(e) => onFormSubmit(e)}
                    disabled={loading}
                  >
                    {loading ? "Please wait" : "Confirm OTP"}
                  </button>
                </div>
              </div>
            </div>
            {/* <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
            <img src={Stox} alt=""/>
        </h2>
        <button className='close' onClick={closeModal}>X</button>
        <div className='main'>
           <div>
               <img src={Bank} alt="" className='image'/>
               <h6>Verifying your OTP</h6>
               <p>  This may take up to <span>10 seconds    </span>                    
      <br></br>Please wait, Don't close this page </p>
           </div>
        </div>
    
      </Modal> */}
       {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
          </div>
        </>
      )}
    </>
  );
};

export default VerifyOtp;
