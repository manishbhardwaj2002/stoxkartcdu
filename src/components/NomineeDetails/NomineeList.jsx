import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import "./Style/NomineeModule.css";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Button from "react-bootstrap/Button";
import AddNomineeForm from "./AddNomineeForm";
import "./Style/NomineeModule.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { toast } from "react-toastify";
import SessionDialogBox from "../SessionDialogBox";
const styles = {
  dialogPaper: {
    minHeight: "80vh",
    maxHeight: "80vh",
  },
};
export const initialNomineeData = {
  Prefix: "Mr",
  FirstName: "",
  MiddleName: "",
  LastName: "",
  Relation: "",
  DOB: "",
  Email: "",
  Mobile: "",
  Address1: "",
  Address2: "",
  Address3: "",
  City: "",
  State: "",
  PinCode: "",
  Country: "",
  ProofType: "Pan",
  ProofNumber: "",
  SharePercentage: "",
  IsNonimeeMinor: false,
  ProofDocument: null,
  GuardianDetails: {
    Prefix: "Mr",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Relation: "",
    DOB: "",
    Email: "",
    Mobile: "",
    Address1: "",
    Address2: "",
    Address3: "",
    City: "",
    State: "",
    PinCode: "",
    Country: "",
    ProofType: "Pan",
    ProofNumber: "",
    ProofDocument: null,
  },
};
export const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

