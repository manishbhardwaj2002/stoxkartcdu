import * as React from "react";
import Button from "@mui/material/Button";

import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { FiDivideSquare } from "react-icons/fi";
import Responsive from "../Fileuploader/Responsive";
// import AsyncBar from "./AsyncBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import DropFileInput from "../Fileuploader/DropFileInput";
import Autocomplete from "./AutoComplete";
import WalkingBall from "../../assets/loading.gif";
import BankFail from "../BankDetails/BankFail";
import BankSuccess from "./BankSuccess";
import BankDialog from "./BankDialog";
import OtpSucess from "../Mobile/OtpSucess";
import FindTerm from "./FindTerm";
import { RingLoader } from "react-spinners";
import SessionDialogBox from "../SessionDialogBox";

function MaskCharacter(str, mask, n = 1) {
  // Slice the string and replace with
  // mask then add remaining string
  return ("" + str).slice(0, -n).replace(/./g, mask) + ("" + str).slice(-n);
}

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

export default function ResponsiveDialog({
  data,
  store,
  baseReq,
  setBaseReq,
  setStore,
  select,
  get,
  counter,
  setIsOpen,
  modalIsOpen,
  preview,
  setPreview,
  setEsignView,
  setEsignData,
  esignData,
  setBankDataEsign,
  bankDataEsign,
  setBankingSign,
  setDemo,
  demo,
  setDemoSign,
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");
  const [primaryValue, setPrimaryValue] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [notifications, setNotifications] = React.useState("");
  const [pay, setPay] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [user, setUser] = useState({});
  const [text, setText] = React.useState();
  const [suggestions, setSuggestions] = useState([]);
  const [paid, setPaid] = React.useState("");
  const [account, setAccount] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [error, setError] = useState();
  const [showing, setShowing] = useState(false);
  const [name, setName] = React.useState("");
  const [showdetails, setShowdetails] = useState(false);
  const [bankIFSC, setBankIFSC] = useState("");
  const [bankView, setBankView] = useState(false);
  const [signShow, setShowSign] = useState(false);
  const [failView, setFailView] = useState(false);
  const [micr, setMicr] = useState("");
  const [bankName1, setBankName1] = useState("");
  const [branchName1, setBranchName1] = useState("");
  const [savingState, setSavingState] = useState("");
  const [resshow, setResShow] = useState(true);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  let subtitle;

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(true);
  }

  const numberRegex = /^[0-9]+$/;

  // React.useEffect(()=> {

  //  loadUser()
  //     },[text])

  //     const onChangeHandler =(text)=>{
  //       let matches = []
  //       if(text.length > 2){
  //          matches = users.filter(user=>{

  //           return user.bankIFSC.match(matches)
  //          })
  //       }
  //       console.log(matches[0],"match")
  //       setUser(matches[0])

  //       setText(text)

  //     }

  // const  onSuggestHandler = (text) =>{

  //   setText(text)
  //      setShowing(false)

  // }

  const navigate = useNavigate();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setMicr(
      e.target.value
        .toUpperCase()
        .trim()
        .replace(/[^A-Za-z0-9]/gi, "")
    );
  };

  async function loadUser() {
    const userData = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.ip,
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userMobileNumber: store.userMobile,
      bankIFSC: text,
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Bank/getBankByIFSC`,
        userData,
        {
          withCredentials: true,
        }
      );

      setUsers(res.data.data);
    } catch (e) {

      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

    }
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    if (bankIFSC.length == 0) {
      toast.error("Please Enter IFSC");
    }

    if (branchName1.length == 0 && user.bankBranch == "") {
      toast.error("Please Enter Branch Name");
      return;
    }

    if (bankName1.length == 0 && user.bankName == "") {
      toast.error("Please Enter Bank Name");
      return;
    }

    if (!numberRegex.test(account)) {
      toast.error("Please enter valid account number");
      return;
    }
    if (!numberRegex.test(confirm)) {
      toast.error("Please enter valid confirm account number");
      return;
    }

    if (account.length == 0 && confirm.length == 0) {
      toast.error("Cannot be blank");
      return;
    } else if (account !== confirm) {
      toast.error("Account Number Not Match");
      return;
    }

    const userData = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.ip,
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userCode: store.userCode,
      userMobileNumber: store.userMobile,
      bankAccount: confirm,
      bankIFSC: bankIFSC,
      bankName: user.bankName ? user.bankName : bankName1,
      bankBranch: user.bankBranch ? user.bankBranch : branchName1,
      bankMICR: user.bankMICR ? user.bankMICR : micr,
      bankUPI: paid,
      bankType: "Saving" ? "Saving" : selectedValue,
      bankHolderName: data[0].bankHolderName, //data ? data[0].bankHolderName : store.userName ,
      bankHolderMobile: store.userMobile,
      isPrimaryAccount: primaryValue == "Yes" ? true : false,
    };

    setOpen(false);
    setLoading(true);
    setIsOpen(false);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Bank/addBank`,
        userData,
        {
          withCredentials: true,
        }
      );

      const responce = res;

      setEsignData(res.data.data.pennyDropRemarks);
      setIsOpen(true);
      setBankDataEsign(res.config.data);
      setBankIFSC("");
      setUser("");
      setAccount("");
      setConfirm("");
      setPaid("");
      setBankName1("");
      setBranchName1("");
      setMicr("");
      setResShow(false);
      setTimeout(() => {
        setLoading(false);

        if (res.data.result.flag == 1 && res.data.data.isDocUpload === true) {
          setIsOpen(false);
          setLoading(false);
          setFailView(true);
          setDemoSign(false);
          toast.success(res.data.result.flagMsg);
          setIsOpen(false);
          localStorage.setItem("bankDataEsign", JSON.stringify(res));
          setTimeout(() => {
            setVerified(false);
            setLoading(false);
            setShow(false);
          }, 2000);
        } else if (
          res.data.result.flag == 1 &&
          res.data.data.isDocUpload === false
        ) {
          localStorage.setItem("demo", JSON.stringify(res.config.data));
          setIsOpen(false);
          setLoading(false);
          setDemoSign(true);
          toast.success(res.data.result.flagMsg);
          setIsOpen(false);
          setFailView(false);
          navigate("/success");
          setTimeout(() => {
            setFailView(false);
            navigate("/bank");
            setShow(false);
            setVerified(false);
            setLoading(false);
          }, 1000);
          setShow(false);
        }
      }, 2000);
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

      console.log(e);
      setBankIFSC("");
      setUser("");
      setAccount("");
      setConfirm("");
      setPaid("");
      setBankName1("");
      setBranchName1("");
      setMicr("");
      setResShow(false);
      setIsOpen(true);

      setTimeout(() => {
        if (e.response.status != "") {
          setLoading(false);
          setBankIFSC("");
          setUser("");
          setAccount("");
          setConfirm("");
          setPaid("");
          setBankName1("");
          setBranchName1("");
          setMicr("");
          setResShow(false);
          setShow(false);
          setIsOpen(false);
          // setEsignView(true)
          setVerified(false);
          // setSuccess(true)
          toast.error(e.response.data.result.flagMsg);
        } else toast.error(" Some thing Went wrong try after a while! ");
        // setLoading(false);
        // setBankIFSC('')
        // setUser('')
        // setAccount('')
        // setConfirm('')
        // setPaid('')
        // setBankName1('')
        // setBranchName1('')
        // setMicr('')
        // setResShow(false)
        setTimeout(() => {
          navigate("/bank");
        }, 2000);
      }, 2000);
    }
  }

  const handleDropDown = (e) => {
    setText(e.target.value);
  };

  return (
    <>
      <div>
        {loading && (
          <div className="contentLoder">
            <RingLoader color="green" size={120} />
          </div>
        )}
        <Button
          onClick={handleClickOpen}
          style={{
            color: "white",
            border: "none",
            width: "100%",
            backgroundColor: "transparent",
            fontSize: "1.5rem",
            marginTop: ".2em",
            cursor: "pointer",
          }}
        >
          Add Bank
        </Button>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {" "}
            <h5>Add Bank Details</h5>
            <button
              className="btn_close_fail"
              onClick={() => setOpen(false)}
              style={{ top: "3%" }}
            >
              X
            </button>
          </DialogTitle>
          <DialogContent>
            <div className="main_1">
              <div className="main_content">
                <div className="autocomplete-wrapper">
                  <div className="ifsc">
                    <label for="fname">
                      {" "}
                      Bank IFSC <span style={{ color: "red" }}>*</span>
                    </label>
                    {/* <input type="text" placeholder='Enter IFSC Code' maxLength={11} onChange={e => onChangeHandler(e.target.value)} value={text}/> */}

                    <Autocomplete
                      users={users}
                      store={store}
                      baseReq={baseReq}
                      setUsers={setUsers}
                      setShowdetails={setShowdetails}
                      setUser={setUser}
                      bankIFSC={bankIFSC}
                      setBankIFSC={setBankIFSC}
                      setResShow={setResShow}
                      resshow={resshow}
                    />
                    {/* <FindTerm users={users}
                      store={store}
                      baseReq={baseReq}
                      setUsers={setUsers}
                      setShowdetails={setShowdetails}
                      setUser={setUser}
                      bankIFSC={bankIFSC}
                      setBankIFSC={setBankIFSC}/> */}
                  </div>

                  <label for="fname">
                    Bank Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="fname"
                    name="Bank Name"
                    placeholder="Bank Name"
                    required={true}
                    value={user ? user.bankName : bankName1}
                    onChange={(e) => setBankName1(e.target.value)}
                    style={{ color: "grey", fontSize: "18px" }}
                  />
                  <label for="lname">
                    {" "}
                    Branch Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="Branch Name"
                    placeholder="Branch Name"
                    required={true}
                    value={user ? user.bankBranch : branchName1}
                    onChange={(e) => setBranchName1(e.target.value)}
                    style={{ color: "grey", fontSize: "18px" }}
                  />

                  <label for="lname">
                    {" "}
                    Branch MICR <span style={{ color: "red" }}>*</span>
                  </label>
                  {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
                  <input
                    type="number"
                    name="Branch MICR"
                    placeholder="Branch MICR"
                    required={true}
                    maxLength={9}
                    value={user ? user.bankMICR : micr}
                    onChange={handleChange}
                    // pattern="^[a-zA-Z0-9]+$"
                    style={{ color: "grey", fontSize: "18px" }}
                  />
                  <label for="lname">
                    {" "}
                    Bank Account Type <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="select_banktype">
                    <div className="select_banktype">
                      <select
                        onChange={(e) => setSelectedValue(e.target.value)}
                      >
                        <option>Saving</option>
                        <option>Current</option>
                      </select>
                    </div>
                  </div>
                  <div className="hot">
                    <label for="lname">
                      Bank Account Number{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="account"
                      placeholder="Account Number.."
                      maxLength={23}
                      value={account}
                      onChange={(e) => setAccount(e.target.value.slice(0, 23))}
                      required={true}
                      style={{ color: "grey", fontSize: "18px" }}
                    />
                    <label for="lname">
                      Confirm Bank Account Number{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmaccount"
                      placeholder="Confirm account nmber"
                      maxLength={23}
                      onChange={(e) =>
                        setConfirm(e.target.value.replace(/[^0-9]/gi, ""))
                      }
                      value={confirm}
                      required={true}
                      style={{ color: "grey", fontSize: "18px" }}
                    />
                    <label for="lname">
                      {" "}
                      Primary Account Type{" "}
                      <span style={{ color: "red" }}>*</span>
                      {/* <span style={{ color: "#3F5BD9" }}>
                        (both trading and demat account)
                      </span> */}
                    </label>
                    <div className="select_banktype">
                      <div className="select_banktype">
                        <select
                          onChange={(e) => setPrimaryValue(e.target.value)}
                        >
                          <option>No</option>
                          <option>Yes</option>
                        </select>
                      </div>
                    </div>
                    <span className="primary">
                      {primaryValue == "Yes"
                        ? "primary bank will be changed in both trading and demat account"
                        : "new bank will added as secondary bank in trading account only "}
                    </span>
                    <label for="lname">
                      {" "}
                      Bank UPI<span>(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Your UPI ID"
                      value={paid}
                      onChange={(e) => setPaid(e.target.value)}
                      style={{ fontSize: "18px" }}
                    />
                    <div className="confirm">
                      <button
                        className="button"
                        onClick={(e) => onFormSubmit(e)}
                        disabled={loading}
                      >
                        {loading ? "Please wait" : "Confirm"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
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
            <h6>Verifying Bank Details</h6>
            <p>
              {" "}
              This may take up to{" "}
              <span style={{ color: "#3F5BD9" }}>few seconds </span>
              <br></br>Please wait, Don't close this page{" "}
            </p>
          </div>
        </div>
      </Modal>
      {failView && (
        <>
          <BankDialog
            counter={counter}
            signShow={signShow}
            setShowSign={setShowSign}
            baseReq={baseReq}
            preview={preview}
            setPreview={setPreview}
            store={store}
            open={open}
            setFailView={setFailView}
            setOpen={setOpen}
            setEsignView={setEsignView}
            esignData={esignData}
            setBankingSign={setBankingSign}
          />
        </>
      )}
      {verified && <h1 style={{ color: "green" }}>Bank already added.</h1>}
      {bankView && (
        <>
          <OtpSucess />
        </>
      )}
       {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
    </>
  );
}
