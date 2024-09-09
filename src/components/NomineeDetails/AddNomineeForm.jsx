import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "./Style/AddNomineesDetails.css";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "react-select";
import axios from "axios";
import { async } from "q";
import { FormGroup, Grid } from "@mui/material";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { deepCopy, initialNomineeData } from "./NomineeList";
import { toast } from "react-toastify";
import { isValidNominee } from "./utils";
import SessionDialogBox from "../SessionDialogBox";

const PrefixOptions = [
  { code: 1, value: "Mr" },
  { code: 2, value: "Mrs" },
  { code: 3, value: "Ms" },
];

const validType = ["image/png", "application/pdf", "image/jpeg", "image/jpg"];
const getAgeFromDOB = (dob_string) => {
  const dob = new Date(dob_string);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const RelationOptions = [
  { code: 1, value: "Spouse" },
  { code: 2, value: "Son" },
  { code: 3, value: "Daughter" },
  { code: 4, value: "Father" },
  { code: 5, value: "Mother" },
  { code: 6, value: "Brother" },
  { code: 7, value: "Sister" },
  { code: 8, value: "Grand Son" },
  { code: 9, value: "Grand Daughter" },
  { code: 10, value: "Grand Father" },
  { code: 11, value: "Grand Mother" },
  {
    code: 12,
    value:
      "Not Provided (if the relationship is not provided on nomination form)",
  },
];

const ProofOptions = [
  { code: 1, value: "Pan" },
  { code: 2, value: "Driving License" },
  { code: 3, value: "Aadhaar" },
  { code: 4, value: "Voter ID" },
];

export default function AddNomineeForm(props) {
  const {
    store,
    nomineeIdx,
    setNomineeIdx,
    validateSharePercentage,
    setLoading,
    closeDialog,
  } = props;
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  
  const [nomineeData, setNomineeData] = useState(
    nomineeIdx || initialNomineeData
  );
  const nomineeFileRef = useRef(null);
  const guardianNomineeFileRef = useRef(null);
  const toastIdMobileEmail = "NomineeIdMobile";

  const validateData = () => {
    // return true;
    const [status, msg] = isValidNominee(nomineeData);
    if (!status) {
      toast.error(msg, {
        toastId: toastIdMobileEmail,
      });
      return false;
    }
    if (
      !validateSharePercentage(
        nomineeIdx.SharePercentage,
        nomineeData.SharePercentage,
        false
      )
    ) {
      return toast.error("All Share distributed should be equal to 100.", {
        toastId: toastIdMobileEmail,
      });
    }
    return true;
  };
  const isValidFile = (file) => {
    if (validType.includes(file.type)) {
      return true;
    }
    return false;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let status = validateData();
    if (!status) {
      console.log("Validation failed", status);
      return;
    }
    const NomineeDetails = deepCopy(nomineeData);
    let GuardianDetails = {};
    NomineeDetails.ProofDocument = nomineeData.ProofDocument;
    if (NomineeDetails.IsNomineeMinor) {
      GuardianDetails = deepCopy(nomineeData.GuardianDetails);
      GuardianDetails.ProofDocument = nomineeData.GuardianDetails.ProofDocument;
    }
    delete NomineeDetails.GuardianDetails;

    let url = `${process.env.REACT_APP_BASE_URL}/Nominee/SaveNomineeDetails`;

    try {
      let formdata = new FormData();
      formdata.append("UserCode", store.userCode);
      formdata.append("UserName", store.userName);
      formdata.append("UserEmail", store.userEmail);
      formdata.append("UserMobileNumber", store.userMobile);
      formdata.append("IsOptedforNominee", true);
      for (const key in NomineeDetails) {
        if (NomineeDetails[key]) {
          formdata.append(`UserNominees.${key}`, NomineeDetails[key]);
        }
      }
      if (NomineeDetails.IsNomineeMinor) {
        for (const key in GuardianDetails) {
          if (GuardianDetails[key]) {
            formdata.append(
              `UserNominees.GuardianDetails.${key}`,
              GuardianDetails[key]
            );
          }
        }
      }
      e.target.disabled = true;
      const res = await axios.post(
        url,
        formdata,

        { withCredentials: true }
      );
      setLoading(false);
      if (res.status === 200) {
        nomineeData.NomineeUniqueId = res.data.NomineeUniqueId;
        if (res.data.GuardianUniqueId) {
          nomineeData.GuardianDetails.NomineeUniqueId =
            res.data.GuardianUniqueId;
        }
        closeDialog();
        setNomineeIdx({ ...nomineeData });
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      setLoading(false);
      toast.error(e);
    }
    e.target.disabled = false;
  };

  return (
    <>
    <Form>
      <div className="commonbackgroundDialogColor">
        {/* First Row */}
        <Grid sm={12} md={4} className="commonbackgroundDialogColor">
          <Row>
            <Col lg={true} className="commonbackgroundDialogColor">
              <div>
                <label>Prefix</label>
              </div>
              <div>
                <select
                  className="mt-2 prefixCss pl-0"
                  value={nomineeData.Prefix}
                  onChange={(e) => {
                    setNomineeData({ ...nomineeData, Prefix: e.target.value });
                  }}
                >
                  {PrefixOptions.map((item, idx) => {
                    return (
                      <option
                        key={idx}
                        value={item.value}
                      >{`${item.value}`}</option>
                    );
                  })}
                </select>
              </div>
            </Col>
            <Col lg={true}>
              <div>
                <label>
                  First Name <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <input
                  required={true}
                  className="mt-2 p-2"
                  value={nomineeData.FirstName}
                  onChange={(e) => {
                    console.log(e);
                    setNomineeData({
                      ...nomineeData,
                      FirstName: e.target.value,
                    });
                  }}
                  placeholder="Enter First Name"
                  type="text"
                  maxLength={20}
                />
              </div>
            </Col>

            <Col lg={true}>
              <div>
                <label>Middle Name</label>
              </div>
              <div>
                <input
                  className="mt-2 p-2"
                  value={nomineeData.MiddleName}
                  onChange={(e) =>
                    setNomineeData({
                      ...nomineeData,
                      MiddleName: e.target.value,
                    })
                  }
                  placeholder="Enter Middle Name"
                  type="text"
                  maxLength={30}
                />
              </div>
            </Col>
          </Row>
        </Grid>{" "}
        {/* Second Row */}
        <Grid sm={12} md={4} className="commonbackgroundDialogColor">
          <Row>
            <Col lg={true} className="commonbackgroundDialogColor">
              <div>
                <label style={{ marginTop: "1rem" }}>Last Name</label>
              </div>
              <div>
                <input
                  className="mt-2 p-2"
                  value={nomineeData.LastName}
                  onChange={(e) =>
                    setNomineeData({ ...nomineeData, LastName: e.target.value })
                  }
                  placeholder="Enter Last Name"
                  type="text"
                  maxLength={30}
                />
              </div>
            </Col>
            <Col lg={true}>
              <div>
                <label style={{ marginTop: "1rem" }}>
                  Relation <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <select
                  className="prefixCss mt-2"
                  value={nomineeData.Relation}
                  onChange={(e) => {
                    setNomineeData({
                      ...nomineeData,
                      Relation: e.target.value,
                    });
                  }}
                >
                  {" "}
                  <option disabled selected hidden value="">
                    Select option
                  </option>
                  {RelationOptions.map((item, idx) => {
                    return (
                      <>
                        <option
                          key={idx}
                          value={item.value}
                        >{`${item.value}`}</option>
                      </>
                    );
                  })}
                </select>
              </div>
            </Col>

            <Col lg={true}>
              <div>
                <label style={{ marginTop: "1rem" }}>
                  D.O.B <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <input
                  className="mt-2 p-2"
                  value={nomineeData.DOB}
                  onChange={(e) => {
                    const age = getAgeFromDOB(e.target.value);
                    if (age >= 0) {
                      setNomineeData({
                        ...nomineeData,
                        DOB: e.target.value,
                        IsNomineeMinor: age < 18,
                        GuardianDetails:
                          age < 18
                            ? deepCopy(initialNomineeData.GuardianDetails)
                            : null,
                      });
                    } else {
                      toast.error("Age is invalid.");
                      e.target.value = new Date();
                    }
                  }}
                  type="date"
                  onKeyDown={(e) => e.preventDefault()}
                />
              </div>
            </Col>
          </Row>
        </Grid>{" "}
        {/* Third Row */}
        <Grid sm={12} md={4} className="commonbackgroundDialogColor">
          <Row>
            <Col lg={true} className="commonbackgroundDialogColor">
              <div>
                <label style={{ marginTop: "1rem" }}>
                  Email Address <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <input
                  className="mt-2 p-2"
                  value={nomineeData.Email}
                  onChange={(e) =>
                    setNomineeData({ ...nomineeData, Email: e.target.value })
                  }
                  placeholder="Enter Email Address"
                  type="text"
                  maxLength={50}
                />
              </div>
            </Col>
            <Col lg={true}>
              <div>
                <label style={{ marginTop: "1rem" }}>
                  Mobile <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <input
                  className="mt-2 p-2 inputNewCss"
                  value={nomineeData.Mobile}
                  maxLength={10}
                  onChange={(e) =>
                    setNomineeData({
                      ...nomineeData,
                      Mobile: e.target.value.replace(/[^0-9]/gi, ""),
                    })
                  }
                  placeholder="Enter Mobile Number"
                  type="text"
                />
              </div>
            </Col>
            <Col lg={true}>
              <div></div>
            </Col>
          </Row>
        </Grid>{" "}
        {/* Forth Row */}
        <Grid className="commonbackgroundDialogColor">
          <Row>
            <Col className="commonbackgroundDialogColor" sm="8">
              <div>
                <label style={{ marginTop: "1rem" }}>
                  Address Line 1 <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <input
                  className="mt-2 p-2"
                  value={nomineeData.Address1}
                  onChange={(e) =>
                    setNomineeData({ ...nomineeData, Address1: e.target.value })
                  }
                  placeholder="Address Line 1"
                  type="text"
                  maxLength={20}
                />
              </div>
            </Col>
            <Col>
              <div>
                <label style={{ marginTop: "1rem" }}>Address Line 2</label>
              </div>
              <div>
                <input
                  className="mt-2 p-2"
                  value={nomineeData.Address2}
                  onChange={(e) =>
                    setNomineeData({ ...nomineeData, Address2: e.target.value })
                  }
                  placeholder="Address Line 2"
                  type="text"
                  maxLength={20}
                />
              </div>
            </Col>
          </Row>
        </Grid>{" "}
        {/* Fifth Row */}
        <Grid sm={12} md={4} className="commonbackgroundDialogColor">
          <Row>
            <Col lg={true} className="commonbackgroundDialogColor">
              <div>
                <label style={{ marginTop: "1rem" }}>Address Line 3</label>
              </div>
              <div>
                <input
                  className="mt-2 p-2"
                  value={nomineeData.Address3}
                  onChange={(e) =>
                    setNomineeData({ ...nomineeData, Address3: e.target.value })
                  }
                  placeholder="Adddress Line 3"
                  type="text"
                  maxLength={20}
                />
              </div>
            </Col>
            <Col lg={true}>
              <div>
                <label style={{ marginTop: "1rem" }}>
                  Country<span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <input
                  className="mt-2 p-2"
                  value={nomineeData.Country}
                  onChange={(e) =>
                    setNomineeData({ ...nomineeData, Country: e.target.value })
                  }
                  placeholder="Enter Country"
                  type="text"
                  maxLength={30}
                />
              </div>
            </Col>

            <Col lg={true}>
              <div>
                <label style={{ marginTop: "1rem" }}>
                  Pin Code <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <input
                  className="mt-2 p-2 inputNewCss"
                  value={nomineeData.PinCode}
                  maxLength={6}
                  onChange={(e) =>
                    setNomineeData({
                      ...nomineeData,
                      PinCode: e.target.value.replace(/[^0-9]/gi, ""),
                    })
                  }
                  placeholder="Enter Pin Code"
                  type="text"
                />
              </div>
            </Col>
          </Row>
        </Grid>{" "}
        {/* Sixth Row */}
        <Grid sm={12} md={4} className="commonbackgroundDialogColor">
          <Row>
            <Col lg={true} className="commonbackgroundDialogColor">
              <div>
                <label style={{ marginTop: "1rem" }}>
                  City <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <input
                  className="mt-2 p-2"
                  value={nomineeData.City}
                  onChange={(e) =>
                    setNomineeData({ ...nomineeData, City: e.target.value })
                  }
                  placeholder="Enter City"
                  type="text"
                  maxLength={30}
                />
              </div>
            </Col>
            <Col lg={true}>
              <div>
                <label style={{ marginTop: "1rem" }}>
                  State <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <input
                  className="mt-2 p-2"
                  value={nomineeData.State}
                  onChange={(e) =>
                    setNomineeData({ ...nomineeData, State: e.target.value })
                  }
                  placeholder="Enter State"
                  type="text"
                  maxLength={30}
                />
              </div>
            </Col>

            <Col lg={true}>
              <div>
                <label style={{ marginTop: "1rem" }}>
                  Share (in %) <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <input
                  className="mt-2 p-2 inputNewCss"
                  value={nomineeData.SharePercentage}
                  onChange={(e) => {
                    console.log("sharepercent raw", e.target.value);
                    setNomineeData({
                      ...nomineeData,
                      SharePercentage:
                        Number(e.target.value.replace(/[^0-9]/gi, "")) || "",
                    });
                  }}
                  maxLength={3}
                  // maxValue={100}
                  placeholder="Enter Share in %"
                  type="text"
                />
              </div>
            </Col>
          </Row>
        </Grid>{" "}
        {/* Seventh Row */}
        <Grid sm={12} md={4} className="commonbackgroundDialogColor">
          <Row>
            <Col lg={true} className="commonbackgroundDialogColor">
              <div>
                <label style={{ marginTop: "1rem" }}>
                  Proof <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <select
                  className="prefixCss mt-2"
                  value={nomineeData.ProofType}
                  onChange={(e) =>
                    setNomineeData({
                      ...nomineeData,
                      ProofType: e.target.value,
                    })
                  }
                >
                  {ProofOptions.map((item, idx) => {
                    return (
                      <option
                        key={idx}
                        value={item.value}
                        // style={{ margin: "100px !important" }}
                      >{`${item.value}`}</option>
                    );
                  })}
                </select>
              </div>
            </Col>
            <Col lg={true}>
              <div>
                <label style={{ marginTop: "1rem" }}>
                  ID Proof Number <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <div>
                <input
                  className="mt-2 p-2"
                  value={nomineeData.ProofNumber}
                  onChange={(e) =>
                    setNomineeData({
                      ...nomineeData,
                      ProofNumber: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Enter ID Proof Number"
                  type="text"
                  maxLength={30}
                />
                <br />
                <small style={{ color: "grey" }}>
                  {" "}
                  In case of Aadhaar, enter last 4 digits only
                </small>
              </div>
            </Col>

            <Col lg={true}>
              <div>
                <label style={{ marginTop: "1rem" }}>
                  Upload Proof <span style={{ color: "red" }}>*</span>
                  <small style={{ color: "grey" }}>
                    {" "}
                    (only jpg, png & pdf)
                  </small>
                </label>
              </div>
              <div>
                <input
                  className="mt-2 p-2"
                  //  style={{ padding: "0.75rem" }}
                  ref={nomineeFileRef}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const [file] = e.target.files || e.dataTransfer.files;
                    if (file.size > 5000000) {
                      toast.error("File Size cannot be more than 5MB");
                      e.target.value = null;
                      return;
                    }
                    if (!isValidFile(file)) {
                      e.target.value = null;
                      return toast.error("File Type is invalid!");
                    }
                    setNomineeData({
                      ...nomineeData,
                      ProofDocument: file,
                    });
                  }}
                  accept="application/pdf,image/*"
                  type="file"
                />
                <br />

                <small style={{ color: "grey" }}>
                  File Size cannot be more than 5MB
                </small>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "end",
                    marginTop: "0px",
                  }}
                >
                  <button
                    type="button"
                    class="btn btn-link mt-0 btn-sm"
                    onClick={() => {
                      let file;
                      if (nomineeData.ProofPath) {
                        file = nomineeData.ProofPath;
                      } else if (nomineeData.ProofDocument) {
                        file = URL.createObjectURL(nomineeData.ProofDocument);
                      } else {
                        return toast.error("Please choose the File.");
                      }
                      window.open(file, "_blank");
                    }}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    class="btn btn-link mt-0 btn-sm"
                    onClick={() => {
                      nomineeFileRef.current.value = null;
                      setNomineeData({
                        ...nomineeData,
                        ProofDocument: null,
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
        {nomineeData.IsNomineeMinor && (
          <div className="mt-3">
            <h3>Guardian Details</h3>
            <Grid sm={12} md={4} className="commonbackgroundDialogColor">
              <Row>
                <Col lg={true} className="commonbackgroundDialogColor">
                  <div>
                    <label>Prefix</label>
                  </div>
                  <div>
                    <select
                      className="mt-2 prefixCss pl-0"
                      value={nomineeData.GuardianDetails.Prefix}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            Prefix: e.target.value,
                          },
                        })
                      }
                    >
                      {PrefixOptions.map((item, idx) => {
                        return (
                          <option
                            key={idx}
                            value={item.value}
                            // style={{ margin: "100px !important" }}
                          >{`${item.value}`}</option>
                        );
                      })}
                    </select>
                  </div>
                </Col>
                <Col lg={true}>
                  <div>
                    <label>
                      First Name <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div>
                    <input
                      required={true}
                      className="mt-2 p-2"
                      value={nomineeData.GuardianDetails.FirstName}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            FirstName: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter First Name"
                      type="text"
                      maxLength={30}
                    />
                  </div>
                </Col>

                <Col lg={true}>
                  <div>
                    <label>Middle Name</label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2"
                      value={nomineeData.GuardianDetails.MiddleName}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            MiddleName: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter Middle Name"
                      type="text"
                      maxLength={30}
                    />
                  </div>
                </Col>
              </Row>
            </Grid>{" "}
            {/* Second Row */}
            <Grid sm={12} md={4} className="commonbackgroundDialogColor">
              <Row>
                <Col lg={true} className="commonbackgroundDialogColor">
                  <div>
                    <label style={{ marginTop: "1rem" }}>Last Name</label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2"
                      value={nomineeData.GuardianDetails.LastName}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            LastName: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter Last Name"
                      type="text"
                      maxLength={30}
                    />
                  </div>
                </Col>
                <Col lg={true}>
                  <div>
                    <label style={{ marginTop: "1rem" }}>
                      Relation <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div>
                    <select
                      className="prefixCss mt-2"
                      value={nomineeData.GuardianDetails.Relation}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            Relation: e.target.value,
                          },
                        })
                      }
                    >
                      {" "}
                      <option disabled selected hidden value="">
                        Select option
                      </option>
                      {["Mother", "Father"].map((item, idx) => {
                        return (
                          <option
                            key={idx}
                            value={item}
                            // style={{ margin: "100px !important" }}
                          >{`${item}`}</option>
                        );
                      })}
                    </select>
                  </div>
                </Col>

                <Col lg={true}>
                  <div>
                    <label style={{ marginTop: "1rem" }}>
                      D.O.B <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2"
                      value={nomineeData.GuardianDetails.DOB}
                      onChange={(e) => {
                        const age = getAgeFromDOB(e.target.value);
                        if (age >= 0) {
                          if (age < 18) {
                            toast.error(
                              "Guardian Cannot be less than 18 years old"
                            );
                          } else
                            setNomineeData({
                              ...nomineeData,
                              GuardianDetails: {
                                ...nomineeData.GuardianDetails,
                                DOB: e.target.value,
                              },
                            });
                        } else {
                          toast.error("Age is invalid.");
                          e.target.value = new Date();
                        }
                      }}
                      type="date"
                      onKeyDown={(e) => e.preventDefault()}
                    />
                  </div>
                </Col>
              </Row>
            </Grid>{" "}
            {/* Third Row */}
            <Grid sm={12} md={4} className="commonbackgroundDialogColor">
              <Row>
                <Col lg={true} className="commonbackgroundDialogColor">
                  <div>
                    <label style={{ marginTop: "1rem" }}>
                      Email Address <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2"
                      value={nomineeData.GuardianDetails.Email}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            Email: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter Email Address"
                      type="text"
                      maxLength={50}
                    />
                  </div>
                </Col>
                <Col lg={true}>
                  <div>
                    <label style={{ marginTop: "1rem" }}>
                      Mobile <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2 inputNewCss"
                      value={nomineeData.GuardianDetails.Mobile}
                      maxLength={10}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            Mobile: e.target.value.replace(/[^0-9]/gi, ""),
                          },
                        })
                      }
                      placeholder="Enter Mobile Number"
                      type="text"
                    />
                  </div>
                </Col>
                <Col lg={true}>
                  <div></div>
                </Col>
              </Row>
            </Grid>{" "}
            {/* Forth Row */}
            <Grid className="commonbackgroundDialogColor">
              <Row>
                <Col className="commonbackgroundDialogColor" sm="8">
                  <div>
                    <label style={{ marginTop: "1rem" }}>
                      Address Line 1 <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2"
                      value={nomineeData.GuardianDetails.Address1}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            Address1: e.target.value,
                          },
                        })
                      }
                      placeholder="Address Line 1"
                      type="text"
                      maxLength={20}
                    />
                  </div>
                </Col>
                <Col>
                  <div>
                    <label style={{ marginTop: "1rem" }}>Address Line 2</label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2"
                      value={nomineeData.GuardianDetails.Address2}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            Address2: e.target.value,
                          },
                        })
                      }
                      placeholder="Address Line 2"
                      type="text"
                      maxLength={20}
                    />
                  </div>
                </Col>
              </Row>
            </Grid>{" "}
            {/* Fifth Row */}
            <Grid sm={12} md={4} className="commonbackgroundDialogColor">
              <Row>
                <Col lg={true} className="commonbackgroundDialogColor">
                  <div>
                    <label style={{ marginTop: "1rem" }}>Address Line 3</label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2"
                      value={nomineeData.GuardianDetails.Address3}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            Address3: e.target.value,
                          },
                        })
                      }
                      placeholder="Address Line 3"
                      type="text"
                      maxLength={20}
                    />
                  </div>
                </Col>
                <Col lg={true}>
                  <div>
                    <label style={{ marginTop: "1rem" }}>
                      Country <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2"
                      value={nomineeData.GuardianDetails.Country}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            Country: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter Country"
                      type="text"
                      maxLength={30}
                    />
                  </div>
                </Col>

                <Col lg={true}>
                  <div>
                    <label style={{ marginTop: "1rem" }}>
                      Pin Code <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2 inputNewCss"
                      value={nomineeData.GuardianDetails.PinCode}
                      maxLength={6}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            PinCode: e.target.value.replace(/[^0-9]/gi, ""),
                          },
                        })
                      }
                      placeholder="Enter Pin Code"
                      type="text"
                    />
                  </div>
                </Col>
              </Row>
            </Grid>{" "}
            {/* Sixth Row */}
            <Grid sm={12} md={4} className="commonbackgroundDialogColor">
              <Row>
                <Col lg={true} className="commonbackgroundDialogColor">
                  <div>
                    <label style={{ marginTop: "1rem" }}>
                      City <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2"
                      value={nomineeData.GuardianDetails.City}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            City: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter City"
                      type="text"
                      maxLength={30}
                    />
                  </div>
                </Col>
                <Col lg={true}>
                  <div>
                    <label style={{ marginTop: "1rem" }}>
                      State <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2"
                      value={nomineeData.GuardianDetails.State}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            State: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter State"
                      type="text"
                      maxLength={30}
                    />
                  </div>
                </Col>
                <Col></Col>
              </Row>
            </Grid>{" "}
            {/* Seventh Row */}
            <Grid sm={12} md={4} className="commonbackgroundDialogColor">
              <Row>
                <Col lg={true} className="commonbackgroundDialogColor">
                  <div>
                    <label style={{ marginTop: "1rem" }}>
                      Proof <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div>
                    <select
                      className="prefixCss mt-2"
                      value={nomineeData.GuardianDetails.ProofType}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            ProofType: e.target.value,
                          },
                        })
                      }
                    >
                      {ProofOptions.map((item, idx) => {
                        return (
                          <option
                            key={idx}
                            value={item.value}
                            // style={{ margin: "100px !important" }}
                          >{`${item.value}`}</option>
                        );
                      })}
                    </select>
                  </div>
                </Col>
                <Col lg={true}>
                  <div>
                    <label style={{ marginTop: "1rem" }}>
                      ID Proof Number <span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2"
                      value={nomineeData.GuardianDetails.ProofNumber}
                      onChange={(e) =>
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            ProofNumber: e.target.value.toUpperCase(),
                          },
                        })
                      }
                      placeholder="Enter ID Proof Number"
                      type="text"
                      maxLength={30}
                    />
                    <br />
                    <small style={{ color: "grey" }}>
                      {" "}
                      In case of Aadhaar, enter last 4 digits only
                    </small>
                  </div>
                </Col>

                <Col lg={true}>
                  <div>
                    <label style={{ marginTop: "1rem" }}>
                      Upload Proof <span style={{ color: "red" }}>*</span>
                      <small style={{ color: "grey" }}>
                        {" "}
                        (only jpg, png & pdf)
                      </small>
                    </label>
                  </div>
                  <div>
                    <input
                      className="mt-2 p-2"
                      ref={guardianNomineeFileRef}
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const [file] = e.target.files || e.dataTransfer.files;
                        if (file.size > 5000000) {
                          toast.error("File Size cannot be more than 5MB");
                          e.target.value = null;
                          return;
                        }
                        if (!isValidFile(file)) {
                          e.target.value = null;
                          return toast.error("File Type is invalid!");
                        }
                        setNomineeData({
                          ...nomineeData,
                          GuardianDetails: {
                            ...nomineeData.GuardianDetails,
                            ProofDocument: file,
                          },
                        });
                      }}
                      accept="application/pdf,image/*"
                      type="file"
                    />
                    <br />
                    <small style={{ color: "grey" }}>
                      File Size cannot be more than 5MB
                    </small>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "end",
                      }}
                    >
                      <button
                        type="button"
                        class="btn btn-link mt-0 btn-sm"
                        onClick={() => {
                          let file;
                          if (nomineeData.GuardianDetails.ProofPath) {
                            file = nomineeData.GuardianDetails.ProofPath;
                          } else if (
                            nomineeData.GuardianDetails.ProofDocument
                          ) {
                            file = URL.createObjectURL(
                              nomineeData.GuardianDetails.ProofDocument
                            );
                          } else {
                            return toast.error("Please choose the File.");
                          }
                          window.open(file, "_blank");
                        }}
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        class="btn btn-link mt-0 btn-sm"
                        onClick={() => {
                          guardianNomineeFileRef.current.value = null;
                          setNomineeData({
                            ...nomineeData,
                            GuardianDetails: {
                              ...nomineeData.GuardianDetails,
                              ProofDocument: null,
                            },
                          });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Grid>
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button
            style={{
              color: "#0CA750",
              width: "378.4px",
              height: "55px",
              marginTop: "4em",
              borderRadius: "8px",
              // marginLeft: "6.9em",
              border: "1px solid #0CA750",
            }}
            className="email_form"
            onClick={closeDialog}
          >
            Cancel
          </Button>

          <Button
            style={{
              color: "white",
              width: "378.4px",
              height: "55px",
              marginTop: "4em",
              borderRadius: "8px",
              marginLeft: "10px",
              background: "#0CA750",
              border: "1px solid rgba(174, 176, 190, 0.5)",
            }}
            className="email_form"
            // disabled={}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </div>
    </Form>
     <div>
      {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
     </div>
     </>
  );
}
