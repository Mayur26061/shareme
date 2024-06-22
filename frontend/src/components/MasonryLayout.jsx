/* eslint-disable react/prop-types */
import Masonry from "react-masonry-css";
import Pin from "./Pin";
const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins, setPins }) => {
  const deletePin = (id) => {
    setPins(pins.filter((data) => data._id !== id));
  };
  return (
    <Masonry
      className="flex animate-slide-fwd gap-1 text-white"
      breakpointCols={breakpointObj}
    >
      {pins?.map((pin) => (
        <Pin
          pin={pin}
          className="w-max"
          key={pin._id}
          filterPins={deletePin}
        ></Pin>
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
