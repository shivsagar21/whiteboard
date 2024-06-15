import { useRef } from "react";

const Temp = () => {
  const curElement = useRef(null);
  const handleClick = () => {
    const curElm = curElement.current;
    // console.log(curElement.current.style.backgroundColor="blue");
    curElm.style.backgroundColor = "blue";
    curElm.style.fontSize = "10rem";
    console.log("button clicked");
  };
  return (
    <>
      <div ref={curElement}>Temp</div>
      <button type="button" onClick={() => handleClick()}>
        Button
      </button>
    </>
  );
};
export default Temp;
