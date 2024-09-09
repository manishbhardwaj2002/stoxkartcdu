import "./App.css";
import { useState, useEffect, useRef, useContext } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Redirect,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Container from "./components/Container/Container";
import RightNavbar from "./components/RightNavbar/RightNavbar";
import Dashboard from "./components/Dashboard/Dashboard";
import Analytics from "./components/Analytics/Analytics";
import Campaings from "./components/Campaigns/Campaings";
import Team from "./components/Team/Team";
import Section from "./components/Section/Section";
import VerifyOtp from "./components/VerifyOTP/VerifyOtp";
import Mobile from "./components/Mobile/Mobile";
import MobileOtp from "./components/Mobile/MobileOtp";
import Email from "./components/Email/Email";
import EmailOtp from "./components/Email/EmailOtp";
import Bank from "./components/BankDetails/Bank";
import Segment from "./components/Segment/Segment";
import UpdateContact from "./components/UpdateContact/UpdateContactDetails";
import Mtf from "./components/MTF/Mtf";
import IdleTimerContainer from "./components/Ideal/IdealTimerConatiner";
import { ToastContainer } from "../node_modules/react-toastify/dist/react-toastify.esm";
import axios from "axios";

import NavContext from "./Context/NavContext";
import Home from "./components/Home";
import Sign from "./components/BankDetails/Sign";
import NotFOund from "./components/NotFOund";
import BankFail from "./components/BankDetails/BankFail";
import BankSuccess from "./components/BankDetails/BankSuccess";
import Protected from "./components/Protected";
import PrivateRoutes from "./components/PrivateRoute";
import { BrowserHistory } from "history";
import { UNSAFE_NavigationContext } from "react-router-dom";
import MobileAndEmail from "./components/MobileAndEmail/MobileAndEmail";
import NomineeContactDetails from "./components/NomineeDetails";

