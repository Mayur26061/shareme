import { useEffect, useState } from "react";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import Notfound from "./Notfound";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/getPin`, {
        params: {
          categoryId,
        },
      })
      .then((response) => {
        setLoading(false);
        setPins(response.data.pins);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [categoryId]);
  if (loading)
    return <Spinner message="We are adding new ideas to your feed" />;

  if (!pins?.length) return <Notfound />;

  return <div>{pins && <MasonryLayout pins={pins} setPins={setPins} />}</div>;
};

export default Feed;
