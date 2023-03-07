import React from "react";

import { timeline, stagger } from "motion";
import HeaderMenu from "../../../components/index/HeaderMenu";

const Realtime = () => {
  const divRef = React.useRef(null);

  React.useEffect(() => {
    divRef.current
      ? timeline([
          [divRef.current, { x: 100 }, { duration: 1 }],
          [divRef.current, { x: -100, scale: 0.5 }, { duration: 1 }],
          [divRef.current, { x: 100 }, { duration: 1 }],
        ])
      : null;
  }, [divRef]);

  return (
    <>
      <div
        ref={divRef}
        style={{
          width: "100vw",
          height: "100vh",
          background: "red",
          zIndex: 999999,
          position: "relative",
        }}
      ></div>
      <HeaderMenu />
    </>
  );
};
export default Realtime;