function App() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const timerId = useRef(null);
  const renderCount = useRef(1);
  const [store, setStore] = useState({});
  const [isVerified, setIsVerified] = useState(false);
  const [data, setData] = useState([]);
  const [segments, setSegments] = useState({});
  const [alldata, setAllData] = useState({});
  const [counter, setCounter] = useState(10);
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState({});
  const [getFile, setGetFile] = useState({});
  const [eSignBtn, setESignBtn] = useState(false);
  const [emaileSignBtn, setEmaileSignBtn] = useState(false);
  const [eMobAndEmailSign, seteMobileAndEmailSign] = useState(false);
  const [currentOption, setCurrentOption] = useState({
    code: 1,
    value: "Mobile Number",
  });
  const [isMobEmailSubmit, setisMobEmailSubmit] = useState(false);
  const [onlyMobile, setOnlyMobile] = useState(false);
  const [mobData, setMobData] = useState(false);
  //creating IP state
  const [ip, setIP] = useState("");
  const [bankDataEsign, setBankDataEsign] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //creating function to load ip address from the API
  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    sessionStorage.setItem("ip", res.data.IPv4);
    setIP(res.data.IPv4);
  };

  useEffect(() => {
    //passing getData method to the lifecycle method
    getData();
  }, []);

  useEffect(() => {
    if (counter > 0) {
      setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
    }
  }, [counter]);

  useEffect(() => {
    const res = window.sessionStorage.getItem("store");
    // const res = getCookie('store');
    if (res !== null) {
      setStore(JSON.parse(res));
      setIsLoggedIn(window.sessionStorage.getItem("isLoggedIn"));
    }
  }, []);

  // useEffect(()=> {
  //   if(sessionStorage !==undefined){
  //     const result = sessionStorage.getItem('data');

  //     if(result !==  null) {

  //       setData(JSON.parse(result))
  //       setIsLoggedIn(true)
  //     }

  //   }
  // },[])

  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  });

  useEffect(() => {
    const autoLogout = () => {
      if (document.visibilityState === "hidden") {
        // set timer to log user out
        const id = window.setTimeout(() => setIsLoggedOut(false), 10 * 1000);
        timerId.current = id;
      } else {
        // clear existing timer
        window.clearTimeout(timerId.current);
      }
    };

    document.addEventListener("visibilitychange", autoLogout);

    return () => document.removeEventListener("visibilitychange", autoLogout);
  }, []);

  const [baseReq, setBaseReq] = useState({
    userUccCode: "",
    userProduct: "CDU",
    userIP: ip,
    userDevice: "Web",
    userEmailId: "",
    userCode: "",
    userOldMobile: "",
    userMobile: "",
    otp: "",
    userEmail: "",
  });

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Section
                baseReq={baseReq}
                setBaseReq={setBaseReq}
                store={store}
                setStore={setStore}
                segments={segments}
                setSegments={setSegments}
                mobData={mobData}
                setMobData={setMobData}
              />
            ) : (
              <Navigate to="/nominee-details" />
            )
          }
        />
        {/* <Route path="/mobile" element={<Home baseReq={baseReq} setBaseReq={setBaseReq} store={store} setStore={setStore} />} /> */}
        <Route
          path="/verify"
          element={
            !isLoggedIn ? (
              <VerifyOtp
                baseReq={baseReq}
                setBaseReq={setBaseReq}
                store={store}
                setStore={setStore}
                segments={segments}
                setSegments={setSegments}
                setIsLoggedIn={setIsLoggedIn}
                setIsVerified={setIsVerified}
                setESignBtn={setESignBtn}
                setEmaileSignBtn={setEmaileSignBtn}
                mobData={mobData}
                setMobData={setMobData}
                seteMobileAndEmailSign={seteMobileAndEmailSign}
              />
            ) : (
              <Navigate to="/nominee-details" />
            )
          }
        ></Route>

        {/* <Route path="/dashboard" element={<Dashboard baseReq={baseReq} setBaseReq={setBaseReq} store={store} setStore={setStore}/>}></Route> */}
        <Route
          path="/mobile"
          element={
            isLoggedIn ? (
              <Mobile
                baseReq={baseReq}
                setBaseReq={setBaseReq}
                store={store}
                setStore={setStore}
                setIsLoggedIn={setIsLoggedIn}
                setBankDataEsign={setBankDataEsign}
                bankDataEsign={bankDataEsign}
                setIsVerified={setIsVerified}
                isMobEmailSubmit={isMobEmailSubmit}
                setisMobEmailSubmit={setisMobEmailSubmit}
                onlyMobile={onlyMobile}
                setOnlyMobile={setOnlyMobile}
              />
            ) : (
              <Navigate to="/updateContact" />
            )
          }
        >
          {" "}
        </Route>
        <Route
          path="/mobileotp"
          element={
            isLoggedIn ? (
              <MobileOtp
                baseReq={baseReq}
                setBaseReq={setBaseReq}
                store={store}
                setStore={setStore}
                counter={counter}
                setIsLoggedIn={setIsLoggedIn}
                setIsVerified={setIsVerified}
                eSignBtn={eSignBtn}
                setESignBtn={setESignBtn}
                currentOption={currentOption}
                setBankDataEsign={setBankDataEsign}
                bankDataEsign={bankDataEsign}
                setCurrentOption={setCurrentOption}
                isMobEmailSubmit={isMobEmailSubmit}
                setisMobEmailSubmit={setisMobEmailSubmit}
                onlyMobile={onlyMobile}
                seteMobileAndEmailSign={seteMobileAndEmailSign}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>

        <Route
          path="/email"
          element={
            isLoggedIn ? (
              <Email
                baseReq={baseReq}
                setBaseReq={setBaseReq}
                store={store}
                setBankDataEsign={setBankDataEsign}
                bankDataEsign={bankDataEsign}
                setStore={setStore}
                setIsLoggedIn={setIsLoggedIn}
                setIsVerified={setIsVerified}
                emaileSignBtn={emaileSignBtn}
                setEmaileSignBtn={setEmaileSignBtn}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>
        <Route
          path="/emailotp"
          element={
            isLoggedIn ? (
              <EmailOtp
                baseReq={baseReq}
                setBaseReq={setBaseReq}
                setBankDataEsign={setBankDataEsign}
                bankDataEsign={bankDataEsign}
                store={store}
                setStore={setStore}
                counter={counter}
                setIsLoggedIn={setIsLoggedIn}
                setIsVerified={setIsVerified}
                emaileSignBtn={emaileSignBtn}
                setEmaileSignBtn={setEmaileSignBtn}
                currentOption={currentOption}
                setCurrentOption={setCurrentOption}
                eMobAndEmailSign={eMobAndEmailSign}
                seteMobileAndEmailSign={seteMobileAndEmailSign}
                isMobEmailSubmit={isMobEmailSubmit}
                setisMobEmailSubmit={setisMobEmailSubmit}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>

        <Route
          path="/bank"
          element={
            isLoggedIn ? (
              <Bank
                baseReq={baseReq}
                setBaseReq={setBaseReq}
                store={store}
                setStore={setStore}
                data={data}
                setData={setData}
                counter={counter}
                preview={preview}
                setPreview={setPreview}
                setIsLoggedIn={setIsLoggedIn}
                setIsVerified={setIsVerified}
                setBankDataEsign={setBankDataEsign}
                bankDataEsign={bankDataEsign}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>
        <Route
          path="/segment"
          element={
            isLoggedIn ? (
              <Segment
                baseReq={ip}
                setBaseReq={setBaseReq}
                store={store}
                setStore={setStore}
                setIsLoggedIn={setIsLoggedIn}
                setIsVerified={setIsVerified}
                setBankDataEsign={setBankDataEsign}
                bankDataEsign={bankDataEsign}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>
        <Route
          path="/updateContact"
          element={
            isLoggedIn ? (
              <UpdateContact
                baseReq={baseReq}
                setBaseReq={setBaseReq}
                store={store}
                setStore={setStore}
                setIsLoggedIn={setIsLoggedIn}
                setIsVerified={setIsVerified}
                eSignBtn={eSignBtn}
                setESignBtn={setESignBtn}
                emaileSignBtn={emaileSignBtn}
                setEmaileSignBtn={setEmaileSignBtn}
                currentOption={currentOption}
                setCurrentOption={setCurrentOption}
                eMobAndEmailSign={eMobAndEmailSign}
                seteMobileAndEmailSign={seteMobileAndEmailSign}
                isMobEmailSubmit={isMobEmailSubmit}
                setisMobEmailSubmit={setisMobEmailSubmit}
                onlyMobile={onlyMobile}
                setOnlyMobile={setOnlyMobile}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>
        <Route
          path="/nominee-details"
          element={
            isLoggedIn ? (
              <NomineeContactDetails
                baseReq={baseReq}
                setBaseReq={setBaseReq}
                store={store}
                setStore={setStore}
                currentOption={currentOption}
                setIsLoggedIn={setIsLoggedIn}
                setCurrentOption={setCurrentOption}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>

        {/* <Route path="/mtf" element={isLoggedIn ? <Mtf baseReq={baseReq} setBaseReq={setBaseReq} store={store} setStore={setStore} setIsLoggedIn={setIsLoggedIn} setIsVerified={setIsVerified}/> : <Navigate to="/" />}></Route> */}
        <Route
          path="/fail"
          element={
            isLoggedIn ? (
              <BankFail
                baseReq={baseReq}
                setBaseReq={setBaseReq}
                store={store}
                setStore={setStore}
                setIsLoggedIn={setIsLoggedIn}
                setBankDataEsign={setBankDataEsign}
                bankDataEsign={bankDataEsign}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>
        <Route
          path="/success"
          element={
            isLoggedIn ? (
              <BankSuccess
                baseReq={baseReq}
                setBaseReq={setBaseReq}
                store={store}
                setStore={setStore}
                setIsLoggedIn={setIsLoggedIn}
                setBankDataEsign={setBankDataEsign}
                bankDataEsign={bankDataEsign}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>
        <Route
          path="*"
          element={
            <NotFOund
              baseReq={baseReq}
              setBaseReq={setBaseReq}
              store={store}
              setStore={setStore}
              preview={preview}
              setPreview={setPreview}
            />
          }
        ></Route>
      </Routes>
      <ToastContainer limit={1} autoClose={2000} />
    </div>
  );
}

export default App;
