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

export default function Proof({
  baseReq,
  store,
  add,
  setPicname,
  setImageFile,
  imageFile,
  setProofView,
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
        sx={{
          marginTop: "-11em",
          width: {xs: "50vh", md: '51vh'},
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
            width: "600px",
            height: "699.96px",
          }}
        >
          <SegmentProof
            baseReq={baseReq}
            store={store}
            add={add}
            setOpen={setOpen}
            setPicname={setPicname}
            setImageFile={setImageFile}
            imageFile={imageFile}
            setProofView={setProofView}
            setBtn={setBtn}
            setShowimg={setShowimg}
                        showimg={showimg}
                        setImageShow={setImageShow}
          />
          {/* <DropFileInput baseReq={baseReq} store={store} add={add}  setOpen={setOpen} /> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
