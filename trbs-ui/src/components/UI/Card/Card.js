import { Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import CustomImage from "../CustomImage/CustomImage";
import TextFormat from "../TextFormat/TextFormat";
import classes from "./Card.module.css";
const Card = (props) => {
  let history = useHistory();

  // Card Title
  const cardTite = props.title ? (
    <TextFormat
      ellipsis={"..."}
      charsAllowed={50}
      className={classes.CardTitle}
    >
      {props.title}
    </TextFormat>
  ) : null;

  // Card Short Description
  const cardShortDesc = props.shortDesc ? (
    <TextFormat
      ellipsis={"..."}
      charsAllowed={40}
      link={props.ellipsisLink ? props.ellipsisLink : "#"}
      className={classes.ShortDesc}
    >
      {props.shortDesc}
    </TextFormat>
  ) : null;

  // Card Date
  const cardDate = props.date ? (
    <p className={classes.CardDate}>{props.date}</p>
  ) : null;

  const onCardClickHandler = () => {
    history.push({
      pathname: props.link,
    });
  };

  return (
    <div
      className={[
        classes.Card,
        classes[props.ColorScheme ? props.ColorScheme : "Light"],
      ].join(" ")}
      style={{
        height: props.height ? props.height : "100%",
        width: props.width ? props.width : "100%",
        margin: props.margin ? props.margin : "0",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        ...props.style,
      }}
      onClick={onCardClickHandler}
    >
      <CustomImage src={props.image} cssClass={classes.Image} />
      {cardTite}
      {cardShortDesc}
      {cardDate}
      {props.isAuth ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.addToCartHandler()}
        >
          Add To Cart
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={onCardClickHandler}
        >
          View Details
        </Button>
      )}
    </div>
  );
};
export default Card;
