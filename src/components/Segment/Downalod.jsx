import React from 'react';
import axios, { Axios } from 'axios';
import FileDownload from "js-file-download"




const Downalod = () => {


const download = (e) =>{
    e.preventDefault();
    Axios({
        url: ``,
        method: "POST",
        responseType: 'blob'
    }).then((res)=> {
        FileDownload(res.data.data.docPath, "download.pdf")
    })
}

  return (
    <div>Downalod</div>
  )
}

export default Downalod