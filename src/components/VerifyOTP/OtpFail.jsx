import React from 'react'
import Stox from "../../assets/stoxkart.svg";
import Fail from "../../assets/fail.svg"


const OtpFail = () => {
    const [IsOpen, setIsOpen] = React.useState(false);
  return (
<div className='suceess'>
        <div className='otpsucess'>
                <img src={Stox} alt=""/>
        <button onClick={setIsOpen(false)}>X</button>
        </div>
        
        <div className='center'>
            <img src={Fail} alt=""/>
            <h6>OTP Verification Failed</h6>
            <p>Please enter your Valied OTP</p>
        </div>
    </div>
  )
}

export default OtpFail