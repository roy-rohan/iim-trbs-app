import clsx from "clsx";
import { React } from "react";
import LazyLoad from "react-lazyload";
import * as config from "../../../config.json";
import classes from "./CustomImage.module.css";
const CustomImage = (props) => {
  let { useCustomSrc, noLazyLoad, src, alt, cssClass, ...restProps } = props;
  let imageUrl = useCustomSrc ? src : config.serverUrl + src;

  let content = noLazyLoad ? (
    <img
      src={imageUrl}
      alt={alt ? alt : "iim-trbs-ahmedabad-image"}
      className={clsx(cssClass, classes.Image)}
      {...restProps}
    />
  ) : (
    <LazyLoad key={imageUrl} offset={20}>
      <img
        src={imageUrl}
        alt={alt ? alt : "iim-trbs-ahmedabad-image"}
        className={clsx(cssClass, classes.Image)}
        {...restProps}
      />
    </LazyLoad>
  );

  return content;
};
export default CustomImage;
