import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";

const AsyncBar = () => {
  const [collabs, setCollabs] = useState("");
  const [query, setQuery] = useState("");
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  useEffect(() => {
    loadUser();
  }, [query]);
  async function loadUser() {
    const userData = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: "17.0.16.201",
      userDevice: "Web",
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
      console.log(res.data.data);
    } catch (e) {

      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }
      console.log(e);
    }
  }

  const animatedComponents = makeAnimated();

  return (
    <>
      <AsyncSelect
        cacheOptions
        components={animatedComponents}
        getOptionLabel={(e) => e.bankIFSC}
        getOptionVAlue={(e) => e.id}
        loadOptions={loadUser}
        onInputChange={(value) => setQuery(value)}
        onChange={(value) => setCollabs(value)}
      />
       {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
    </>
  );
};

export default AsyncBar;
