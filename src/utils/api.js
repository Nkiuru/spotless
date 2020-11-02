import {API_KEY, BASE_URL} from "./constants";

export const authenticated = () => {
  return localStorage.getItem('user') !== null;
};

export const getUser = () => {
  if (authenticated()) {
    return JSON.parse(localStorage.getItem('user'));
  } else {
    return false;
  }
}

export const authenticate = (username, password) => {
  let isSuperAdmin = false;
  if (username === 'superadmin' && password === 'admin') {
    isSuperAdmin = true;
  }
  localStorage.setItem('user', JSON.stringify({
    username,
    superAdmin: isSuperAdmin
  }));
  return true;
}

export const logout = () => {
  localStorage.removeItem('user');
}


export const getRooms = async (hospital, floor, showAssigned) => {
  const url = 'rooms';
  let params = hospital ? `?hospital_id=${hospital}` : '';
  params += floor ? `?floor_id=${floor}` : '';
  params += showAssigned ? `?assigned_cleaners=1` : '';
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

export const getAssignedCleaners = async (roomId) => {
  return doGetRequest(`cleaners/rooms?room_id=${roomId}`);
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
  params += cleanerId ? `?cleaner_id=${cleanerId}` : '';
  return doGetRequest('reports', params)
}

export const deleteCleaner = async (cleanerId) => {
  return doDeleteRequest('cleaner', JSON.stringify({
    '_id': cleanerId
  }));
}

export const getReport = async (reportId) => {
  return doGetRequest(`report?_id=${reportId}`);
}

export const getHeatmap = async (reportId, type) => {
  const requestURL = BASE_URL + `report/heatmap?_id=${reportId}&type=${type}`
  const response = await fetch(requestURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Authorization': API_KEY,
      'charset': 'utf-8'
    }
  });
  if (response.ok) {
    return response.arrayBuffer();
  } else {
    const json = await response.json();
    console.log(json)
    throw new Error(json.error);
  }
}

export const getRoomHeatmap = async (roomId, type) => {
  const requestURL = BASE_URL + `room/heatmap?_id=${roomId}&type=${type}`
  const response = await fetch(requestURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Authorization': API_KEY,
      'charset': 'utf-8'
    }
  });
  if (response.ok) {
    return response.arrayBuffer();
  } else {
    const json = await response.json();
    throw new Error(json.error);
  }
}

export const editCleaner = async (cleaner) => {
  return doPutRequest('cleaner/', JSON.stringify({
    '_id': cleaner['_id'],
    'name': cleaner.name,
    'shift_start': cleaner['shift_start'],
    'shift_end': cleaner['shift_end']
  }));
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
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(await response.json().message);
  }
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
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(await response.json().message);
  }
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
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(await response.json().message);
  }
}

const doPutRequest = async (url, params) => {
  const requestURL = BASE_URL + url;
  console.log(requestURL);
  const response = await fetch(requestURL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': API_KEY,
      'charset': 'utf-8'
    },
    body: params
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(await response.json().message);
  }
}