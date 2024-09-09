import { Checkbox } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import digio from "../Data/digio";
import { toast } from "react-toastify";
import SessionDialogBox from "../SessionDialogBox";

const selectTypeStyle = {
  fontWeight: "400",
  fontSize: "22px",
  paddingLeft: "10px",
};
const headerStyle = {
  fontFamily: "Roboto",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "28px",
  lineHeight: "33px",
};
const noChangeTerms =
  "I / We hereby confirm that I / We do not wish to appoint any nominee(s) in my / our trading / demat account and understand the issues involved in non-appointment of nominee(s) and further are aware that in case of death of all the account holder(s), my / our legal heirs would need to submit all the requisite documents / information for claiming of assets held in my / our trading / demat account, which may also include documents issued by Court or other such competent authority, based on the value of assets held in the trading / demat account.";
function NoChangeNominee({ store, setSelect, setLoading }) {
  const [checked, setChecked] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const handleESign = async () => {
    //set loading icon
    setLoading(true);

    const nomineeDatasign = {
      isOptedforNominee: false,
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
          isOptedforNominee: false,
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
  };
  const digio_callback = (res) => {
    if (res.message.toLowerCase() == "signed successfully") {
      setSelect(5);
    } else {
      const msg = "Esign failed: Something went wrong, Please try again!";
      console.error(msg);
      toast.error(msg);
    }
    setLoading(false);
  };
  console.log({ store });
  return (
    <div className="nominee_form">
      <p style={headerStyle}>Sole / First holder Name</p>
      <input
        disabled
        style={{
          height: "50px",
          color: "#707070",
          background: "#ececec",
          fontStyle: "Roboto",
          textAlign: "center",
        }}
        value={store.userName}
      />
      <div class="terms_container">
        <Checkbox
          checked={checked}
          onChange={handleChange}
          color="success"
          inputProps={{ "aria-label": "controlled" }}
        />
        <p>{noChangeTerms}</p>
      </div>
      <button disabled={!checked} className="esign_btn" onClick={handleESign}>
        Proceed and E-Sign
      </button>
      {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
    </div>
  );
}

export default NoChangeNominee;
