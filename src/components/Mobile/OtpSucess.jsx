import React from 'react'
import Stox from "../../assets/stox.png"
import Done from "../../assets/Success.gif"

const OtpSucess = ({setModalOpen, isOpen}) => {

  return (
    <div className='successopen'>
    <div className='suceess'>
        <div className='otpsucess'>
                {/* <img src={Stox} alt="" style={{marginLeft: "-67em"}}/> */}
        {/* <button className='close' onClick={setModalOpen(false)}>X</button> */}
        </div>

        <div className='center_1'>
        <img src={Done} alt="" style={{width: "20%", height: "20%"}}/>
        <div className='fail_section'>
            <h6>OTP Verified Successfully</h6>
</div>
        </div>
    </div>
    </div>
  )
}

export default OtpSucess