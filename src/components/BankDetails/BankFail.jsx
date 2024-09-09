import React from 'react'
import Stox from "../../assets/stox.png";
import Fail from "../../assets/fail.svg"
import Cross from "../../assets/Fail.gif"


const BankFail = () => {

 
  return (
 
    <div className='successopen'>
<div className='suceess'>
        <div className='otpsucess'>
                {/* <img src={Stox} alt="" style={{display: "flex", marginLeft: "-66em"}}/> */}
     
        </div>   <div className='center_1'>
            <img src={Cross} alt="" style={{width: "20%", height: "20%"}}/>
            <div className='fail_section_1'>
            <h6>Bank Verification Failed</h6>
            <p>Please upload copy of your Cancelled Cheque in the next step</p>
            </div>
        </div>
    </div>
    </div>
   
  )
}

export default BankFail