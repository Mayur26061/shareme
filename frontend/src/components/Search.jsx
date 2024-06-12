import React, { useEffect, useState } from "react";
import MasonaryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { fetchUserToken } from "../utils/fetchUser";
const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = fetchUserToken();

  useEffect(() => {
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
          console.log("Error:");
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
  }, [searchTerm]);
  return (
    <div>
      {loading && <Spinner message="Searching for pins" />}
      {pins?.length !== 0 && <MasonaryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <div className="mt-10 text-center text-xl"> No Pins Found</div>
      )}
    </div>
  );
};

export default Search;
