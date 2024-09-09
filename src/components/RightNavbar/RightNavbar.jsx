//STYLES
import styles from "./RightNavbar.module.scss";

//HOOKS
import { useContext, useEffect } from "react";
import Tooltip from 'react-tooltip-lite';
//CONTEXT
import NavContext from "../../Context/NavContext";
import { Link, useNavigate } from "react-router-dom"
//ICONS , IMAGES
import { MdOutlineMenu } from "react-icons/md";
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
//Components
import MyProfile from "./Submenus/MyProfile";
import Support from "./Submenus/Support";
import Notifications from "./Submenus/Notifications";
import Search from "./Submenus/Search";




const RightNavbar = ({ store, setStore, setIsLoggedIn, setIsVerified, setBankDataEsign, bankDataEsign }) => {

  const { nav, setNav } = useContext(NavContext);
  const navigate = useNavigate()
  const handleClick = () => {
    if (window.sessionStorage ? window.sessionStorage : localStorage !== undefined) {
      const res = window.sessionStorage.getItem('store')
      const responce = localStorage.getItem('bankDataEsign')
      const data = res ? res : responce !== null;
      if (data) {
        window.sessionStorage.clear();
        setStore({})

        setIsLoggedIn(false)

        navigate("/")
      }



    }








  }




  return (
    <div className={styles.container}>
      {/* BURGER */}
      <div
        className={styles.burger_container}
        onClick={() => {
          setNav(!nav);
        }}
      >
        <MdOutlineMenu />
      </div>

      {/* ACTIONS */}
      <div className={styles.actions}>
        {/* <Search /> */}
        <h6>Logout</h6>
        <PowerSettingsNewOutlinedIcon onClick={handleClick} style={{ fontSize: "1.5rem", color: "red", cursor: "pointer" }} />
        {/* <h5>Logout</h5> */}


      </div>


      {/* My Profile */}
      {/* <MyProfile /> */}
    </div>
  );
};

export default RightNavbar;
