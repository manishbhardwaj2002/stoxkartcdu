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
  position: "relative",
  left: "2em",
  display: "flex",
  paddingTop: "5em",
  paddingLeft: "4em",
  alignItems: "flex-start",
  justifyContent: "flex-start",
};
const Mobile = ({
  baseReq,
  setBaseReq,
  store,
  setStore,
  setIsLoggedIn,
  setIsVerified,
  eSignBtn,
  setESignBtn,
  isMobEmailSubmit,
  setisMobEmailSubmit,
}) => {
  const toastIdMobile = "mobile123"; // using id for toast to dismiss/stop the noticifation whenever needed
  const [nav, setNav] = useState(false);
  const [loading, setLoading] = useState(false);
  const value = { nav, setNav };
  const [mobilenumber, setMobileNumber] = React.useState("");
  const [notifications, setNotifications] = useState("");
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [loading2, setLoading2] = useState(false);
  const [eSignMobileData, setESignMobileData] = useState(null);
  const [agree, setAgree] = useState(false);
  const [showing, setShowing] = useState(false);
  const [processingunit, setProcessingUnit] = useState(false);
  const [message, setMessage] = useState([]);
  const refElement = useRef(null);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  
  let subtitle;

  const navigate = useNavigate();

  useEffect(() => {
    if (window.localStorage === "") {
      setIsVerified(false);
      navigate("/updateContact");
    }
  }, []);

  useEffect(() => {
    // if(isMobEmailSubmit === false){
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
      otp: "",
    };

    const customId = "custom-id-yes";
    if (baseReq.userMobile.length == 0) {
      toast.error("Mobile cannot be blank", { toastId: toastIdMobile });
      return;
    }
    if (baseReq.userMobile.length !== 10) {
      toast.error("User Mobile must be of 10 digits", {
        toastId: toastIdMobile,
      });
      return;
    }
    if (!numberRegex.test(baseReq.userMobile)) {
      toast.error("Please enter valid mobile no", { toastId: toastIdMobile });
      return;
    }
    if (baseReq.userMobile === store.userMobile) {
      toast.error("Mobile no. is already registered", {
        toastId: toastIdMobile,
      });
      return;
    }

    if (agree === false) {
      toast.error("Please accept the T&C");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Mobile/checkDuplicateMobile`,
        userData,
        {
          withCredentials: true,
        }
      );

      setIsOpen(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);

      if (res.data.result.flag == 1) {
        onCall();
      } else if (res.data.result.flag == 0) {
        navigate("/updateContact");
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      if (e.response.status !== "")
        toast.error(e.response.data.result.flagMsg, { toastId: toastIdMobile });
      else
        toast.error(" Some thing Went wrong try after a while! ", {
          toastId: toastIdMobile,
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
          withCredentials: true,
        }
      );

      if (res.data.result.flag === 1) {
        toast.dismiss(toastIdMobile);
        navigate("/mobileotp");
      } else if (res.data.result.flag === 0) {
        navigate("/updateContact");
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      if (e.response.status !== "")
        toast.error(e.response.data.result.flagMsg, { toastId: toastIdMobile });
      else
        toast.error(" Some thing Went wrong try after a while! ", {
          toastId: toastIdMobile,
        });
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
      esignFor: "MOBILE",
      userName: store.userName,
      PAN: store.userPAN,
      userOldMobile: store.userMobile,
      userMobile: baseReq.userMobile,
      userEmail: baseReq.userEmail || "",
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

      if (res.data.result.flag === 1)
        toast.success(res.data.result.flagMsg, { toastId: toastIdMobile });
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
              type: "mobile",
            }
          );
        }, 100);
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

      if (e.response.status !== "")
        toast.error(e.response.data.result.flagMsg, { toastId: toastIdMobile });
      else
        toast.error(" Some thing Went wrong try after a while! ", {
          toastId: toastIdMobile,
        });
      setLoading2(false);
      setESignBtn(false);
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
      setMessage(res.data);
      if (res.data.flag == 0) {
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
            <form className="mobile_form">
              <label>Registered Mobile Number</label>
              <input
                type="text"
                disabled
                value={store.userMobile}
                className="mobilenumber"
              />

              {!eSignBtn && <label>New Mobile Number </label>}
              {!eSignBtn && (
                <input
                  type="text"
                  placeholder="Enter new mobile No"
                  maxLength={10}
                  ref={refElement}
                  autoFocus
                  onChange={handleChange}
                  value={baseReq.userMobile}
                  name="number"
                />
              )}

              {!eSignBtn && (
                <div className="ekyc">
                  <div className="ex">
                    <input
                      type="checkbox"
                      onChange={checkboxHandler}
                      checked={agree}
                      id="styled-checkbox-2"
                    />
                  </div>
                  <p className="small">
                    I/We hereby Request Stoxkart to change my mobile number in
                    Trading and Demat account I/we hold with Stoxkart. I/We
                    confirm & declare that the new mobile number belongs to me
                    and I/We authorise Stoxkart / Exchanges / Depositories to
                    use this mobile number to send me/us any information / alert
                    / email.
                  </p>
                </div>
              )}

              <div className="mobile_btn">
                {!eSignBtn && (
                  <button
                    className="button_email"
                    onClick={(e) => onFormSubmit(e)}
                    disabled={loading}
                  >
                    {loading ? "Please wait" : "Send OTP"}
                  </button>
                )}
                {eSignBtn && (
                  <button
                    className="button_email"
                    onClick={(e) => onSubmitEsign(e)}
                  >
                    {loading2 ? "Please Wait..." : "Esign"}
                  </button>
                )}
              </div>
            </form>
            <div className="notes">
              <p className="note">
                Note:-<sup style={{ color: "red" }}>*</sup>Changes in Mobile
                number will take up to 2 working days after successful
                acceptance of change request.
              </p>
            </div>
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

export default Mobile;
