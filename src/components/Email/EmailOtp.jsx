import React, { useState, useEffect } from "react";
import OTPInput from "otp-input-react";
import ResendOTP from "./ResendOTP";
import NavContext from "../../Context/NavContext";
import Container from "../Container/Container";
import Navbar from "../Navbar/Navbar";
import RightNavbar from "../RightNavbar/RightNavbar";
import Modal from "react-modal";
import { useNavigate, Link } from "react-router-dom";
import Stox from "../../assets/stoxkart.svg";
import Bank from "../../assets/bank.svg";
import axios from "axios";
import OtpSucess from "../Mobile/OtpSucess";
import OtpFail from "../Mobile/OtpFail";
import { StarOutlineRounded } from "@mui/icons-material";
import Verifying from "../Mobile/Verifying";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalkingBall from "../../assets/loading.gif";
import Edit from "../../assets/edit.svg";
import { RingLoader } from "react-spinners";
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
    background: "white",
  },
};

function MaskCharacter(str, mask, n = 1) {
  // Slice the string and replace with
  // mask then add remaining string
  return (
    "" +
    str[0] +
    ("" + str).slice(1, -n).replace(/./g, mask) +
    ("" + str).slice(-n)
  );
}

const EmailOtp = ({
  store,
  baseReq,
  setStore,
  counter,
  setIsLoggedIn,
  ip,
  setBankDataEsign,
  isMobEmailSubmit,
  setisMobEmailSubmit,
  bankDataEsign,
  emaileSignBtn,
  setEmaileSignBtn,
  currentOption,
  setCurrentOption,
  seteMobileAndEmailSign,
}) => {
  const [nav, setNav] = useState(false);
  const value = { nav, setNav };
  const [OTP, setOTP] = React.useState("");
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState("");
  const [see, setSee] = useState(false);
  const [show, setShow] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const toastIdOtp = "otp123";
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  // useEffect(() =>{
  //   setEmaileSignBtn(false);
  //   seteMobileAndEmailSign(false);
  // },[]);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    const userData = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.ip,
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userCode: store.userCode,
      userMobileNumber: store.userMobile,
      userEmail: baseReq.userEmail,
      userOldEmail: store.userEmail,
      otp: OTP,
    };

    if (OTP.length == 0) {
      toast.error("OTP cannot not be blank", { toastId: toastIdOtp });
      return;
    }

    if (OTP.length > 6) {
      toast.error("Please enter correct OTP", { toastId: toastIdOtp });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Email/validateOTP`,
        userData,
        {
          withCredentials: true,

        }
      );
      setIsOpen(true);
      setIsLoggedIn(true);
      setTimeout(() => {
        if (res.data.result.flag === 1) {
          setIsOpen(false);
          setIsSuccess(false);
          setShow(true);
          setisMobEmailSubmit(true);
          setCurrentOption({
            code: currentOption.code,
            value: currentOption.value,
          });
          if (currentOption.code === 2) setEmaileSignBtn(true);
          if (currentOption.code === 3) seteMobileAndEmailSign(true);
          setTimeout(() => {
            setShow(false);
            navigate("/updateContact");
          }, 1000);
          toast.success(res.data.result.flagMsg);
        }
      }, 1000);
    } catch (e) {

      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

      setIsOpen(true);

      setTimeout(() => {
        setLoading(false);

        if (e.response.status !== "") {
          if (e.response.data.result.flagMsg.includes("OTP")) {
            setIsOpen(false);
            setIsSuccess(true);
            setTimeout(() => {
              setIsSuccess(false);
            }, 2000);
            setShow(false);
            setTimeout(() => {
              navigate("/emailotp");
            }, 2000);
          } else {
            setLoading(false);
            setShow(false);
            setIsOpen(false);
            setIsSuccess(false);
          }

          toast.error(e.response.data.result.flagMsg, { toastId: toastIdOtp });
          return false;
        } else
          toast.error(" Some thing Went wrong try after a while!", {
            toastId: toastIdOtp,
          });

        setLoading(false);
        setShow(false);
        setIsOpen(false);
        setIsSuccess(false);
        setTimeout(() => {
          navigate("/updateContact");
        }, 2000);
      }, 3000);
    }
  }

  return (
    <>
      <NavContext.Provider value={value}>
        <Navbar store={store} />
        <Container
          stickyNav={
            <RightNavbar
              store={store}
              setStore={setStore}
              setIsLoggedIn={setIsLoggedIn}
              setBankDataEsign={setBankDataEsign}
              bankDataEsign={bankDataEsign}
            />
          }
          content={
            <>
              {loading && (
                <div className="contentLoder">
                  <RingLoader color="green" size={120} />
                </div>
              )}
              <div className="mobile">
                <h1>Email Updation</h1>
                <p className="mobile_p" style={{ paddingLeft: "0" }}>
                  Keep your email id updated to receive on-time updates for your
                  account.{" "}
                </p>
                <form className="mobile_form">
                  <label className="verify">Verify OTP</label>
                  <div>
                    <p className="otp_1">
                      Enter the OTP sent to {baseReq.userEmail}
                      <Link to="/updateContact">
                        <span>
                          <img
                            src={Edit}
                            height={15}
                            className="image_link"
                            style={{ marginLeft: ".5em" }}
                          />
                        </span>
                      </Link>
                    </p>
                  </div>
                  <div className="otpinput">
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
                  </div>
                  <div className="resend_otp">
                    <ResendOTP
                      store={store}
                      baseReq={baseReq}
                      setOTP={setOTP}
                    />
                    <button
                      className="button"
                      onClick={(e) => onFormSubmit(e)}
                      disabled={loading}
                    >
                      {loading ? "Please wait" : "Confirm OTP"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          }
        />
      </NavContext.Provider>
      {show && (
        <>
          {" "}
          <OtpSucess setModalOpen={setModalOpen} modalOpen={modalOpen} />{" "}
        </>
      )}
      {isSuccess && (
        <>
          {" "}
          <OtpFail setModalOpen={setModalOpen} modalOpen={modalOpen} />{" "}
        </>
      )}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
          {/* <img src={Stox} alt="" /> */}
        </h2>

        <div className="main">
          <div className="main_walk">
            <img
              src={WalkingBall}
              alt=""
              style={{ width: "50%", height: "50%" }}
            />
            <h6>Verifying your OTP</h6>
            <p>
              {" "}
              This may take up to{" "}
              <span style={{ color: "#3F5BD9" }}>few seconds </span>
              <br></br>Please wait, Don't close this page{" "}
            </p>
          </div>
        </div>
      </Modal>
      {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
    </>
  );
};

export default EmailOtp;
