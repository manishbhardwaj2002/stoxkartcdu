import React, { useState, useEffect } from "react";
import NavContext from "../../Context/NavContext";
import Container from "../Container/Container";
import Navbar from "../Navbar/Navbar";
import RightNavbar from "../RightNavbar/RightNavbar";
import { toast } from "react-toastify";
import { Button, IconButton } from "@mui/material";
import AddNomineesDetails, { AddDetails } from "./NomineeList";
import axios from "axios";
import NoChangeNominee from "./NoChangeNominee";
import "./Style/NomineeModule.css";
import { RingLoader } from "react-spinners";
import AdminPending from "./AdminPending";
import SessionDialogBox from "../SessionDialogBox";

const NomineeOptions = [
  // { code: 0, value: 'Select Options' },
  { code: 1, value: "Yes" },
  { code: 2, value: "No" },
];

const selectTypeStyle = {
  fontWeight: "400",
  fontSize: "22px",
  paddingLeft: "10px",
};
// const description = [
//   "",
//   "We have noticed that you have updated your nomination details recently. Please note that you can raise new request after 7 days from your last nominee updated date only.",
// ];

const NomineeContactDetails = ({
  store,
  setStore,
  setIsLoggedIn,
  currentOption,
  setCurrentOption,
}) => {
  const [nav, setNav] = useState(false);
  const [select, setSelect] = useState(0);
  const [IsNomineeUpdateAllowed, setIsNomineeUpdateAllowed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [nomineeOpted, setNomineeOpted] = useState(0);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  
  const value = { nav, setNav };
  useEffect(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/Nominee/GetUserNomineeStatus/${store.userCode}`,
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        setIsNomineeUpdateAllowed(res.data.IsNomineeUpdateAllowed);
        setNomineeOpted(res.data.IsOptedforNominee ? 1 : 0);
        if (res.data.IsPendingAtAdmin) {
          setSelect(5);
        } else if (res.data.IsOptedforNominee == null) {
          setSelect(0);
        } else {
          setSelect(4);
        }
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      
      console.log(e);
    }
    setLoading(false);
  }, []);
  window.popstate = () => {
    window.location.reload();
  };

  const handleDropDown = (e) => {
    const currentCode = NomineeOptions.find(
      (item) => item.value === e.target.value
    );
    setCurrentOption({ code: currentCode.code, value: e.target.value });
  };
  const handleSelection = (e) => {
    setSelect(currentOption.code);
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
            />
          }
          content={
            <>
              <div className="updateContact">
                {loading && (
                  <div className="contentLoder">
                    <RingLoader color="green" size={120} />
                  </div>
                )}
                {/* {select !== 5 && (
                  <>
                    <h1 className="nominee-heading">Nominee Details</h1>
                    <p className="mobile_p">
                      { description[1]}
                    </p>
                  </>
                )} */}

                {select === 4 && (
                  <>
                    <h1 className="nominee-heading">Nominee Details</h1>
                    {IsNomineeUpdateAllowed ? (
                      <>
                        <p className="mobile_p">
                          You have already submitted nomination consent, if you
                          wish to update or modify please click on the options
                          below.
                        </p>
                        <button
                          className="esign_btn"
                          // disabled={!IsNomineeUpdateAllowed}
                          onClick={() => {
                            setSelect(nomineeOpted);
                          }}
                          style={{ marginLeft: "80px", marginTop: "25px" }}
                        >
                          Update Details
                        </button>
                      </>
                    ) : (
                      <p className="mobile_p">
                        We have noticed that you have updated your nomination
                        details recently. Please note that you can raise new
                        request after 7 days from your last nominee updated
                        date.
                      </p>
                    )}
                  </>
                )}
                {select === 0 && (
                  <>
                    <h1 className="nominee-heading">Nominee Details</h1>
                    <div className="email_form">
                      <p style={{ fontSize: "15px" }}>
                        Do you want to add Nominee
                      </p>
                      <label>
                        <select
                          value={currentOption.value}
                          onChange={handleDropDown}
                        >
                          {NomineeOptions.map((item, idx) => {
                            return (
                              <option
                                key={idx}
                                value={item.value}
                                style={{ margin: "100px !important" }}
                              >{`${item.value}`}</option>
                            );
                          })}
                        </select>
                      </label>
                    </div>

                    <Button
                      className="button_margin"
                      style={{
                        color: "white",
                        width: "29.7vw",
                        marginTop: "2rem",
                        marginLeft: "5.8rem",
                      }}
                      onClick={handleSelection}
                      // className="email_form"
                    >
                      Proceed
                    </Button>
                  </>
                )}
                {select == 1 && (
                  <AddNomineesDetails
                    store={store}
                    setLoading={setLoading}
                    setSelect={setSelect}
                    setIsLoggedIn={setIsLoggedIn}
                  />
                )}
              </div>
              {select == 2 && (
                <NoChangeNominee
                  store={store}
                  setSelect={setSelect}
                  setLoading={setLoading}
                />
              )}
              {select == 5 && <AdminPending />}
            </>
          }
        />
      </NavContext.Provider>
      {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
    </>
  );
};

export default NomineeContactDetails;
