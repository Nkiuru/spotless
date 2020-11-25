import React from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import {ROOM_TYPES} from "../../utils/constants";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import PropTypes from "prop-types";

const TableFilters = ({rooms, setRooms, initialBuilding, initialFloor, hideAll, hideAssigned}) => {
  const [building, setBuilding] = React.useState(initialBuilding || '');
  const [floor, setFloor] = React.useState(initialFloor || '');
  const [roomType, setRoomType] = React.useState('');
  const [assigned, setAssigned] = React.useState(true);

  const filter = (building, roomType, floor, assigned) => {
    let filtered = rooms;
    filtered = filtered.filter((room) => {
      let valid = true;
      if (building) {
        valid = room.building === building;
      }
      if (floor) {
        valid = room.floor === floor && valid;
      }
      if (roomType) {
        valid = room['room_type'] === roomType.key && valid;
      }
      if (!hideAssigned && !assigned) {
        valid = room['assigned_cleaners'].length === 0 && valid;
      }
      return valid;
    });
    setRooms(filtered);
  }

  const getBuildings = () => {
    return [...new Set(rooms.map(room => {
      return room.building;
    }))].sort();
  };

  const getFloors = () => {
    return [...new Set(rooms.map(room => {
      return room.floor;
    }))].sort();
  }
  return (
    <>
      <FormControl variant={'outlined'} style={{minWidth: '240px', marginBottom: 8}}>
        <InputLabel id="building">Building</InputLabel>
        <Select label="Building" onChange={(event) => {
          setBuilding(event.target.value);
          filter(event.target.value, roomType, floor, assigned);
        }} value={building}>
          {!hideAll &&
          <MenuItem value={''}>
            <em>All</em>
          </MenuItem>}
          {getBuildings().map(building => (
            <MenuItem value={building} key={building}>{building}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant={'outlined'} style={{minWidth: '240px', marginBottom: 8}}>
        <InputLabel id="floor">Floor</InputLabel>
        <Select label="Floor" onChange={(event) => {
          setFloor(event.target.value);
          filter(building, roomType, event.target.value, assigned);
        }} value={floor}>
          {!hideAll &&
          <MenuItem value={''}>
            <em>All</em>
          </MenuItem>
          }
          {getFloors().map(floor => (
            <MenuItem value={floor} key={floor}>{floor}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant={'outlined'} style={{minWidth: '240px', marginBottom: 8}}>
        <InputLabel id="room-type">Room type</InputLabel>
        <Select label="Room type" onChange={(event) => {
          setRoomType(event.target.value);
          filter(building, event.target.value, floor, assigned);
        }} value={roomType}>
          <MenuItem value={''}>
            <em>All</em>
          </MenuItem>
          {Object.keys(ROOM_TYPES).map(type => (
            <MenuItem value={ROOM_TYPES[type]}
                      key={ROOM_TYPES[type].displayName}>{ROOM_TYPES[type].displayName}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {!hideAssigned &&
      <FormControlLabel control={<Checkbox checked={assigned} onChange={(event, checked) => {
        setAssigned(checked);
        filter(building, roomType, floor, checked);
      }}/>} label="Show assigned"/>}
    </>
  );
}

TableFilters.propTypes = {
  rooms: PropTypes.array.isRequired,
  setRooms: PropTypes.func.isRequired,
  initialBuilding: PropTypes.string,
  initialFloor: PropTypes.string,
  hideAll: PropTypes.bool,
  hideAssigned: PropTypes.bool
}

export default TableFilters;