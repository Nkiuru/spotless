import React, {useState} from "react";
import hospitalImg from "../../assets/hospital.png";
import styles from "./RoomsPage.module.scss";
import ImageMapper from 'react-image-mapper';
import {HOSPITAL_MAP} from "../../utils/constants";
import {useHistory} from "react-router-dom";
import {getRoomTypeProp, getVariantColor, hexToRgb} from "../../utils/utils";
import {Typography} from "@material-ui/core";

const RoomsMap = ({rooms}) => {
  const history = useHistory();
  const [hovering, setHovering] = useState(false);
  const [room, setRoom] = useState({});
  const [hoverStyle, setHoverStyle] = useState({});


  const map = ((rooms) => {
    let map = {};
    map = Object.assign({}, HOSPITAL_MAP);
    rooms.forEach((room, index) => {
      const color = hexToRgb(getVariantColor(room['contamination_index']));
      map.areas[index].preFillColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`
      map.areas[index]['_id'] = room['_id'];
      map.areas[index].room = room;
    });
    return map;
  })(rooms);

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
      console.log(event.screenX, event.screenY);
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
      <div className={styles.map}>
        <ImageMapper src={hospitalImg}
                     map={map}
                     fillColor={'rgba(0,0,0, 0.2)'}
                     onClick={click}
                     width={width}
                     imgWidth={642}
                     onMouseEnter={enter}
                     onMouseLeave={() => {
                       setHovering(false);
                       setRoom({});
                       setHoverStyle({});
                     }}
        />
      </div>
      {hovering &&
      <div id="info" className={styles.roomInfo} style={hoverStyle}>
        <Typography variant={"h6"} className={styles.bold}>Room: {room.name}</Typography>
        <Typography variant={"body1"}>{getRoomTypeProp(room, 'displayName')}</Typography>
        <Typography variant={"body1"} color={"textSecondary"}>Contamination Index: <div
          style={{color: getVariantColor(room['contamination_index'])}}>{room['contamination_index'].toFixed(1)}</div>
        </Typography>
      </div>
      }
    </>
  )
}

export default RoomsMap;