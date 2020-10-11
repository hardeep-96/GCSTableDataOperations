import React from "react";
import "./assets/SkeletonLoader.css";
const SkeletonLoader = ({ count, style, className, children, component='div' }) =>
  [...new Array(count)].map((el) => (
    <component style={style} className={"loader-line shimmer " + className}>
      {children}
    </component>
  ));

SkeletonLoader.defaultProps = {
  count: 1,
  style: {width: '100%',height: '20px'},
  className: "",
};

export default SkeletonLoader;
