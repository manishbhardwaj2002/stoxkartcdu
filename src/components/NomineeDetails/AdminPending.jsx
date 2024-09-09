import React from "react";

function AdminPending() {
  return (
    <div>
      <div
        className="successopen"
        style={{ background: "rgba(234, 244, 255,1)" }}
      >
        <div className="suceess">
          <div className="center_1">
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "80%",
              }}
            >
              <b style={{ color: "red" }}>Note:</b>
              <p
                style={{
                  color: "green",
                  textAlign: "left",
                  marginLeft: "1em",
                }}
              >
                We have received your nomination request. It will take up to 2
                working days for successfully processing your request
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPending;
