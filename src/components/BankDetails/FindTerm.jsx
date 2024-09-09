import React,{ useState, useEffect } from "react";
import axios from "axios";
import SessionDialogBox from "../SessionDialogBox";

export default function FindTerm({
  users,
  store,
  baseReq,
  setUsers,
  setShowdetails,
  setUser,
  bankIFSC,
  setBankIFSC,
}) {
  const [value, setValue] = useState("");
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  

  useEffect(() => {
    if (bankIFSC && bankIFSC.length > 3) {
      loadUser();
    }
  }, [bankIFSC]);

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
    } catch (e) {

      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

    }
  }

  const onChange = (event) => {
    setBankIFSC(event.target.value.toUpperCase().trim());
  };

  const onSearch = (searchTerm) => {
    setBankIFSC(searchTerm);
    // our api to fetch the search result
    console.log("search ", searchTerm);
  };

  return (
    <div className="search-container">
      <div className="search-inner">
        <input type="text" value={bankIFSC} onChange={onChange} />
      </div>
      <div className="dropdown">
        {users
          .filter((item) => {
            const searchTerm = value.toLowerCase();
            const fullName = item.bankIFSC.toLowerCase();

            return (
              searchTerm &&
              fullName.startsWith(searchTerm) &&
              fullName !== searchTerm
            );
          })

          .map((item) => (
            <div
              onClick={() => onSearch(item.bankIFSC)}
              className="dropdown-row"
              key={item.bankIFSC}
            >
              {item.bankIFSC}
            </div>
          ))}
      </div>
      {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
    </div>
    
  );
}
