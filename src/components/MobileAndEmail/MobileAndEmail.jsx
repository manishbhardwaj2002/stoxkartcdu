/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavContext from "../../Context/NavContext";
import Container from "../Container/Container";
import Navbar from "../Navbar/Navbar";
import RightNavbar from "../RightNavbar/RightNavbar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRef } from "react";
import digio from "../Data/digio";
import { RingLoader } from "react-spinners";
import SessionDialogBox from "../SessionDialogBox";

const mobile_update = {
  display: "flex",
  alignItems: "flex-start",
  paddingTop: "0",
  paddingLeft: "0",
  justifyContent: "center",
  marginTop: "1em",
};
const mobile_email_update = {
  display: "flex",
  alignItems: "flex-start",
  paddingTop: "5em",
  paddingLeft: "2em",
  justifyContent: "center",
  marginTop: "1em",
};
const MobileAndEmail = ({
  currentOption,
  baseReq,
  setBaseReq,
  store,
  setStore,
  setIsLoggedIn,
  setIsVerified,
  isMobEmailSubmit,
  eMobAndEmailSign,
  setOnlyMobile,
  seteMobileAndEmailSign,
}) => {
  const toastIdMobileEmail = "mobile_email_123";
  const [nav, setNav] = useState(false);
  const [loading, setLoading] = useState(false);
  const value = { nav, setNav };
  const [mobilenumber, setMobileNumber] = React.useState("");
  const [notifications, setNotifications] = useState("");
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [loading2, setLoading2] = useState(false);
  const [uniqueId, setUniqueId] = useState([]);
  const [eSignMobileData, setESignMobileData] = useState(null);
  const [agree, setAgree] = useState(false);
  const [showing, setShowing] = useState(false);
  const [processingunit, setProcessingUnit] = useState(false);
  const [processingunitMobile, setProcessingUnitMobile] = useState(false);
  const [processingunitEmail, setProcessingUnitEmail] = useState(false);
  const [message, setMessage] = useState([]);
  const [messageMobile, setMessageMobile] = useState([]);
  const [messageEmail, setMessageEmail] = useState([]);
  const [message1, setMessage1] = useState([]);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  
  const refElement = useRef("");
  let subtitle;

  const Eregex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const navigate = useNavigate();

  useEffect(() => {
    if (window.localStorage === "") {
      setIsVerified(false);
      navigate("/updateContact");
    }
  }, []);

  useEffect(() => {
    // if (isMobEmailSubmit === false) {
    onRefresh();
    // }
  }, []);

  const checkboxHandler = () => {
    setAgree(!agree);
  };

  const numberRegex = /^[0-9]+$/;

  const handleChange = (e) => {
    setBaseReq({
      ...baseReq,
      userMobile: e.target.value.replace(/[^0-9]/gi, ""),
    });
  };

  const handleChangeEmail = (e) => {
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
      userOldMobile: store.userMobile,
      userMobile: baseReq.userMobile,
      userEmail: baseReq.userEmail,
      userOldEmail: store.userEmail,
      otp: "",
    };

    if (!processingunitMobile && baseReq.userMobile.length === 0) {
      toast.error("Mobile cannot be blank", { toastId: toastIdMobileEmail });
      return;
    }

    if (!processingunitMobile && !numberRegex.test(baseReq.userMobile)) {
      toast.error("Please enter valid mobile no", {
        toastId: toastIdMobileEmail,
      });
      return;
    }
    if (baseReq.userMobile === store.userMobile) {
      toast.error("Mobile no. is already registered", {
        toastId: toastIdMobileEmail,
      });
      return;
    }

    if (!processingunitEmail && baseReq.userEmail.length === 0) {
      toast.error("Email cannot be blank", { toastId: toastIdMobileEmail });
      return;
    }

    if (!processingunitEmail && !Eregex.test(baseReq.userEmail)) {
      toast.error("Please enter valid Email", { toastId: toastIdMobileEmail });
      return;
    }

    if (!processingunitEmail && baseReq.userEmail === store.userEmail) {
      toast.error("Email id is already registered", {
        toastId: toastIdMobileEmail,
      });
      return;
    }

    if (agree === false) {
      toast.error("Please accept the T&C");
      return;
    }

    setLoading(true);

    try {
      let resMobile;
      if (!processingunitMobile) {
        resMobile = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/Mobile/checkDuplicateMobile`,
          userData,
          {
            withCredentials: true,
          }
        );
      }

      let resEmail;
      if (!processingunitEmail) {
        resEmail = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/Email/checkDuplicateEmail`,
          userData,
          {
            withCredentials: true,
          }
        );
      }

      setIsOpen(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);

      if (
        !processingunitMobile &&
        !processingunitEmail &&
        resMobile.data.result.flag === 1 &&
        resEmail.data.result.flag === 1
      ) {
        await onCall();
        setOnlyMobile(true);
      } else if (!processingunitMobile && resMobile.data.result.flag === 1) {
        await onCall();
      } else if (!processingunitEmail && resEmail.data.result.flag === 1) {
        await onCallEmail();
      } else if (
        resMobile.data.result.flag === 0 ||
        resEmail.data.result.flag === 1
      ) {
        if (resMobile.data.result.flag === 0)
          toast.error("Mobile is already registered", {
            toastId: toastIdMobileEmail,
          });
        if (resEmail.data.result.flag === 0)
          toast.error("Email id is already registered", {
            toastId: toastIdMobileEmail,
          });
        navigate("/updateContact");
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

      if (e.response.status !== "")
        toast.error(e.response.data.result.flagMsg, {
          toastId: toastIdMobileEmail,
        });
      else toast.error(" Some thing Went wrong try after a while! ");
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
      userOldMobile: store.userMobile,
      userMobile: baseReq.userMobile,
      otp: "",
    };

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Mobile/sendOTP`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.result.flag == 1) {
        toast.dismiss(toastIdMobileEmail);
        navigate("/mobileotp");
      } else if (res.data.result.flag == 0) {
        setCurrentOption({ code: 3, value: currentOption.value });
        navigate("/updateContact");
      }
    } catch (e) {
      if (e.response.status !== "")
        toast.error(e.response.data.result.flagMsg, {
          toastId: toastIdMobileEmail,
        });
      else toast.error(" Some thing Went wrong try after a while! ");
      setLoading(false);
      setTimeout(() => {
        navigate("/updateContact");
      }, 1000);
    }
  }

  async function onCallEmail() {
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

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Email/sendOTP`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        { withCredentials: true }
      );

      if (res.data.result.flag == 1) {
        toast.success("OTP sent successfully");
        setIsLoggedIn(true);
        navigate("/emailotp");
      } else if (res.data.result.flag == 0) {
        navigate("/updateContact");
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      if (e.response.status !== "")
        toast.error(e.response.data.result.flagMsg, {
          toastId: toastIdMobileEmail,
        });
      else toast.error(" Some thing Went wrong try after a while! ");
      setLoading(false);
      setTimeout(() => {
        navigate("/updateContact");
      }, 1000);
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
  }
  const onSubmitEsign = async (e) => {
    e.preventDefault();
    const mobilePyaload = {
      userCode: store.userCode,
      esignFor: "EMAILMOBILE",
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
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setLoading2(true);

      setTimeout(() => {
        setLoading2(false);
      }, 2000);

      if (res.data) {
        setESignMobileData(res.data.data);
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
              type: "mobileAndEmail",
            }
          );
        }, 100);
      }
    } catch (e) {
      if (e.response.status !== "") toast.error(e.response.data.result.flagMsg);
      else toast.error(" Some thing Went wrong try after a while! ");
      setLoading2(false);
      seteMobileAndEmailSign(false);
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
      const resEmail = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Email/emailUpdateAllowed`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const resMobile = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Mobile/mobileUpdateAllowed`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setLoading(false);
      if (resEmail.data.flag === 0 && resMobile.data.flag === 0) {
        setMessage({
          flagMsg:
            "We have received request for updating Mobile & Email. Change of Mobile number & Email will take up to 2 working days after successful acceptance of change request.",
        });
        setProcessingUnit(true);
        setShowing(true);
      } else if (resEmail.data.flag === 0 || resMobile.data.flag === 0) {
        if (resEmail.data.flag === 0) {
          setMessageEmail({ flagMsg: resEmail.data.flagMsg });
          setProcessingUnitEmail(true);
        } else if (resMobile.data.flag === 0) {
          setMessageMobile({ flagMsg: resMobile.data.flagMsg });
          setProcessingUnitMobile(true);
        }
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
            <form className="mobile_form">
              {!processingunitMobile && <label>Registered Mobile Number</label>}
              {!processingunitMobile && (
                <input
                  type="text"
                  disabled
                  value={store.userMobile}
                  className="mobilenumber"
                />
              )}

              {!eMobAndEmailSign && !processingunitMobile && (
                <label>New Mobile Number </label>
              )}
              {!eMobAndEmailSign && !processingunitMobile && (
                <input
                  type="text"
                  placeholder="Enter new mobile No"
                  maxLength={10}
                  ref={refElement}
                  onChange={handleChange}
                  value={baseReq.userMobile}
                  name="number"
                />
              )}
              {!eMobAndEmailSign && processingunitMobile && (
                <div
                  id="mobile_update"
                  className="mobile_update"
                  style={mobile_update}
                >
                  <h4 id="noteh4" style={{ color: "red" }}>
                    Note -
                  </h4>{" "}
                  <h4 style={{ display: "flex" }}>{messageMobile.flagMsg}</h4>
                </div>
              )}
            </form>
          </div>
        )}
        {!showing && (
          <div className="mobile">
            <form className="email_form" style={{ paddingLeft: "0px" }}>
              {!processingunitEmail && <label>Registered Email ID</label>}
              {!processingunitEmail && (
                <input
                  type="email"
                  disabled
                  value={store.userEmail}
                  className="mobilenumber"
                  style={{ fontSize: "16px" }}
                />
              )}

              {!eMobAndEmailSign && !processingunitEmail && (
                <label>New Email ID</label>
              )}
              {!eMobAndEmailSign && !processingunitEmail && (
                <input
                  type="email"
                  placeholder="Enter new email id"
                  maxLength={50}
                  onChange={handleChangeEmail}
                  ref={refElement}
                  value={baseReq.userEmail}
                  name="number"
                />
              )}
              {!eMobAndEmailSign && processingunitEmail && (
                <div
                  id="mobile_update2"
                  className="mobile_update"
                  style={mobile_update}
                >
                  <h4 id="noteh42" style={{ color: "red" }}>
                    Note -
                  </h4>{" "}
                  <h4 style={{ display: "flex" }}>{messageEmail.flagMsg}</h4>
                </div>
              )}
              {!eMobAndEmailSign && (
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
                    I/We hereby Request Stoxkart to change my{" "}
                    {!processingunitMobile ? "Mobile" : ""}{" "}
                    {!processingunitMobile && !processingunitEmail ? "and" : ""}{" "}
                    {!processingunitEmail ? "Email ID" : ""} in Trading and
                    Demat account I/we hold with Stoxkart. I/We confirm &
                    declare that the new {!processingunitMobile ? "Mobile" : ""}{" "}
                    {!processingunitMobile && !processingunitEmail ? "and" : ""}{" "}
                    {!processingunitEmail ? "Email ID " : ""}
                    belongs to me and I/We authorise Stoxkart / Exchanges /
                    Depositories to use this email ID to send me/us any
                    information / alert / email.
                  </p>
                </div>
              )}

              <div className="mobile_btn">
                {!eMobAndEmailSign && (
                  <button
                    className="button_email"
                    onClick={(e) => onFormSubmit(e)}
                    disabled={loading}
                  >
                    {loading ? "Please wait" : "Send OTP"}
                  </button>
                )}
                {eMobAndEmailSign && (
                  <button
                    className="button_email"
                    onClick={(e) => onSubmitEsign(e)}
                  >
                    {loading2 ? "Please Wait..." : "Esign"}
                  </button>
                )}
              </div>

              <div className="notes_email" style={{ marginBottom: "1em" }}>
                <p className="note">
                  Note:-<sup style={{ color: "red" }}>*</sup>Changes in
                  {!processingunitMobile ? " Mobile" : ""}{" "}
                  {!processingunitMobile && !processingunitEmail ? "and" : ""}{" "}
                  {!processingunitEmail ? "Email ID" : ""} will take up to 2
                  working days after successful acceptance of change request.
                </p>
              </div>
            </form>
          </div>
        )}
        {processingunit && (
          <div
            id="mobile_email_update"
            className="mobile_update"
            style={mobile_email_update}
          >
            <h4 id="noteh41" style={{ color: "red" }}>
              Note -
            </h4>
            <h4 style={{ display: "flex" }}>
              We have received request for updating Mobile & Email. Change of
              Mobile number & Email will take up to 2 working days after
              successful acceptance of change request.
            </h4>
          </div>
        )}
      </NavContext.Provider>
      {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
    </>
  );
};

export default MobileAndEmail;
