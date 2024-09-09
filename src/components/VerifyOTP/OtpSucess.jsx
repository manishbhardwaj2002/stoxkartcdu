import React from 'react'
import Stox from "../../assets/stoxkart.svg"

const OtpSucess = () => {
    const [IsOpen, setIsOpen] = React.useState(false);
  return (
    <div className='suceess'>
        <div className='otpsucess'>
                <img src={Stox} alt=""/>
        <button onClick={setIsOpen(false)}>X</button>
        </div>

        <div className='center'>
            <h6>OTP Verified Succsussfuly</h6>
        </div>
    </div>
  )
}

export default OtpSucess