import React, {useEffect, useState} from "react";
import {useLocation} from 'react-router-dom';
import {Typography} from "@material-ui/core";
import {getCleaner} from "../../utils/api";


const CleanerDetailsPage = () => {
  const location = useLocation();
  const params = location.state;
  const [cleanerLoaded, setCleanerLoaded] = useState(false);
  const [cleaner, setCleaner] = useState({});

  useEffect(() => {
    getCleaner(params.id)
      .then((room) => {
          console.log(room);
          setCleaner(room);
          setCleanerLoaded(true);
        },
        (error) => {
          console.log(error);
        });

  }, [params.id]);

  return (
    <div>
      <Typography variant={"h5"}>Cleaner details</Typography>
      {cleanerLoaded && (
        <Typography>Cleaner name: {cleaner.name}</Typography>
      )}
    </div>
  );
}

export default CleanerDetailsPage;