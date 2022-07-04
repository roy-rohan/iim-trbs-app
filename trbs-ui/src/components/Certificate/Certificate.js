import { Button } from "@material-ui/core";
import parse from "html-react-parser";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { certificateTypes } from "../../utils/certificateTypes";
import * as classes from "./Certificate.module.css";
import {
    FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

const Certificate = (props) => {

    let contentTextClasses = [classes.CertificateContent];
    let customContentTextStyle = {
        backgroundColor: props.contentBackgroundColor ? props.contentBackgroundColor : "rgba(255, 255, 255, 0.3)"
    };
    const componentRef = useRef();
    const printCertificate = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: props.documentTitle
    });

    if(props.contentPosition === certificateTypes.CENTER) {
        contentTextClasses.push(classes.CenterContent);
    } else if (props.contentPosition === certificateTypes.LEFT_ALIGNED) {
        contentTextClasses.push(classes.LeftAlignedContent);
    } else if (props.contentPosition === certificateTypes.RIGHT_ALIGNED) {
        contentTextClasses.push(classes.RightAlignedContent);
    } else if (props.contentPosition === certificateTypes.CUSTOM_POSITION) {
        customContentTextStyle = {
            ...customContentTextStyle,
            right: `${props.contentPositionX}%`,
            top: `${props.contentPositionY}%`,
            transform: `translateX(${props.contentPositionX}%) translateY(-${props.contentPositionY}%)`
        }
    }else {
        contentTextClasses.push(classes.CenterContent);
    }

    return <div className={ classes.CertificatePrint} >
        <div ref = {componentRef} className = {classes.CertificatePrint} >
          {
              props.imageUrl ? 
              <img className={classes.CertificateImage} alt="alt" src={props.imageUrl} />
              : <div className={classes.DefaultBackImage} />
          }
          <div style = {
              customContentTextStyle
          }
          className = {
              contentTextClasses.join(" ")
          } >
            {parse(props.contentText)}
          </div>
          </div>
          {props.showPrintBtn ? 
                <Button
                variant = "contained"
                color = "primary"
                className = {classes.PrintBtn}
                onClick = {
                    () => printCertificate()
                } > 
                < FontAwesomeIcon icon = {faPrint}
                  style = {{marginRight: "1rem"}}
                /> Print Certificate </Button>: null
        }
    </div>
};
export default Certificate;