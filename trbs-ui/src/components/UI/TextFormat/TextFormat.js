import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import classes from "./TextFormat.module.css";

const TextFormat = (props) => {
  const [content, setContent] = useState(props.children);
  const [leadingText, setLeadingText] = useState(null);
  let cardTitleRef = React.createRef();

  useEffect(() => {
    setUpContent();
  });


  const setUpContent = () => {
    let charLength = content.split("").length;
    let charsAllowed = getCharsAllowed();
  
    if (charsAllowed < charLength) {
      setContent(props.children.substring(0, charsAllowed));
      setLeadingText(
        <NavLink to={props.link ? props.link : "#"}>{props.ellipsis}</NavLink>
      );
    }
  }

  const getCharsAllowed = () => {
     return cardTitleRef.current.clientWidth / 6;
  };

  return (
    <div className={[classes.TextFormat, props.className].join(" ")}>
      <p className={classes.TextPara} ref={cardTitleRef}>
        {content}
        {leadingText}
      </p>
    </div>
  );
};

export default TextFormat;
