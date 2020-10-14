export const authenticated = () => {
  return true;
  //return localStorage.getItem('token') !== null;
};

const API_KEY = 'zL43mXgXk5xa7YFRBVZscbLnGFaqVh24q5G6fhGjmAv532FAVBRtnuCJpwXWXnhw';
const BASE_URL = 'https://cleaner-app-api.azurewebsites.net/api/';

export const getRooms = async (hospital, floor) => {
  const url = 'rooms';
  let params = hospital ? `?hospital_id=${hospital}` : '';
  params += floor ? `?floor_id=${floor}` : '';
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

export const getAssignedRooms = async (cleaner) => {
  return doGetRequest(`cleaners/rooms?${cleaner}`);
}

export const assignRoom = async (room, cleaner) => {
  return doPostRequest('cleaners/rooms', JSON.stringify({
    'cleaner_id': cleaner,
    'room_id': room
  }));
}

export const getRoom = async (roomId) => {
  return doGetRequest(`room?_id=${roomId}`);
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