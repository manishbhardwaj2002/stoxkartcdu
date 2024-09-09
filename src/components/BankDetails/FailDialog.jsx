import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DropFileInput from '../Fileuploader/DropFileInput';
import Upload from "../Fileuploader/Upload";
import SegmentProof from "../Fileuploader/SegmentProof";
import Sign from "../BankDetails/Sign"
import BankFail from './BankFail';

export default function FailDialog({showSign, setShowSign}) {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = ({}) => {
    setShowSign(true);
  };

  const handleClose = () => {
    setShowSign(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen} style={{marginTop: "-11em", width :"21vw", background: "transparent", height: "5vh"}}>

      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
       
        <DialogContent style={{background: "white", overflow: "hidden", width: "500px",
height: "500px", overflow: "hidden"
}}>
    <BankFail/>
    {/* <DropFileInput baseReq={baseReq} store={store} add={add}  setOpen={setOpen} /> */}
        </DialogContent>
      
      </Dialog>
    </div>
  );
}
