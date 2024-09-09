import React, { useState, useEffect } from 'react'
import Mobile from "../Mobile/Mobile"
import Email from "../Email/Email";
import NavContext from '../../Context/NavContext';
import Container from '../Container/Container';
import Navbar from '../Navbar/Navbar'
import MobileAndEmail from '../MobileAndEmail/MobileAndEmail';
import RightNavbar from '../RightNavbar/RightNavbar';
import { toast } from 'react-toastify';
import { color } from '@mui/system';


const updateOptions = [
    { code: 1, value: 'Mobile Number' },
    { code: 2, value: 'Email Id' },
    { code: 3, value: 'Mobile Number & Email Id' }
];

const selectTypeStyle = {
    fontWeight: '400',
    fontSize: '22px',
    paddingLeft: '10px'
};

const UpdateContactDetails = ({ baseReq, setBaseReq, store, setStore, setIsLoggedIn, setIsVerified, eSignBtn, setESignBtn,
    emaileSignBtn, setEmaileSignBtn, eMobAndEmailSign, seteMobileAndEmailSign, currentOption, setCurrentOption,
    isMobEmailSubmit, setisMobEmailSubmit, onlyMobile, setOnlyMobile }) => {
 
    const toastIdMobile = 'mobile123';
    const toastIdMail = 'mail123';
    const toastIdMobileEmail = 'mobile_email_123';
    const [nav, setNav] = useState(false);
    const value = { nav, setNav };
    useEffect(() => {
    }, []);

    window.popstate = () => {
        window.location.reload();
    }

    const handleDropDown = (e) => {
        toast.dismiss(toastIdMobile);
        toast.dismiss(toastIdMail);
        toast.dismiss(toastIdMobileEmail);
        setESignBtn(false);
        const currentCode = updateOptions.find(item => item.value === e.target.value);
        console.log(currentCode);
        setCurrentOption({ code: currentCode.code, value: e.target.value });
        setBaseReq({
            userUccCode: baseReq.userUccCode,
            userProduct: "CDU",
            userDevice: "Web",
            userEmailId: "",
            userCode: "",
            userOldMobile: "",
            userMobile: "",
            otp: "",
            userEmail: "",

        });
    }
    return (
        <>
            <NavContext.Provider value={value}>
                <Navbar store={store} />
                <Container stickyNav={<RightNavbar store={store} setIsLoggedIn={setIsLoggedIn} setStore={setStore} />}
                    content={
                        <div className='updateContact'>
                            <h1>Update Contact Details</h1>
                            <p className='mobile_p'>Keep your contact details updated to receive on-time updates for your account.</p>
                            {!eSignBtn && !emaileSignBtn && !eMobAndEmailSign && <div className='email_form'>
                                <p style={selectTypeStyle}>Select Type</p>
                                <label>
                                    <select value={currentOption.value} onChange={handleDropDown}>
                                        {updateOptions.map((item) => {
                                            return (
                                                <option value={item.value}>{`${item.value}`}</option>
                                            )
                                        })}
                                    </select>
                                </label>


                            </div>}
                            {currentOption.code === 1 && <Mobile currentOption={currentOption} baseReq={baseReq} setBaseReq={setBaseReq} store={store} setStore={setStore} setIsLoggedIn={setIsLoggedIn}
                                setIsVerified={setIsVerified} eSignBtn={eSignBtn} setESignBtn={setESignBtn}
                                isMobEmailSubmit={isMobEmailSubmit} setisMobEmailSubmit={setisMobEmailSubmit} />}
                            {currentOption.code === 2 && <Email currentOption={currentOption} baseReq={baseReq} setBaseReq={setBaseReq} store={store} setStore={setStore} setIsLoggedIn={setIsLoggedIn} setIsVerified={setIsVerified}
                                emaileSignBtn={emaileSignBtn} setEmaileSignBtn={setEmaileSignBtn} setCurrentOption={setCurrentOption}
                                isMobEmailSubmit={isMobEmailSubmit} setisMobEmailSubmit={setisMobEmailSubmit} />}
                            {currentOption.code === 3 && <MobileAndEmail currentOption={currentOption} baseReq={baseReq} setBaseReq={setBaseReq} store={store} setStore={setStore} setIsLoggedIn={setIsLoggedIn} setIsVerified={setIsVerified}
                                eSignBtn={eSignBtn} eMobAndEmailSign={eMobAndEmailSign} seteMobileAndEmailSign={seteMobileAndEmailSign}
                                setCurrentOption={setCurrentOption} isMobEmailSubmit={isMobEmailSubmit} setisMobEmailSubmit={setisMobEmailSubmit}
                                onlyMobile={onlyMobile} setOnlyMobile={setOnlyMobile} />}

                        </div>
                    }
                />

            </NavContext.Provider>
        </>
    )
}

export default UpdateContactDetails