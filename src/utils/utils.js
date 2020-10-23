import {ROOM_TYPES} from "./constants";

export const getRoomTypeProp = (room, propName) => {
  return room['room_type'] !== '<empty>' ? ROOM_TYPES[room['room_type']][propName] : '';
}