import React, {useEffect, useState} from 'react';
import {getHospitals, getRooms} from "../../utils/api";
import CircularProgress from "@material-ui/core/CircularProgress";

const RoomsPage = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getHospitals('hospital0')
      .then((result) => {
        console.log(result);
        setIsLoaded(true);
        setRooms(result.rooms);
      },
      (err) => {
        setError(true);
        setIsLoaded(true);
        console.log(err)
      })
  }, []);
  return (
    <div style={{paddingTop: '16px'}}>
      <p>Rooms</p>
      {!isLoaded ? <CircularProgress color="secondary"/> :
        (rooms.map(room => (
          <li key={room.id}>
            {room.name}
          </li>
        )))
      }
      {error && (
        <p>ERROR</p>
      )}
    </div>
  )
}

export default RoomsPage;