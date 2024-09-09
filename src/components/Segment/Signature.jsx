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
import SignatureProof from "../Fileuploader/SignatureProof";

export default function Signature({
  store,
  baseReq,
  setPreview,
  preview,
  setGetFile,
  getFile,
  setSegmentView,
  setBtn,
  setShowimg,
  showimg,
  setImageShow
}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(true);
  };

  return (
    <div>
      <Button
        onClick={handleClickOpen}
        style={{
          marginTop: "-11em",
          width: "21vw",
          background: "transparent",
          height: "5vh",
        }}
      ></Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent
          style={{
            background: "#E4F2FF",
            overflow: "hidden",
            overflow: "hidden",
            width: "600px",
            height: "699.96px",
          }}
        >
          <SignatureProof
            store={store}
            baseReq={baseReq}
            setOpen={setOpen}
            setPreview={setPreview}
            preview={preview}
            setGetFile={setGetFile}
            getFile={getFile}
            setSegmentView={setSegmentView}
            setBtn={setBtn}
            setShowimg={setShowimg}
                        showimg={showimg}
                        setImageShow={setImageShow}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
