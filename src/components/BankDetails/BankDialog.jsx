import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DropFileInput from "../Fileuploader/DropFileInput";
import Upload from "../Fileuploader/Upload";
import SegmentProof from "../Fileuploader/SegmentProof";
import Sign from "../BankDetails/Sign";

export default function BankDialog({
  showSign,
  setShowSign,
  baseReq,
  preview,
  setPreview,
  store,
  open,
  setOpen,
  setFailView,
  setEsignView,
  setEsignData,
  esignData,
  setBankingSign
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = ({}) => {
    setShowSign(true);
  };

  const handleClose = () => {
    setShowSign(false);
  };

  return (
    <div>
      {/* <Button onClick={handleClickOpen} style={{marginTop: "-11em", width :"21vw", background: "transparent", height: "5vh"}}>

      </Button> */}
      <Dialog
        fullScreen={fullScreen}
        open={handleClickOpen}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent
          style={{
            background: "#E4F2FF",
            overflow: "hidden",
            width: "600px",
            height: "699.96px",
          }}
        >
          <Sign
            setShowSign={setShowSign}
            showSign={showSign}
            baseReq={baseReq}
            preview={preview}
            setPreview={setPreview}
            store={store}
            open={open}
            setOpen={setOpen}
            handleClose={handleClose}
            setFailView={setFailView}
            setEsignView={setEsignView}
            setEsignData={setEsignData}
            esignData={esignData}
            setBankingSign={setBankingSign}
          />
          {/* <DropFileInput baseReq={baseReq} store={store} add={add}  setOpen={setOpen} /> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
