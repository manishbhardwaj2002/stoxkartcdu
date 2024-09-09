/* eslint-disable no-undef */
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavContext from "../../Context/NavContext";
import Container from "../Container/Container";
import Navbar from "../Navbar/Navbar";
import RightNavbar from "../RightNavbar/RightNavbar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import digio from "../Data/digio";
import { RingLoader } from "react-spinners";
import SessionDialogBox from "../SessionDialogBox";

const mobile_update = {
  display: "flex",
  paddingTop: "5em",
  paddingLeft: "4em",
  alignItems: "flex-start",
  justifyContent: "center",
};

const Email = ({
  currentOption,
  baseReq,
  setBaseReq,
  store,
  setStore,
  setIsLoggedIn,
  emaileSignBtn,
  setEmaileSignBtn,
  setCurrentOption,
  isMobEmailSubmit,
  setisMobEmailSubmit,
}) => {
  const [nav, setNav] = useState(false);
  const value = { nav, setNav };
  const [mailID, setRegisteredEmailId] = React.useState("");
  const [notifications, setNotifications] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showing, setShowing] = useState(false);
  const [processingunit, setProcessingUnit] = useState(false);
  const [message, setMessage] = useState([]);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  
  const refElement = useRef("");

  const Eregex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const navigate = useNavigate();

  const toastIdMail = "mail123";
  useEffect(() => {
    // if(isMobEmailSubmit === false){
    onRefresh();
    // }
    if (window.localStorage === "") {
      setIsVerified(false);
      navigate("/updateContact");
    }
  }, []);

  const checkboxHandler = () => {
    setAgree(!agree);
  };

  const handleChange = (e) => {
    setBaseReq({
      ...baseReq,
      userEmail: e.target.value,
    });
  };

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
      otp: "",
    };

    if (baseReq.userEmail.length === 0) {
      toast.error("Email cannot be blank", { toastId: toastIdMail });
      return;
    }
    if (!Eregex.test(baseReq.userEmail)) {
      toast.error("Please enter valid Email", { toastId: toastIdMail });
      return;
    }

    if (baseReq.userEmail === store.userEmail) {
      toast.error("Email id is already registered", { toastId: toastIdMail });
      return;
    }

    if (agree === false) {
      toast.error("Please accept the T&C");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Email/checkDuplicateEmail`,
        userData,
        {
          withCredentials: true,

        }
      );

      if (res.data.result.flag == 1) {
        onCall();
      } else if (res.data.result.flag == 0) {
        toast.error(res.data.result.flagMsg, { toastId: toastIdMail });
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

      if (e.response.status !== "")
        toast.error(e.response.data.result.flagMsg, { toastId: toastIdMail });
      else
        toast.error(" Some thing Went wrong try after a while! ", {
          toastId: toastIdMail,
        });
      setLoading(false);
      setTimeout(() => {
        navigate("/updateContact");
      }, 1000);
    }
  }

  async function onCall() {
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
      otp: "",
    };

    setLoading(true);

    setIsLoggedIn(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Email/sendOTP`,
        userData,
        {
          withCredentials: true,

        }
      );

      if (res.data.result.flag == 1) {
        toast.dismiss(toastIdMail);
        setIsLoggedIn(true);
        navigate("/emailotp");
      } else if (res.data.result.flag == 0) {
        toast.error(res.data.result.flagMsg, { toastId: toastIdMail });
      }
    } catch (e) {
      if (e.response.status !== "")
        toast.error(e.response.data.result.flagMsg, { toastId: toastIdMail });
      else
        toast.error(" Some thing Went wrong try after a while! ", {
          toastId: toastIdMail,
        });
      setLoading(false);
    }
  }

  function IntializeDigigo(
    options,
    documentId,
    identifier,
    token,
    flag,
    myValues
  ) {
    var digio = new Digio(options);
    digio.init(myValues);
    digio.submit(documentId, identifier, token, myValues);
    // toast.success('E-Sign Completed');
    // setEmaileSignBtn(false);
  }
  const onSubmitEsign = async (e) => {
    e.preventDefault();
    const mobilePyaload = {
      userCode: store.userCode,
      esignFor: "EMAIL",
      userName: store.userName,
      PAN: store.userPAN,
      userOldMobile: store.userMobile,
      userMobile: baseReq.userMobile,
      userEmail: baseReq.userEmail,
      userOldEmail: store.userEmail,
    };
    setLoading2(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Mobile/requestMobileEmailEsign`,
        mobilePyaload,
        {
          withCredentials: true,

        }
      );
      console.log(res);
      setLoading2(true);
      // setUniqueId(res.data.data);

      setTimeout(() => {
        setLoading2(false);
      }, 2000);

      if (res.data.result.flag === 1)
        toast.success(res.data.result.flagMsg, { toastId: toastIdMail });
      if (res.data) {
        setLoading2(false);
        setTimeout(() => {
          IntializeDigigo(
            "production",
            res.data.data.userID,
            res.data.data.signing_parties_identifier,
            res.data.data.access_token_id,
            "flag",
            {
              userName: store.userName,
              PAN: store.userPAN,
              userCode: store.userCode,
              userOldMobile: store.userMobile,
              userMobile: baseReq.userMobile,
              userEmail: baseReq.userEmail,
              userOldEmail: store.userEmail,
              type: "email",
            }
          );
        }, 100);
      }
    } catch (e) {

      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

      console.log("error");
      if (e.response !== "")
        toast.error(e.response.data.result.flagMsg, { toastId: toastIdMail });
      else toast.error(" Some thing Went wrong try after a while! ");
      setLoading2(false);
      setEmaileSignBtn(false);
      setTimeout(() => {
        navigate("/updateContact");
      }, 2000);
    }
  };

  async function onRefresh() {
    const userData = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.ip,
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userMobileNumber: store.userMobile,
    };

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Email/emailUpdateAllowed`,
        userData,
        {
          withCredentials: true,

        }
      );

      setLoading(false);
      setMessage(res.data);
      if (res.data.flag === 0) {
        setProcessingUnit(true);
        setShowing(true);
      }
    } catch (e) {


      
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

      toast.error(" Some thing Went wrong try after a while! ");
      setLoading(false);
      setTimeout(() => {
        navigate("/updateContact");
      }, 1000);
    }
  }
  return (
    <>
      <NavContext.Provider value={value}>
        {loading && (
          <div className="contentLoder">
            <RingLoader color="green" size={120} />
          </div>
        )}
        {!showing && (
          <div className="mobile">
            <form className="email_form" style={{ paddingLeft: "0px" }}>
              <label>Registered Email ID</label>
              <input
                type="email"
                disabled
                value={store.userEmail}
                className="mobilenumber"
                style={{ fontSize: "16px" }}
              />

              {!emaileSignBtn && <label>New Email ID</label>}
              {!emaileSignBtn && (
                <input
                  type="email"
                  placeholder="Enter new email id"
                  maxLength={50}
                  onChange={handleChange}
                  ref={refElement}
                  value={baseReq.userEmail}
                  name="number"
                />
              )}

              {!emaileSignBtn && (
                <div className="ekyc">
                  <div className="ex_1">
                    <input
                      type="checkbox"
                      onChange={checkboxHandler}
                      checked={agree}
                      id="styled-checkbox-2"
                    />
                  </div>
                  <p className="small">
                    I/We hereby Request Stoxkart to change my email ID in
                    Trading and Demat account I/we hold with Stoxkart. I/We
                    confirm & declare that the new email ID belongs to me and
                    I/We authorise Stoxkart / Exchanges / Depositories to use
                    this email ID to send me/us any information / alert / email.
                  </p>
                </div>
              )}

              <div id="mobile_btn" className="mobile_btn">
                {!emaileSignBtn && (
                  <button
                    className="button_email"
                    onClick={(e) => onFormSubmit(e)}
                    disabled={loading}
                  >
                    {loading ? "Please wait" : "Send OTP"}
                  </button>
                )}
                {emaileSignBtn && (
                  <button
                    className="button_email"
                    onClick={(e) => onSubmitEsign(e)}
                  >
                    {loading2 ? "Please Wait..." : "Esign"}
                  </button>
                )}
              </div>

              <div className="notes_email">
                <p className="note">
                  Note:-<sup style={{ color: "red" }}>*</sup>Changes in e-mail
                  will take up to 2 working days after successful acceptance of
                  change request.
                </p>
              </div>
            </form>
          </div>
        )}
        {processingunit && (
          <div
            id="mobile_update"
            className="mobile_update"
            style={mobile_update}
          >
            <h4 id="noteh4" style={{ color: "red" }}>
              Note -
            </h4>{" "}
            <h4 style={{ display: "flex" }}>{message.flagMsg}</h4>
          </div>
        )}
      </NavContext.Provider>
      {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
    </>
  );
};

export default Email;
