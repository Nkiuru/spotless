import {API_KEY, BASE_URL} from "./constants";

export const authenticated = () => {
  return true;
  //return localStorage.getItem('token') !== null;
};


export const getRooms = async (hospital, floor, showAssigned) => {
  const url = 'rooms';
  let params = hospital ? `?hospital_id=${hospital}` : '';
  params += floor ? `?floor_id=${floor}` : '';
  params += showAssigned ? `?assigned_cleaners=1`: '';
  return doGetRequest(url, params);
}

export const getHospitals = async () => {
  return doGetRequest('hospitals');
}

export const startCleaning = async (roomId) => {
  return doGetRequest(`room/startcleaning?id=${roomId}`);
}

export const stopCleaning = async (roomId) => {
  return doGetRequest(`room/stopcleaning?id=${roomId}`);
}

export const getAssignedRooms = async (cleanerId) => {
  return doGetRequest(`cleaners/rooms?cleaner_id=${cleanerId}`);
}

export const assignRoomsToCleaner = async (rooms, cleaner) => {
  return Promise.all(rooms.map((room) => {
    return assignRoom(room['_id'], cleaner);
  }));
}

export const assignRoom = async (room, cleaner) => {
  return doPostRequest('cleaners/rooms', JSON.stringify({
    'cleaner_id': cleaner,
    'room_id': room
  }));
}

export const unAssignRoom = async (room, cleaner) => {
  return doDeleteRequest('cleaners/rooms', JSON.stringify({
    'cleaner_id': cleaner,
    'room_id': room
  }));
}

export const getRoom = async (roomId) => {
  return doGetRequest(`room?_id=${roomId}`);
}

export const getCleaners = async () => {
  return doGetRequest('cleaners/');
}

export const getCleaner = async (cleanerId) => {
  return doGetRequest(`cleaner?_id=${cleanerId}`);
}

export const createCleaner = async (name, shiftStart, shiftEnd) => {
  return doPostRequest('cleaner/', JSON.stringify({
    name,
    'shift_start': shiftStart,
    'shift_end': shiftEnd
  }));
}

export const getReports = async (roomId, cleanerId) => {
  let params = roomId ? `?room_id=${roomId}` : '';
  params += `?cleaner_id=${cleanerId}`;
  return doGetRequest('reports', params)
}

const doGetRequest = async (url, params) => {
  const requestURL = BASE_URL + url + (params || '');
  console.log(requestURL);
  const response = await fetch(requestURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': API_KEY,
      'charset': 'utf-8'
    }
  });
  return response.json();
}

const doPostRequest = async (url, params) => {
  const requestURL = BASE_URL + url;
  console.log(requestURL);
  const response = await fetch(requestURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': API_KEY,
      'charset': 'utf-8'
    },
    body: params
  });
  return response.json();
}

const doDeleteRequest = async (url, params) => {
  const requestURL = BASE_URL + url;
  const response = await fetch(requestURL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': API_KEY,
      'charset': 'utf-8'
    },
    body: params
  });
  return response.json();
}