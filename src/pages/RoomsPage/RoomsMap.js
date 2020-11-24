import React, {useEffect, useReducer, useState} from "react";
import hospitalImg from "../../assets/hospital.png";
import styles from "./RoomsPage.module.scss";
import ImageMapper from 'react-image-mapper';
import {HOSPITAL_MAP} from "../../utils/constants";
import {useHistory} from "react-router-dom";
import {getRoomTypeProp, getVariantColor, hexToRgb} from "../../utils/utils";
import {Typography} from "@material-ui/core";

const initMap = (rooms) => {
  let map = {};
  map = JSON.parse(JSON.stringify(HOSPITAL_MAP));
  rooms.forEach((room, index) => {
    const area = map.areas[index];
    if (!area) {
      return;
    }
    const color = hexToRgb(getVariantColor(room['contamination_index']));
    area.preFillColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`
    area['_id'] = room['_id'];
    area.room = room;
  });
  return map;
}

const RoomsMap = ({rooms}) => {
  const history = useHistory();
  const [hovering, setHovering] = useState(false);
  const [room, setRoom] = useState({});
  const [hoverStyle, setHoverStyle] = useState({});
  const [map, setMap] = useState({});
  const [ignored, forceUpdate] = useState(642);

  useEffect(() => {
    setMap(initMap(rooms));
    forceUpdate(i => i === 642 ? 643 : 642);
  }, [rooms, setMap])

  const click = (area, num, event) => {
    const id = area['_id'];
    if (!id) {
      return;
    }
    history.push({
      pathname: `/rooms/${id}`,
      state: {id}
    })
  }

  const enter = (area, index, event) => {
    if (area.room) {
      const style = {
        top: event.pageY,
        left: event.pageX
      }
      setHovering(true);
      setRoom(area.room);
      setHoverStyle(style);
    }
  }

  const width = window.innerWidth / 2.1;

  return (
    <>
      {Object.keys(map).length !== 0 &&
      <div className={styles.map}>
        <ImageMapper src={hospitalImg}
                     map={map}
                     fillColor={'rgba(0,0,0, 0.2)'}
                     onClick={click}
                     width={width}
                     imgWidth={ignored}
                     onMouseEnter={enter}
                     onMouseLeave={() => {
                       setHovering(false);
                       setRoom({});
                       setHoverStyle({});
                     }}
        />
      </div>
      }
      {hovering &&
      <div id="info" className={styles.roomInfo} style={hoverStyle}>
        <Typography variant={"h6"} className={styles.bold}>Room: {room.name}</Typography>
        <Typography variant={"body1"}>{getRoomTypeProp(room, 'displayName')}</Typography>
        <Typography variant={"body1"} color={"textSecondary"}>Contamination Index: <span
          style={{color: getVariantColor(room['contamination_index'])}}>{room['contamination_index'].toFixed(1)}</span>
        </Typography>
      </div>
      }
    </>
  )
}

export default RoomsMap;