const AddNomineesDetails = ({ store, setStore, setSelect, setLoading }) => {
  const [nomineeData, setNomineeData] = useState([
    deepCopy(initialNomineeData),
  ]);

  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  const [isSaved, setIsSaved] = useState(false);
  const [idx, setIdx] = useState(0);
  async function RemoveNomineeDetails(nomineeUniqueId, i) {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/Nominee/DeleteNominee/${nomineeUniqueId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res);
      if (res.data) {
        console.log("Deleting usernominee");
        let newNomineeData = [
          ...nomineeData.filter(
            (nominee) => nominee.NomineeUniqueId != nomineeUniqueId
          ),
        ];
        if (newNomineeData.length == 0)
          newNomineeData.push(deepCopy(initialNomineeData));
        setNomineeData(newNomineeData);
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      console.error(e);
    }
  }

  window.popstate = () => {
    window.location.reload();
  };
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log({ nomineeData });
  const setNomineeI = (data) => {
    nomineeData[idx] = data;
    setNomineeData([...nomineeData]);
    setIsSaved(true);
  };

  useEffect(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/Nominee/GetNomineeDetails/${store.userCode}`,
        {
          withCredentials: true,
        }
      );

      console.log(res);
      if (res.data.UserNominees.length > 0) {
        console.log("setting usernominee");
        setIsSaved(true);
        setNomineeData(res.data.UserNominees);
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      console.error(e);
    }
    setLoading(false);
  }, []);
  // const validateShare ;
  const handleEsign = async () => {
    //set loading icon
    if (!isSaved) {
      return toast.error("Please fill the nominee details and save it.");
    }
    if (!validateSharePercentage(0, 0)) {
      return toast.error("All distributed share should be equal to 100.");
    }
    if (!checkDuplicateIdProofNumber()) {
      return toast.error("Two Nominee ID Proof Numbers cannot be same.");
    }
    let res = checkAdhaar();
    if (!res) {
      return toast.error("Please Enter last 4 digits of Aadhaar Number");
    }

    setLoading(true);

    const nomineeDatasign = {
      isOptedforNominee: true,
      userMobileNumber: store.userMobile,
      userCode: store.userCode,
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Nominee/RequestNomineeEsign`,
        nomineeDatasign,
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        //set Loading
        const userData = {
          userName: store.userName,
          PAN: store.userPAN,
          userCode: store.userCode,
          userEmail: store.userEmail,
          userMobile: store.userMobile,
          type: "nominee",
          isOptedforNominee: true,
        };
        const digio = new window.Digio({
          environment: "production",
          callback: digio_callback,
        });
        digio.init(userData);
        digio.submit(
          res.data.EsignId,
          res.data.SigningPartiesIdentifier,
          res.data.AccessToken,
          userData
        );
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      console.log(e);
    }
    setLoading(false);
  };
  const digio_callback = (res) => {
    if (res.message.toLowerCase() == "signed successfully") {
      console.log("Signed Succesful");
      setSelect(5);
    } else {
      const msg = "Esign failed: Something went wrong, Please try again!";
      console.error(msg);
      toast.error(msg);
    }
    setLoading(false);
  };

  const validateSharePercentage = (old_share, new_share, equality = true) => {
    let total = nomineeData.reduce((i, j) => j.SharePercentage + i, 0);
    total = total - old_share + new_share;
    if (equality && total === 100) {
      return true;
    } else if (!equality && total <= 100) {
      return true;
    }
    return false;
  };
  function hasDuplicates(result) {
    return new Set(result).size !== result.length;
  }
  const checkAdhaar = () => {
    let res = true;
    nomineeData.forEach((nominee_data) => {
      if (nominee_data.ProofType === "Aadhaar") {
        if (nominee_data.ProofNumber.length !== 4) {
          res = false;
        }
      }
    });
    return res;
  };
  const checkDuplicateIdProofNumber = () => {
    let result = [];
    result = nomineeData.map((data) => data.ProofNumber);
    if (hasDuplicates(result)) {
      return false;
    }
    return true;
  };

  return (
    <>
      {
        <div className="updateContact">
          <h1 className="nominee-heading">Nominee Details</h1>
          {
            <div
              id=" addNomineeButton1"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {Array.from({ length: nomineeData?.length || 1 }).map(
                (data, i) => (
                  <div>
                    <button
                      className="addNomineeButton"
                      key={i}
                      style={{ marginTop: "1.65rem" }}
                      onClick={() => {
                        setIdx(i);
                        console.log({ i });
                        handleClickOpen();
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="my-1 px-2">
                          {nomineeData[i].FirstName
                            ? nomineeData[i].FirstName
                            : `Nominee ${i + 1}`}
                        </div>

                        <div className="my-1" style={{}}>
                          <ArrowForwardIcon
                            className="icon_arrow"
                            style={{ color: "#3F5BD9" }}
                          />
                        </div>
                      </div>
                    </button>

                    {nomineeData[i].FirstName ? (
                      <div>
                        <button
                          type="button"
                          class="btn btn-link mt-0 btn-sm removeNomineeDetails"
                          onClick={() =>
                            RemoveNomineeDetails(
                              nomineeData[i].NomineeUniqueId,
                              i
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )
              )}
            </div>
          }
          <Dialog
            fullScreen={fullScreen}
            className="commonbackgroundDialogColor"
            open={open}
            maxWidth="lg"
            scroll="body"
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle
              id="responsive-dialog-title"
              className="commonbackgroundDialogColor"
            >
              <h3 className="commonbackgroundDialogColor">Nominee Details</h3>
              <button
                className="btn_close_fail"
                onClick={() => setOpen(false)}
                style={{ top: "1em" }}
              >
                X
              </button>
            </DialogTitle>
            <h5
              className="commonbackgroundDialogColor"
              style={{ paddingLeft: "25px", color: "#707070" }}
            >
              {`Nominee ${idx + 1}`}
            </h5>
            <DialogContent className="commonbackgroundDialogColor">
              <div className="commonbackgroundDialogColor">
                <AddNomineeForm
                  store={store}
                  setStore={setStore}
                  nomineeIdx={nomineeData[idx]}
                  setNomineeIdx={setNomineeI}
                  setLoading={setLoading}
                  closeDialog={handleClose}
                  validateSharePercentage={validateSharePercentage}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      }

      {nomineeData.length < 3 && (
        <button
          className="addNomineeButtonModify"
          style={{
            background: "rgba(0,0,0,0)",
            border: "0",
            color: "rgba(63, 91, 217, 0.8)",
          }}
          onClick={() => {
            nomineeData.push(deepCopy(initialNomineeData));
            setNomineeData([...nomineeData]);
          }}
        >
          + Add Nominee
        </button>
      )}
      {
        <div style={{ marginTop: "10px" }}>
          <button
            className="addNomineeProceedButton"
            style={{
              background: "rgba(12, 167, 80, 1)",
              marginTop: "",
            }}
            onClick={handleEsign}
          >
            Submit & E-sign
          </button>
          {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
        </div>
      }
    </>
  );
};
export default AddNomineesDetails;
