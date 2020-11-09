import React from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import {ROOM_TYPES} from "../../utils/constants";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {makeStyles} from "@material-ui/core/styles";
const useStyles = makeStyles(() => ({
  select: {
    minWidth: 200,
    background: 'white',
    fontWeight:400,
    borderStyle:'none',
    borderWidth: 2,
    borderRadius: 12,
    paddingLeft: 24,
    paddingTop: 14,
    paddingBottom: 15,
    boxShadow: '0px 5px 8px -3px rgba(0,0,0,0.14)',
    "&:focus":{
      borderRadius: 12,
      background: 'white',
    },
  },
  paper: {
    borderRadius: 12,
    marginTop: 0
  },
  list: {
    paddingTop:0,
    paddingBottom:0,
    background:'white',
    "& li":{
      fontWeight:200,
      paddingTop:12,
      paddingBottom:12,
    }
  }
}));

const TableFilters = ({rooms}) => {
  const [building, setBuilding] = React.useState('');
  const [floor, setFloor] = React.useState('');
  const [roomType, setRoomType] = React.useState('');
  const [assigned, setAssigned] = React.useState(true);
  const classes = useStyles();

  const menuProps = {
    classes: {
      paper: classes.paper,
      list: classes.list
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    },
    getContentAnchorEl: null
  };

  const filter = () => {

  }

  const getBuildings = () => {
    return [...new Set(rooms.map(room => {
      return room.building;
    }))];
  };

  const getFloors = () => {
    return [...new Set(rooms.map(room => {
      return room.floor;
    }))];
  }
  return (
    <>
      <FormControl variant={'outlined'} style={{minWidth: '320px', marginBottom: 8}}>
        <InputLabel id="building">Building</InputLabel>
        <Select label="Building" onChange={(event) => {
          setBuilding(event.target.value);
          filter();
        }} value={building} classes={{root:classes.select}} MenuProps={menuProps}>
          <MenuItem value={null}>
            <em>All</em>
          </MenuItem>
          {getBuildings().map(building => (
            <MenuItem value={building} key={building}>{building}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant={'outlined'} style={{minWidth: '320px', marginBottom: 8}}>
        <InputLabel id="floor">Floor</InputLabel>
        <Select label="Floor" onChange={(event) => {
          setFloor(event.target.value);
          filter();
        }} value={floor} classes={{root:classes.select}} MenuProps={menuProps}>
          <MenuItem value={null}>
            <em>All</em>
          </MenuItem>
          {getFloors().map(floor => (
            <MenuItem value={floor} key={floor}>{floor}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant={'outlined'} style={{minWidth: '320px', marginBottom: 8}}>
        <InputLabel id="room-type">Room type</InputLabel>
        <Select label="Room type" onChange={(event) => {
          setRoomType(event.target.value);
          filter();
        }} value={roomType} classes={{root:classes.select}} MenuProps={menuProps}>
          <MenuItem value={null}>
            <em>All</em>
          </MenuItem>
          {Object.keys(ROOM_TYPES).map(type => (
            <MenuItem value={ROOM_TYPES[type]}
                      key={ROOM_TYPES[type].displayName}>{ROOM_TYPES[type].displayName}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel control={<Checkbox checked={assigned} onChange={(event, checked) => {
        setAssigned(checked);
        filter();
      }}/>} label="Show assigned"/>
    </>
  );
}

export default TableFilters;