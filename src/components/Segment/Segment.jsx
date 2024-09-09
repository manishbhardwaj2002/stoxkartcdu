/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavContext from "../../Context/NavContext";
import Container from "../Container/Container";
import Navbar from "../Navbar/Navbar";
import RightNavbar from "../RightNavbar/RightNavbar";
import axios from "axios";
import Proof from "./Proof";
import Signature from "./Signature";
import Upload from "../Fileuploader/Upload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SegmentProof from "../Fileuploader/SegmentProof";
import SignatureProof from "../Fileuploader/SignatureProof";
import digio from "../Data/digio";
import $ from "jquery";
import { useCookies } from "react-cookie";
import FileDownload from "js-file-download";
import Pdf from "../../assets/file-pdf.png";
import Doc from "../../assets/document.svg";
import { RingLoader } from "react-spinners";
import SessionDialogBox from "../SessionDialogBox";

const Segment = ({
  baseReq,
  setBaseReq,
  store,
  setStore,
  segments,
  setIsLoggedIn,
  setBankDataEsign,
  bankDataEsign,
}) => {
  const [cookies, setCookie] = useCookies(["access_token", "refresh_token"]);

  const [nav, setNav] = useState(false);
  const value = { nav, setNav };
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState("");
  const [view, setView] = useState(false);
  const [show, setShow] = useState(false);
  const [add, setAdd] = useState("Last 6 months Bank Statement");
  const [sign, setSign] = useState(false);
  const [pre, setPre] = useState();
  const [esign, setESign] = useState(false);
  const [btn, setBtn] = useState(false);
  const [stores, setStores] = useState([]);
  const [pdf, setPdf] = useState("");
  const [data, setData] = useState([]);
  const [picname, setPicname] = useState([]);
  const [preview, setPreview] = React.useState("");
  const [imageFile, setImageFile] = React.useState({});
  const [getFile, setGetFile] = React.useState({});
  const [segmentView, setSegmentView] = useState(false);
  const [proof, setProofView] = useState(false);
  const [showing, setShowing] = useState(false);
  const [verified, setVerified] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [processingunit, setProcessingUnit] = useState(false);
  const [message, setMessage] = useState([]);
  const [showimg, setShowimg] = useState(false);
  const [imageShow, setImageShow] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

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
    setESign(true);
  }

  const handleEsign = () => {
    setLoading1(true);
    setTimeout(() => {
      setLoading1(false);
      IntializeDigigo(
        "production",
        stores.userID,
        stores.signing_parties_identifier,
        stores.access_token_id,
        "flag",
        {
          userName: store.userName,
          PAN: store.userPAN,
          userCode: store.userCode,
          userEmail: store.userEmail,
          userMobile: store.userMobile,
          type: "segment",
        }
      );
    }, 100);
  };

  function handleAddrTypeChange(e) {
    setAdd(e.target.value);
    setImageFile("");
    setGetFile("");
    setBtn(false);
  }
  useEffect(() => {
    onRefresh();
    setImageFile("");
    setGetFile("");
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    onFormSubmit();
  }, []);

  async function onFormGetSign() {
    const userData_Segment = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.ip,
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userCode: store.userCode,
      userMobileNumber: store.userMobile,
      userEmail: store.userEmail,
      userMobile: store.userMobile,
      userName: store.userName,
      userPan: store.userPAN,
      esignId: stores.userID,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Segment/getSegmentEsign`,
        userData_Segment,
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
        },
        {
          withCredentials: true,
        }
      );
      FileDownload(res.data.data.docPath, "download.pdf");

      setBtn(false);

      // setCookie('access_token', res.data.data, { path: '/',  expires: 1})
      // setCookie('refresh_token', store, {path: '/', expires : 1})
      // console.log(cookies)

      if (res.data.result.flag == 1 && res.data.result.flagMsg) {
        setBtn(false);

        toast.success(res.data.reult.flagMsg);
      } else if (res.data.result.flag == 0) {
        setView(true);
      } else if (res.data.result.flag == 1 && res.data.data.docREQ == "N") {
        setSign(true);
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      //     if(e.response.status != "")
      //     toast.error(e.response.data.result.flagMsg)
      // else
      toast.error(" Some thing Went wrong try after a while! ");
      setLoading(false);
      setTimeout(() => {
        navigate("/segment");
      }, 2000);
    }
  }

  async function onFormEsign() {
    const userData_Segment = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.ip,
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userCode: store.userCode,
      userMobileNumber: store.userMobile,
      userEmail: store.userEmail,
      userMobile: store.userMobile,
      userName: store.userName,
      userPan: store.userPAN,
    };

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Segment/requestSegmentEsign`,
        userData_Segment,
        {
          withCredentials: true,
        }
      );

      console.log(res);
      setBtn(true);
      setStores(res.data.data);

      // setCookie('access_token', res.data.data, { path: '/',  expires: 1})
      // setCookie('refresh_token', store, {path: '/', expires : 1})
      // console.log(cookies)
      setLoading(false);
      if (res.data.result.flag == 1 && res.data.result.flagMsg == 1) {
        setBtn(true);
        setStores(res.data.data);
        toast.success(res.data.reult.flagMsg);
        setLoading(false);
        setTimeout(() => {
          setBtn(false);
        }, 1000);
      } else if (res.data.result.flag == 0) {
        setBtn(false);
        setView(true);
        toast.error(res.data.reult.flagMsg);
        setLoading(false);
      } else if (res.data.result.flag == 1 && res.data.data.docREQ == "N") {
        setSign(true);
        setBtn(false);
        toast.error(res.data.reult.flagMsg);
        setLoading(false);
      }
    } catch (e) {
      if (e.response.status != "") toast.error(e.response.data.result.flagMsg);
      else toast.error(" Some thing Went wrong try after a while! ");
      setBtn(false);
      setLoading(false);
      setTimeout(() => {
        navigate("/segment");
      }, 2000);
    }
  }
  async function onFormSubmit() {
    const userData_Segment = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.ip,
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userCode: store.userCode,
      userMobileNumber: store.userMobile,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Segment/getSegmentDetails`,
        userData_Segment,
        {
          withCredentials: true,

        }
      );

      setIsLoggedIn(true);
      if (res.data.result.flag == 1 && res.data.data.docREQ == "Y") {
        setShow(false);
        setView(false);
        setSign(true);
      } else if (res.data.result.flag == 0) {
        setView(true);
        setShow(false);
      } else if (res.data.result.flag == 1 && res.data.data.docREQ == "N") {
        setSign(true);
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      if (e.response != "") toast.error(e.response.result.flagMsg);
      else toast.error(" Some thing Went wrong try after a while! ");
      setLoading(false);
      setTimeout(() => {
        navigate("/segment");
      }, 2000);
    }
  }

  async function onFormCall() {
    const userData_Segment = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.ip,
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userCode: store.userCode,
      userMobileNumber: store.userMobile,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Segment/saveSegmentWithoutProof`,
        userData_Segment,
        {
          withCredentials: true,

        }
      );

      //   if(res.data.result.flag && res.data.result.flag == 1 && res.data.data.docREQ == 'Y' ){
      //      setShow(false)

      // } else if(res.data.result.flag && res.data.result.flag == 0){
      //    setView(true)

      // }
      //  else if(res.data.result.flag && res.data.result.flag == 1 && res.data.data.docREQ == 'N'){
      //   setView(false)
      //   setShow(false)
      //   setSign(true)

      // }
    } catch (e) {
      if (e.response.status != "") toast.error(e.response.data.result.flagMsg);
      else toast.error(" Some thing Went wrong try after a while! ");
      setLoading(false);
      setTimeout(() => {
        navigate("/");
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
        `${process.env.REACT_APP_BASE_URL}/Segment/segmentUpdateAllowed`,
        userData,
        {
          withCredentials: true,

        }
      );

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
        navigate("/segment");
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
              {loading1 && (
                <div className="contentLoder">
                  <RingLoader color="green" size={120} />
                </div>
              )}
              {loading && (
                <div className="contentLoder">
                  <RingLoader color="green" size={120} />
                </div>
              )}
              <h1 style={{ paddingLeft: "100px" }}>Add Segment</h1>
              {!showing && (
                <div className="mobile">
                  <p className="mobile_p" style={{ paddingLeft: "0px" }}>
                    Activate Derivatives segment for diversified trading (F&O,
                    Currency, Commodity){" "}
                  </p>

                  {view && (
                    <div className="segment_view">
                      <h1>Segment already activated</h1>
                    </div>
                  )}
                  {sign && (
                    <div className="mobile_form_1">
                      <label
                        style={{
                          fontFamily: "Roboto",

                          fontWeight: "400",
                          fontSize: "20px",
                          color: "#222448",
                        }}
                      >
                        Document Type
                      </label>
                      <select
                        id="bank_select"
                        value={add}
                        onChange={handleAddrTypeChange}
                      >
                        {/* <option value="1">Bank Statement</option> */}
                        <option value="Last 6 months Bank Statement">
                          Last 6 months Bank Statement{" "}
                        </option>
                        <option value="Latest Salary Slip">
                          Latest Salary Slip
                        </option>
                        <option value="Latest From 16">Latest Form 16</option>
                        <option value="Latest ITR Acknowledgement">
                          Latest ITR Acknowledgement
                        </option>
                        <option value="Latest Demat holding statement with value">
                          Latest Demat holding statement with value
                        </option>
                      </select>

                      <label>
                        Segment Proof{" "}
                        <span className="act">(PDF only less than 10mb)</span>
                      </label>
                      <input
                        type="text"
                        placeholder={
                          showimg && imageFile
                            ? imageFile.name.slice(0, 4) +
                              imageFile.name
                                .slice(4, imageFile.name.length - 4)
                                .replace(/[^h]/g, "*") +
                              imageFile.name.slice(imageFile.name.length - 4)
                            : "Upload Documents"
                        }
                        maxLength={10}
                        required={true}
                        id="segment"
                        style={{
                          backgroundImage: imageFile
                            ? `url(${Pdf})`
                            : `url(${Doc})`,
                        }}
                      />

                      <Proof
                        store={store}
                        baseReq={baseReq}
                        add={add}
                        setPicname={setPicname}
                        setImageFile={setImageFile}
                        setSegmentView={setSegmentView}
                        imageFile={imageFile}
                        setProofView={setProofView}
                        setBtn={setBtn}
                        setShowimg={setShowimg}
                        showimg={showimg}
                        setImageShow={setImageShow}
                      />

                      {/* <div className="segment_uploader_1">
                        <span className="imagefile_name_proof">
                          {" "}
                        
                        ""}{" "}
                        </span>
                     
                      </div> */}
                      {/* <div className="signature">
                        <label>
                          Signature{" "}
                          <span className="act">(only jpg,jpeg &png)</span>
                        </label>
                        <input
                          type="text"
                          placeholder={
                            showimg && getFile
                              ? getFile.name.slice(0, 4) +
                                getFile.name
                                  .slice(4, getFile.name.length - 4)
                                  .replace(/[^h]/g, "*") +
                                getFile.name.slice(getFile.name.length - 4)
                              : "Upload Documents"
                          }
                          maxLength={10}
                          required={true}
                          id="segment"
                          style={{
                            backgroundImage: getFile
                              ? `url(${imageShow})`
                              : `url(${Doc})`,
                          }}
                        />

                        <Signature
                          store={store}
                          baseReq={baseReq}
                          setPreview={setPreview}
                          preview={preview}
                          setGetFile={setGetFile}
                          getFile={getFile}
                          setPicname={setPicname}
                          setSegmentView={setSegmentView}
                          setBtn={setBtn}
                          setShowimg={setShowimg}
                          showimg={showimg}
                          setImageShow={setImageShow}
                        />

                    
                      </div> */}
                      {/* <div className="image_uploader">
                          {" "}
                          <span className="imagefile_name">
                            {" "}
                            {showimg && getFile ? getFile.name : ""}{" "}
                        
                          </span>
                        </div> */}
                      <div className="check_segmenet">
                        <div className="check">
                          <input
                            type="checkbox"
                            checked
                            id="styled-checkbox-2"
                          />{" "}
                          <span className="activate">
                            I want to add Derivatives segment
                          </span>
                        </div>
                        <div className="confirm">
                          {imageFile && add && showimg && (
                            <button
                              className="button"
                              onClick={(e) => onFormEsign(e)}
                              disabled={loading}
                            >
                              {loading ? "Please wait" : "Confirm"}
                            </button>
                          )}

                          {btn && (
                            <button
                              className="button"
                              id="btn_esign"
                              disabled={loading1}
                              onClick={handleEsign}
                            >
                              {loading1 ? "Please wait" : "Esign"}
                            </button>
                          )}
                          {/* {esign && ( <button className='button' id='btn_esign' onClick={(e)=>onFormGetSign(e)}>Download</button>)} */}

                          {/* <button onClick={window['IntializeDigigo']}> Esign</button> */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* {sign && (
     <div className='mobile_form_1'>
    
   
   
       
       <div>
         </div>
         <div>
           </div>
         <div className='check_segmenet'>
         <div className='check'>
             <input type="checkbox" checked={pre}
        onChange={e => setPre(e.target.checked)} checked disabled  /> <span className='activate'>I want to activate Future option</span>
         </div>
         <div className="confirm">
        <button className='button' onClick={(e) => onFormCall(e)}  disabled={loading}>{loading ? 'Please wait' : 'Confirm'}</button>
        </div>
        </div>
   </div>
  )} */}
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

              {rejected && (
                <div>
                  <h1
                    style={{
                      color: "red",
                      fontSize: ".7rem",
                      paddingLeft: "8em",
                      paddingTop: "1.5em",
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

export default Segment;
