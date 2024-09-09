import React from 'react'
import Stox from "../../assets/stox.png";
import Fail from "../../assets/fail.svg"
import Cross from "../../assets/Fail.gif"


const OtpFail = ({setModalOpen, isOpen}) => {

      debugger;
  return (
    <div className='successopen'>
<div className='suceess'>
        <div className='otpsucess'>
                {/* <img src={Stox} alt=""/> */}
     
        </div>   <div className='center_1'>
            <img src={Cross} alt="" style={{width: "20%", height: "20%"}}/>
            <div className='fail_section'>
            <h6>OTP Verification Failed</h6>
            <p>Please enter your Valied OTP</p>
            </div>
        </div>
    </div>
    </div>
  )
}

export default OtpFail