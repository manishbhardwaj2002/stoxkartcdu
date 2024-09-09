import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useResendOTP from "./hook/resendOTP";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SessionDialogBox from "../SessionDialogBox";

function ResendOTP({
  renderTime,
  renderButton,
  setOTP,
  style,
  className,
  store,
  baseReq,
  setstore,
  setStore,
  OTP,
  ...props
}) {
  const [error, setError] = useState("");
  const [isSessionOpen, setIsSessionOpen] = React.useState(false);  
  const { remainingTime, setRemainingTime, handelResendClick, timeUp } =
    useResendOTP(props);

  const handleSubmit = async (e) => {
    e.preventDefault();
    handelResendClick();
    setOTP("");
    const userData = {
      userUccCode: store.userCode,
      userProduct: baseReq.userProduct,
      userIP: store.userIP,
      userDevice: "Web",
      userEmailId: store.userEmail,
      userCode: store.userCode,
      userMobileNumber: store.userMobile,
      userEmail: baseReq.userEmail,
      userOldEmail: store.userEmail,
      otp: "",
    };
    console.log(userData);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Email/sendOTP`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        { withCredentials: true }
      );

      const { data, error } = res.data;
      console.log(data);
      if (error) {
        setError(error);

        setTimeout(() => {
          setError(!error);
        }, 1000);
      } else if (data && data.result.flag == 1) {
        toast.success("OTP sent successfully");
        setTimeout(() => {}, 1000);
      }
    } catch (e) {

      if (e?.response?.status === 401) {
        setIsSessionOpen(true)
        return;
      }

      setError("Internal Server Error");
    }
  };
  return (
    <>
      <div className="styles">
        <div
          className={className || ""}
          data-testid="otp-resend-root"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            ...style,
          }}
        >
          <h6 className="did">Didn't receive the OTP?</h6>
          {!timeUp && (
            <button
              disabled={remainingTime > 0}
              onClick={handleSubmit}
              type="button"
              className={"resend_button_rem"}
            >
              Resend OTP
            </button>
          )}

          {timeUp && (
            <button
              disabled={remainingTime > 0}
              onClick={handleSubmit}
              type="button"
              className={"resend_button"}
            >
              Resend OTP
            </button>
          )}

          {!timeUp && <h3 className="heading3">in 00:{remainingTime} sec</h3>}
        </div>

        <div className="center">
          <h5 className="errors">{error}</h5>
        </div>
        {isSessionOpen ? <SessionDialogBox isSessionOpen={isSessionOpen}  setIsSessionOpen={setIsSessionOpen}/>:null}
      </div>
    </>
  );
}

ResendOTP.defaultProps = {
  maxTime: 60,
  timeInterval: 1000,
  style: {},
};

ResendOTP.propTypes = {
  onTimerComplete: PropTypes.func,
  onResendClick: PropTypes.func,
  renderTime: PropTypes.func,
  renderButton: PropTypes.func,
  maxTime: PropTypes.number,
  timeInterval: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default ResendOTP;
