import React from 'react';
import Stox from "../../assets/stoxkart.svg"
import Bank from "../../assets/bank.svg"

const Verifying = () => {
  function closeModal({setIsOpen}) {
    setIsOpen(true);
  }
  return (
    <div>
              <img src={Stox} alt=""/>
      
        <button className='close' onClick={closeModal}>X</button>
        <div className='main'>
           <div>
               <img src={Bank} alt="" className='image'/>
               <h6>Verifying your OTP</h6>
               <p>  This may take up to <span>10 seconds    </span>                    
      <br></br>Please wait, Don't close this page </p>
           </div>
    </div>
    </div>
  )
}

export default Verifying