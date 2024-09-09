//STYLES
import styles from "./Navbar.module.scss";
import {AiOutlineMobile,AiOutlineMail,AiOutlineBank,AiOutlineFolderOpen,AiOutlineFileSearch} from "react-icons/ai"
//CONTEXT
import { useContext } from "react";
import NavContext from "../../Context/NavContext";
import Logout from "../../assets/logout.svg"
//REACT ROUTER
import { Link, NavLink, useNavigate } from "react-router-dom";
import {CgArrowLongRight} from "react-icons/cg"
//ICONS
import {
  MdOutlineDashboard,
  MdOutlineAnalytics,
  MdOutlinedFlag,
  MdPeopleOutline,
  MdOutlineMessage,
  MdOutlineLogout,
} from "react-icons/md";
import { IoMdLogIn } from "react-icons/io";
import { GoMail } from "react-icons/go"
import { FaReact, FaTimes } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { VscDashboard } from "react-icons/vsc";
import Stox from "../../assets/stox.png"
import { Avatar } from '@mui/material';
import Smc from "../../assets/smclogo.PNG"

const NavUrl = ({ url, icon, description }) => {
  const { nav, setNav } = useContext(NavContext);
  const checkWindowSize = () => {
    if (window.innerWidth > 1024) setNav(!nav);
  };




  return (
    <li className={styles.li_navlink}>
      <NavLink
        to={`${url}`}
        className={({ isActive }) => (isActive ? styles.active : undefined)}
        onClick={() => checkWindowSize()}
      >
        {icon}
        <span className={styles.description}>{description}</span>
        
      </NavLink>
    </li>
  );
};

const Navbar = ({store}) => {
  const { nav, setNav } = useContext(NavContext);

  const navigate = useNavigate()


  return (
    <div id="sidebar"
      className={`${styles.navbar_container} ${
        nav ? styles.navbar_mobile_active : undefined
      }`}
    >
      <nav className={nav ? undefined : undefined}>
        {/* LOGO */}
        <div className={styles.logo}>
        <img src={Stox} height={35}  className={styles.logo_icon}/>
          {/* < className={styles.logo_icon} /> */}
          <FaTimes
            className={styles.mobile_cancel_icon}
            onClick={() => {
              setNav(!nav);
            }}
          />
        </div>
        {/* <div>
        <form class="nosubmit">
  <input class="nosubmit" type="search" placeholder="Search..."/>
</form>
        </div> */}

        {/* MENU */}
        <ul className={styles.menu_container}>
          {/* FIRST CATEGORY */}
          {/* <span className={styles.categories}>
            {nav ? "" : <BsThreeDots />}
          </span> */}

          <NavUrl
            url="/updateContact"
            icon={<AiOutlineMobile />}
            description="Update Contact Info"
        
          />
          
          <NavUrl
            url="/bank"
            icon={<AiOutlineBank />}
            description="Bank Details"
          />
          <NavUrl url="/segment" icon={<AiOutlineFolderOpen />} description="Segment" />
          <NavUrl
            url="/nominee-details"
            icon={<GoMail />}
            description="Nominee Details"
          />

          {/* <NavUrl
            url="/mtf"
            icon={<AiOutlineFileSearch />}
            description="MTF"
          /> */}

          {/* SECOND CATEGORY */}
       
       
        </ul>

        {/* LOGOUT BUTTON */}
        {/* <div
          className={`${styles.b}`}
          onClick={() => {
            setNav(!nav);
          }}
        >
          <MdOutlineLogout  style={{color: "green"}}/>
        </div> */}
        <div className="avatar">
        <Avatar alt="Remy Sharp"  />
      
        <h5>{store.userName}</h5>
     
     
      
{/*       
<img src={Logout} style={{width: "17.53px",
height: "35.05px", marginLeft: "2em",marginTop: "2em", cursor: "pointer"}} onClick={handleClick}/> */}
 
     
        
        </div>
        <div className="clients">
   <p className='client_ids'>Client ID : {store.userCode}</p>
        </div>
      
      </nav>

      <div
        className={nav ? styles.mobile_nav_background_active : undefined}
        onClick={() => {
          setNav(!nav);
        }}
      ></div>
    </div>
  );
};

export default Navbar;
