import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavContext from "../../Context/NavContext";
import Container from "../Container/Container";
import Navbar from "../Navbar/Navbar";
import RightNavbar from "../RightNavbar/RightNavbar";
import axios from "axios";
import { toast } from "react-toastify";
import SessionDialogBox from "../SessionDialogBox";

const Mtf = ({
  baseReq,
  setBaseReq,
  store,
  setIsLoggedIn,
  setStore,
  setBankDataEsign,
  bankDataEsign,
}) => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState("");
  const [view, setView] = useState(false);
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);
  const value = { nav, setNav };
  const [select, setSelect] = useState("");
  const [permission, setPermission] = useState(false);
  const [show, setShow] = useState(true);
  const [showing, setShowing] = useState(false);
  const [verified, setVerified] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [processingunit, setProcessingUnit] = useState(false);
  const [message, setMessage] = useState([]);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  useEffect(() => {
    onFormSubmit();
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);
  async function onFormSubmit() {
    const userData_Segment = {
      userUccCode: store.userCode, //store.userCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.ip,
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userCode: store.userCode,
      userMobileNumber: store.userMobile,
    };

    // console.log('-----------Hitting the API Before TRY-------------')

    try {
      //console.log('-----------API HIT SENT-------------')
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/MTF/getMTFDetails`,
        userData_Segment,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        { withCredentials: true }
      );

      console.log(res);

      setIsLoggedIn(true);
      if (res.data.result.flag == 1) {
        setView(true);
        setRejected(false);
      } else if (res.data.result.flag == 0) {
        setView(false);
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

      // if (e.response.status != "")
      // toast.error(e.response.data.result.flagMsg);
      //  toast.error(" Some thing Went wrong try after a while! ")
      setLoading(false);
      setTimeout(() => {
        // navigate("/mtf");
      }, 2000);
    }
  }

  async function onMTFSubmit(e) {
    e.preventDefault();

    const userData_Segment = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.ip,
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userCode: store.userCode,
      userMobileNumber: store.userMobile,
      Check: permission,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/MTF/setMTFDetails`,
        userData_Segment,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        { withCredentials: true }
      );

      if (res.data.result.flagMsg) {
        setShow(false);
        toast.success(res.data.result.flagMsg);
        setTimeout(function () {
          window.location.reload(1);
        }, 100);
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
        navigate("/mtf");
      }, 2000);
    }
  }

  async function onRefresh() {
    const userData = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.ip,
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userMobileNumber: store.userMobile,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/MTF/mtfUpdateAllowed`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        { withCredentials: true }
      );

      console.log(res);

      setMessage(res.data);
      if (res.data.flag == 0) {
        setProcessingUnit(true);
        setShowing(true);
      } else if (res.data.flag == 1) {
        setShowing(true);
        setVerified(true);
      } else if (res.data.flag == 2) {
        setShowing(false);
        setRejected(true);
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
        <Navbar store={store} />
        <Container
          stickyNav={
            <RightNavbar
              store={store}
              setIsLoggedIn={setIsLoggedIn}
              setStore={setStore}
              setBankDataEsign={setBankDataEsign}
              bankDataEsign={bankDataEsign}
            />
          }
          content={
            <div>
              {!showing && (
                <div className="mobile">
                  <h1>MTF Updation</h1>
                  <p className="mobile_p">
                    Opt for MTF to diversify your trading experience.{" "}
                  </p>
                  {!view && (
                    <form className="email_form_1">
                      {/* <h6 className="mtf_heading"> Document Type</h6> */}
                      <div className="check_1">
                        <label className="contain_mtf">
                          <input
                            type="checkbox"
                            checked={permission}
                            onChange={(e) => setPermission(e.target.checked)}
                          
                          />{" "}
                          <span
                            className="activate_1 checkmark"
                            value={select}
                            onChange={(e) => setSelect(e.target.value)}
                          ></span>
                          <h6 className="mtf_activate">
                            I want to activate MTF option
                          </h6>
                        </label>
                      </div>

                      <div className="confirm_mtf">
                        {show && (
                          <button
                            className="button"
                            onClick={(e) => onMTFSubmit(e)}
                            disabled={loading}
                          >
                            {loading ? "Please wait" : "Confirm"}
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  {view && (
                    <div className="segment_view">
                      <h1>MTF is already activated</h1>
                    </div>
                  )}
                </div>
              )}

              {processingunit && (
                <div className="mobile_update">
                  <h1>{message.flagMsg}</h1>
                </div>
              )}

              {verified && (
                <div className="mobile_update">
                  <h1>{message.flagMsg}</h1>
                </div>
              )}

              {rejected && (
                <div>
                  <h1
                    style={{
                      color: "red",
                      fontSize: ".7rem",
                      paddingLeft: "8em",
                    }}
                  >
                    {message.flagMsg}
                  </h1>
                </div>
              )}
            </div>
          }
        />
      </NavContext.Provider>
      {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
    </>
  );
};

export default Mtf;
