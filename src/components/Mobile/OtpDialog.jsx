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
import OtpSucess from './OtpSucess';

export default function OtpDialog({setModalOpen, modalOpen}) {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen} style={{marginTop: "-11em", width :"21vw", background: "transparent", height: "5vh"}}>

      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
       
        <DialogContent style={{background: "#E4F2FF",
}}>
   <OtpSucess setModalOpen={setModalOpen} modalOpen={modalOpen}/>
        </DialogContent>
      
      </Dialog>
    </div>
  );
}
