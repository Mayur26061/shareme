import { useEffect, useState } from "react";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { fetchUserToken } from "../utils/fetchUser";
import { useRecoilState } from "recoil";
import { searchstate } from "../stores/searchState";
import Notfound from "./Notfound";
const Search = () => {
  const [searchTerm,setSearchTerm] = useRecoilState(searchstate)
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = fetchUserToken();

  useEffect(() => {
    function searchQuery() {
        if (searchTerm.trim()) {
            setLoading(true);
            axios
                .get(`${BASE_URL}/search`, {
                    headers: { token },
                    params: { search: searchTerm },
                })
                .then((response) => {
                    setLoading(false);
                    setPins(response.data.pins);
                })
                .catch((err) => {
                    setLoading(false);
                    console.log("Error:", err);
                });
        } else {
            try {
                axios.get(`${BASE_URL}/getPin`).then((res) => {
                    setPins(res.data.pins);
                });
            } catch (err) {
                console.log("Error:", err);
            }
        }
    }
    const debounce = setTimeout(searchQuery, 400);

    return () => clearTimeout(debounce)
  }, [searchTerm]);

  // cleanup function to remove search text
  useEffect(()=>{
    return ()=>{setSearchTerm('')}
  },[])

  return (
    <div>
      {loading && <Spinner message="Searching for pins" />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} setPins={setPins}/>}
      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <Notfound/>
      )}
    </div>
  );
};

export default Search;
