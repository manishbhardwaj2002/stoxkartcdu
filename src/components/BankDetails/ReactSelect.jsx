import React, { useState } from "react";
import { useEffect } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";

const ReactSelect = ({ store, baseReq }) => {
  const [items, setItems] = useState([]);
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  useEffect(() => {
    loadUser();
  }, [inputValue]);
  // handle input change event
  const handleInputChange = (value) => {
    setValue(value);
  };
  // handle selection
  const handleChange = (value) => {
    setSelectedValue(value);
  };
  async function loadUser() {
    const userData = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: "17.0.16.201",
      userDevice: "Web",
      userEmailId: store.userEmail,
      userMobileNumber: store.userMobile,
      bankIFSC: selectedValue,
    };
    try {
      const res = await axios.post(
        "https://ekyc.smctradeonline.com/ClientDemographicAPI-SMC/Bank/getBankByIFSC",
        userData,
        {
          withCredentials: true,
        }
      );
      console.log(res.data.data);
      setUsers(res.data.data);
    } catch (e) {

      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      console.log(e);
    }
  }
  return (
    <>
      <AsyncSelect
        getOptionValue={(e) => e.id}
        loadOptions={loadUser}
        onInputChange={handleInputChange}
        onChange={handleChange}
      />
       {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
    </>
  );
};

export default ReactSelect;
