import { Routes, Route } from "react-router-dom";
import { Navbar, Feed, PinDetails, CreatePin, Search } from "../components";

const Pins = () => {
  return (
    <div className="px-2 md:px-5">
      <div>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/category/:categoryId" element={<Feed />} />
        <Route path="/pin-detail/:pinId" element={<PinDetails />} />
        <Route path="/create-pin" element={<CreatePin />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
  );
};

export default Pins;
