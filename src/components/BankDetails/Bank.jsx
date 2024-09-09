/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Modal from "react-modal";
import NavContext from "../../Context/NavContext";
import Container from "../Container/Container";
import Navbar from "../Navbar/Navbar";
import RightNavbar from "../RightNavbar/RightNavbar";
import axios from "axios";
import AsyncSelect from "react-select/async";
import ResponsiveDialog from "./ResponsiveDialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import digio from "../Data/digio";
import Edit from "../../assets/edit.svg";
import { Fastfood, Message } from "@mui/icons-material";
import { RingLoader } from "react-spinners";
import SessionDialogBox from "../SessionDialogBox";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "30%",
    height: "100vh",
    transform: "translate(-50%, -50%)",
    background: "rgba(234, 244, 255, 0.95)",
  },
};

const Bank = ({
  baseReq,
  setBaseReq,
  store,
  setStore,
  data,
  setData,
  counter,
  preview,
  setPreview,
  setIsLoggedIn,
  setBankDataEsign,
  bankDataEsign,
}) => {
  const [nav, setNav] = useState(false);
  const value = { nav, setNav };
  const [selectedOption, setSelectedOption] = useState(null);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState("");
  const [items, setItems] = useState([]);
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [select, setSelect] = useState([]);
  const [get, setGet] = useState({});
  const [user, setUser] = useState({});
  const [confirm, setConfirm] = React.useState("");
  const [micr, setMicr] = useState("");
  const [bankIFSC, setBankIFSC] = useState("");
  const [paid, setPaid] = React.useState("");
  const [bankShow, setBankShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [esignView, setEsignView] = useState(false);
  const [bankShowing, setBankShowing] = useState(false);
  const [esignData, setEsignData] = useState({});

  const [uniqueId, setUniqueId] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [bankingSign, setBankingSign] = useState(false);
  const [bankDataSign, setBankDataSign] = useState([]);
  const [showing, setShowing] = useState(false);
  const [demosign, setDemoSign] = useState(false);
  const [verified, setVerified] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [processingunit, setProcessingUnit] = useState(false);
  const [message, setMessage] = useState([]);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  const [demo, setDemo] = useState([]);

  const navigate = useNavigate();

  let subtitle;

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

  const checkboxHandler = () => {
    setAgree(!agree);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const handleClick = () => {
    if (agree == false) {
      toast.error("Please accept the T&C");
      return;
    } else if (agree == true) {
      setBankShowing(true);
    }
  };

  useEffect(() => {
    onFormSubmit();
  }, []);

  useEffect(() => {
    if (localStorage !== undefined) {
      const respond = localStorage.getItem("bankDataEsign");

      if (respond !== null) {
        setBankDataEsign(JSON.parse(respond));

        if (data.isDocUpload === true) {
          setEsignView(false);
          setDemoSign(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (localStorage !== undefined) {
      const respond = localStorage.getItem("demo");

      if (respond !== null) {
        setDemo(JSON.parse(respond));
        setDemoSign(true);
        setRejected(false);
        setEsignView(false);
      }
    }
  }, []);

  // useEffect(()=>{
  //     onGetDetails()
  // },[])

  async function onFormSubmit() {
    const userData = {
      userUccCode: baseReq.userCode,
      userProduct: baseReq.userProduct,
      userIP: sessionStorage.getItem("ip"),
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userCode: store.userCode,
      userMobileNumber: store.userMobile,
    };

    // if(baseReq.userMobile.length == 0) {
    //  setNotifications("Mobile cannot not be blank")
    //   setTimeout(()=> {
    //   setNotifications("")
    //   }, 1000)
    //   return;
    // }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Bank/getBankDetails`,
        userData,
        {
          withCredentials: true,
        }
      );

      setData(res.data.data.addedBanks);
      setGet(res.data.data.addedBanks);
      setIsLoggedIn(true);

      //   if(res.data.result.flag && res.data.result.flag == 1 ){
      //     setData(res.data.data.addedBanks)
      // } else
      if (res.data.result.flag == 0) {
        navigate("/bank");
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
        navigate("/bank");
      }, 2000);
    }
  }

  async function onFormEsign() {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Bank/requestBankEsign`,
        bankDataEsign,
       

        {
          headers: {
            'Content-Type': 'application/json'
        },
          withCredentials: true
        
        }
      );
      setLoading2(true);
      setUniqueId(res.data.data);

      setTimeout(() => {
        setLoading2(false);
      }, 2000);

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
              userEmail: store.userEmail,
              userMobile: store.userMobile,
              type: "bank",
            }
          );
        }, 100);
      }
    } catch (e) {
      if (e.response.status != "") toast.error(e.response.data.result.flagMsg);
      else toast.error(" Some thing Went wrong try after a while! ");
      setLoading(false);
      setEsignView(false);
      setTimeout(() => {
        navigate("/bank");
      }, 2000);
    }
  }

  async function onDemoEsign() {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Bank/requestBankEsign`,
        demo,

        {
          headers: {
            'Content-Type': 'application/json'
        },
          withCredentials: true,
         
        }
      );
      setLoading2(true);
      setUniqueId(res.data.data);

      if (res.data) {
        setTimeout(() => {
          setLoading2(false);
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
              userEmail: store.userEmail,
              userMobile: store.userMobile,
              type: "bank",
            }
          );
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
      setEsignView(false);
      setTimeout(() => {
        navigate("/bank");
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
        `${process.env.REACT_APP_BASE_URL}/Bank/bankUpdateAllowed`,
        userData,
        {
          withCredentials: true,
        }
      );

      // console.log(res);
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

  //   async function onGetDetails() {

  //     const userData_Bank = {
  //       userUccCode: store.userCode,
  //       userProduct: baseReq.userProduct,
  //       userIP: baseReq.ip,
  //       userDevice: baseReq.userDevice,
  //       userEmailId: store.userEmail,
  //       userCode: store.userCode,
  //       userMobileNumber: store.userMobile,
  //       bankAccount: confirm,
  //       bankIFSC: bankIFSC,
  //       bankName: user.bankName,
  //       bankBranch: user.bankBranch,
  //       bankMICR: user.bankMICR ? user.bankMICR : micr,
  //       bankUPI: paid,
  //       bankType: "Saving" ,
  //       bankHolderName: data[0].bankHolderName,
  //       bankHolderMobile: store.userMobile,

  //       }

  //     try {

  //       const res = await axios.post( `${process.env.REACT_APP_BASE_URL}/Bank/addBank`,userData_Bank,
  //       {
  //         headers: {
  //           "Authorization": 'Basic MTIzOjEyMw==',
  //           "Content-Type": "application/json",
  //         }
  //       }
  //       );

  //  conosle.log(res)

  //     } catch (e) {
  //       if(e.response.status != "" &&  e.response.data.result.flag == 0){
  //         setBankShow(true);
  //         toast.error(e.response.data.result.flagMsg);

  //       }

  //   else
  //       toast.error(' Some thing Went wrong try after a while! ')

  //       setTimeout(()=> {
  //       navigate("/bank")
  //      },2000)

  //     }
  //   }
  const handleDropDown = (e) => {
    setSelect(e.target.value);
  };

  const handleLogout = () => {
    localStorage.clear();
    setDemoSign(false);
    navigate("/bank");
  };

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
              {loading2 && (
                <div className="contentLoder">
                  <RingLoader color="green" size={120} />
                </div>
              )}
              <h1 style={{ paddingLeft: "100px" }}>Bank Updation</h1>
              {!showing && (
                <div className="mobile">
                  <p className="mobile_p" style={{ paddingLeft: "0" }}>
                    Update your bank details to receive payouts without any
                    hassles.{" "}
                  </p>
                  {bankShow && <div>Request is already in process.</div>}
                  <div
                    className="email_form"
                    style={{ paddingLeft: "0", position: "relative" }}
                  >
                    Registered Bank
                    <label style={{ marginTop: "-0.5em" }}>
                      <select onChange={handleDropDown}>
                        {data?.map((item) => {
                          return (
                            <option
                              value={select}
                            >{`${item.bankAccount}-${item.bankName}`}</option>
                          );
                        })}
                      </select>
                    </label>
                    {!esignView && !demosign && (
                      <>
                        <div className="ekyc_bank">
                          <div className="ex_2">
                            <input
                              type="checkbox"
                              onChange={checkboxHandler}
                              checked={agree}
                              id="styled-checkbox-2"
                            />
                          </div>
                          <p className="small_1">
                            I/We hereby Request Stoxkart to Modify/add new bank
                            in Trading and Demat account I/we hold with
                            Stoxkart. I/We declare that the particulars given by
                            me/us are true and to the best of my/our knowledge
                            as on the date of making this application. I/We
                            agree and undertake to intimate Stoxkart any
                            change(s) in the details / Particulars mentioned by
                            me/us in this form. I/We further agree that any
                            false / misleading information given by me / us or
                            suppression of any material information will render
                            my account liable for termination and suitable
                            action.
                          </p>
                        </div>

                        <div className="mobile_btn">
                          <button
                            className="button_email"
                            onClick={handleClick}
                          >
                            {" "}
                            {/* {bankShowing && (
                            <h4 style={{ color: "white" }}>ADD BANK</h4>
                          )} */}
                            {agree ? (
                              <ResponsiveDialog
                                data={data}
                                store={store}
                                setStore={setStore}
                                baseReq={baseReq}
                                setBaseReq={setBaseReq}
                                select={select}
                                get={get}
                                counter={counter}
                                modalIsOpen={modalIsOpen}
                                setIsOpen={setIsOpen}
                                preview={preview}
                                setPreview={setPreview}
                                setIsLoggedIn={setIsLoggedIn}
                                setEsignView={setEsignView}
                                setEsignData={setEsignData}
                                esignData={esignData}
                                setBankDataEsign={setBankDataEsign}
                                bankDataEsign={bankDataEsign}
                                setBankingSign={setBankingSign}
                                setDemo={setDemo}
                                demo={demo}
                                setDemoSign={setDemoSign}
                              />
                            ) : (
                              <h5 style={{ fontSize: "1.4rem" }}>ADD BANK</h5>
                            )}
                          </button>
                        </div>

                        <div className="notes_bank">
                          <p className="note_bank">
                            Note:-<sup style={{ color: "red" }}>*</sup>Changes
                            bank details will take up to 48 hours after
                            successful verification of change request.{" "}
                          </p>
                        </div>
                      </>
                    )}
                    {esignView && (
                      <div className="mobile_btn">
                        <button
                          className="button_email"
                          onClick={() => onFormEsign()}
                          loading={loading2}
                        >
                          {loading2 ? "Please Wait..." : "Esign"}
                        </button>
                        {/* <Button label="Esign" loading={loading2} onClick={()=> onFormEsign()} /> */}
                      </div>
                    )}
                    {demosign && (
                      <div className="mobile_btn">
                        <button
                          className="button_email"
                          onClick={() => onDemoEsign()}
                          loading={loading2}
                        >
                          {loading2 ? "Please Wait..." : "Esign"}
                        </button>
                        <div onClick={handleLogout}>
                          <img src={Edit} height={15} className="styles_img" />
                        </div>

                        {/* <Button label="Esign" loading={loading2} onClick={()=> onFormEsign()} /> */}
                      </div>
                    )}
                  </div>

                  <div class="open">
                    <div></div>
                  </div>
                </div>
              )}

              {processingunit && (
                <div id="bank_update" className="mobile_update">
                  <h2 style={{ color: "#0CA750" }}>{message.flagMsg}</h2>
                </div>
              )}

              {verified && (
                <div className="mobile_update">
                  <h1>{message.flagMsg}</h1>
                </div>
              )}

              {!esignView && rejected && (
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
      {/* <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
            
        </h2>
        <button className='close' onClick={closeModal}>X</button>
       
    
      </Modal>  */}

{isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
    </>
  );
};

export default Bank;
