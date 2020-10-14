import React, {useEffect, useState} from "react";
import {useLocation} from 'react-router-dom';
import {Typography} from "@material-ui/core";
import {getRoom} from "../../utils/api";


const RoomDetailsPage = () => {
  const location = useLocation();
  const params = location.state;
  const [roomLoaded, setRoomLoaded] = useState(false);
  const [room, setRoom] = useState({});

  useEffect(() => {
    console.log(params)
    getRoom(params.id)
      .then((room) => {
          console.log(room);
          setRoom(room);
          setRoomLoaded(true);
        },
        (error) => {
          console.log(error);
        })
  }, []);

  return (
    <div>
      <Typography variant={"h5"}>Room details</Typography>
      {roomLoaded && (
        <Typography>Room name: {room.name}</Typography>
      )}
    </div>
  );
}

export default RoomDetailsPage;