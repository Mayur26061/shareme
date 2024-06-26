import { IoMdSearch, IoMdAdd } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../stores/userState";
import { useRecoilState } from "recoil";
import { searchstate } from "../stores/searchState";
const Navbar = () => {
  const [searchTerm, setSearchTerm] = useRecoilState(searchstate);

  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-4 shadow-2xl">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-stone-950 border-none outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          value={searchTerm}
          onFocus={() => navigate("/search")}
          className="p-2 w-full bg-stone-950 outline-none placeholder:text-stone-600"
        />
      </div>
      <div className="flex gap-3">
        <Link
          to="/create-pin"
          className="bg-stone-950 rounded-lg w-12 h-10 md:w-14 md:h-12 flex justify-center items-center"
        >
          <IoMdAdd />
        </Link>
        {user && (
          <Link to={`user-profile/${user._id}`} className="hidden md:block">
            <img
              src={user.image}
              alt="user"
              className="w-14 h-12 rounded-full"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
