import { Button } from "@material-ui/core";
import React from "react";
import ReactToPdf from "react-to-pdf";
import * as classes from "./Certicate.module.css";
import RegistrationCertificate from "./RegistrationCertificate/RegistrationCertificate";

const Certificate = (props) => {
  const ref = React.createRef();

  return (
    <div>
      <div className={classes.CertificateRow}>
        <div className={classes.CertificateContainer}>
          <div ref={ref}>
            <RegistrationCertificate />
          </div>
        </div>
        <div className={classes.CertificateName}>
          <p>Certficate Name</p>
        </div>
        <div className={classes.GenerateCertificateButton}>
          <ReactToPdf targetRef={ref} filename="div-blue.pdf">
            {({ toPdf }) => (
              <Button onClick={toPdf} variant="contained" color="primary">
                Download Certificate
              </Button>
            )}
          </ReactToPdf>
        </div>
      </div>
    </div>
  );
};
export default Certificate;
