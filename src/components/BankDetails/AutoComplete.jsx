import React, { useState } from "react";
import "./AutoComplete.css";
import axios from "axios";
import { useEffect } from "react";
import SessionDialogBox from "../SessionDialogBox";

const Autocomplete = ({
  users,
  store,
  baseReq,
  setUsers,
  setShowdetails,
  setUser,
  bankIFSC,
  setBankIFSC,
  resshow,
  setResShow,
}) => {
  const [searchtext, setSearchtext] = useState("");
  const [suggest, setSuggest] = useState([]);
  const [resfound, setResfound] = useState(true);
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  async function loadUser() {
    const userData = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: baseReq.ip,
      userDevice: baseReq.userDevice,
      userEmailId: store.userEmail,
      userMobileNumber: store.userMobile,
      bankIFSC: bankIFSC,
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
      setResShow(true);
    } catch (e) {

      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }


    }
  }

  const filterData = () => {
    if (bankIFSC.length == 0) {
      return;
    }

    let copyArr = [...users];

    copyArr = copyArr.filter((c) =>
      c.bankIFSC.trim().toUpperCase().includes(bankIFSC.trim().toUpperCase())
    );

    setUsers(copyArr);
  };

  useEffect(() => {
    filterData();
  }, [bankIFSC]);

  React.useEffect(() => {
    if (bankIFSC && bankIFSC.length > 3) {
      loadUser();
    }
  }, [bankIFSC]);

  const handleChange = (e) => {
    setBankIFSC(
      e.target.value
        .toUpperCase()
        .trim()
        .replace(/[^A-Za-z0-9]/gi, "")
    );

    // if(e.target.value.length > 3) {

    //   loadUser()

    // }

    // await loadUser()

    // let searchval = e.target.value;
    // let suggestion = [];
    // if (searchval.length > 0) {
    //   suggestion = users
    //     .sort()
    //     .filter((e) => e.toLowerCase().includes(searchval.toLowerCase()));
    //   setResfound(suggestion.length !== 0 ? true : false);
    // }
    // setSuggest(suggestion);
    // setSearchtext(searchval);
  };

  function handleKeyPress() {
    if (bankIFSC && bankIFSC.length > 3) {
      loadUser();
    }
  }

  const suggestedText = (value) => {
    console.log(value);
    setSearchtext(value);
    setSuggest([]);
  };

  const handleSuggestion = (val) => {
    setBankIFSC(val);

    setResShow(false);
    setShowdetails(true);

    const found = users.find((u) => u.bankIFSC == val);

    setUser(found);
  };

  const getSuggestions = () => {
    return (
      <>
        {resshow && (
          <ul>
            {users
              .filter((post) => {
                if (bankIFSC === "") {
                  return post;
                } else if (
                  post.bankIFSC.toLowerCase().includes(bankIFSC.toLowerCase())
                ) {
                  return post;
                }
              })
              .map((party, index) => {
                return (
                  <div key={index}>
                    <li onClick={() => handleSuggestion(party.bankIFSC)}>
                      {party.bankIFSC}
                    </li>
                  </div>
                );
              })}
          </ul>
        )}
      </>
    );
  };
  return (
    <div className="searchcontainer">
      <input
        type="text"
        placeholder="Search.."
        className="search"
        value={bankIFSC}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyPress(e)}
        required
        style={{ fontSize: "18px" }}
      />

      {users?.length > 0 && getSuggestions()}
      {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
    </div>
    
  );
};
export default Autocomplete;
