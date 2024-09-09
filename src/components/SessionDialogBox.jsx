import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));



export default function SessionDialogBox({isSessionOpen, setIsSessionOpen}) {

  
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  
// const navigate = useNavigate();

const closePopUp = () => {
  setIsSessionOpen(false);
  setIsLoggedIn(false);
  sessionStorage.clear();
  localStorage.clear();
  window.location.href= "/";
  // setTimeout(() => {
  
  //   navigate("/");
  // }, 2000);
  // getSegmentProofData();
  // sessionStorage.clear();
  // localStorage.clear();
  // navigate("/");
};

console.log("logging out")

  const handleClickOpen = () => {
    setIsSessionOpen(true);
  };






  return (
    <React.Fragment>
    
      <BootstrapDialog
        onClose={closePopUp}
        handleClickOpen={handleClickOpen}
        aria-labelledby="customized-dialog-title"
       open={ isSessionOpen}
       sx={{textAlign:'center'}}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
   
        </DialogTitle>
      
        <IconButton
          aria-label="close"
          onClick={closePopUp}
          sx={{
            position: "absolute",
            right: 8,
            top: 2,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
    
        <DialogContent dividers>
          <Typography gutterBottom>
          Your Session Has Expired. Please Login Again
          </Typography>
          <Box textAlign='center'>
          <Button
   sx={{
     borderRadius: "4px",
     border: "1px solid #E7E7E7",
     textTransform: "capitalize",
     color: "pink",
     fontFamily: "Poppins",
     fontSize: "14px",
     fontWeight: 400,
     background: "#0CA750 ! important",
     border: "1px solid #0CA750 ! important",
     color: "#fff",
     outline: "1px solid #0CA750 !important",
     outlineOffset: "3px",
     marginLeft:'auto',
     marginRight:'auto',
   }}
   className="p-button-raised p-button-sm smc_color"
   autoFocus
   onClick={closePopUp}
 >
   OK
 </Button>
 </Box>
        </DialogContent>
      
      
      </BootstrapDialog>
    </React.Fragment>
  );
}
