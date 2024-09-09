import React from 'react';
import Stox from "../../assets/stox.png"
import Smc from "../../assets/smclogo.PNG"

const Header = () => {
  return (
    <div className='header'>
    <div className='image_header'>
        <img src={Stox} height={60} alt=""/>
    </div>
    </div>
  )
}

export default Header