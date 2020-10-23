export const API_KEY = 'zL43mXgXk5xa7YFRBVZscbLnGFaqVh24q5G6fhGjmAv532FAVBRtnuCJpwXWXnhw';
export const BASE_URL = 'https://cleaner-app-api.azurewebsites.net/api/';

export const ROOM_TYPES = Object.freeze({
  OFFICE: {
    frequency: 1,
    cleaningTime: 5
  },
  TOILET: {
    frequency: 5,
    cleaningTime: 5
  },
  WARD_ROOM: {
    frequency: 5,
    cleaningTime: 8
  },
  EXAMINATION_ROOM: {
    frequency: 5,
    cleaningTime: 6
  },
  CORRIDOR: {
    frequency: 3,
    cleaningTime: 9
  },
  WAITING_ROOM: {
    frequency: 5,
    cleaningTime: 10
  },
});