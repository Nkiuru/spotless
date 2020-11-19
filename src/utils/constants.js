export const API_KEY = 'zL43mXgXk5xa7YFRBVZscbLnGFaqVh24q5G6fhGjmAv532FAVBRtnuCJpwXWXnhw';
export const BASE_URL = 'https://cleaner-app-api.azurewebsites.net/api/';

export const UNCLEANED = 'Uncleaned due to some reason';

export const ROOM_TYPES = Object.freeze({
  OFFICE: {
    frequency: 1,
    cleaningTime: 5,
    displayName: 'Office',
    key: 'OFFICE'
  },
  TOILET: {
    frequency: 5,
    cleaningTime: 5,
    displayName: 'Toilet',
    key: 'TOILET'
  },
  WARD_ROOM: {
    frequency: 5,
    cleaningTime: 8,
    displayName: 'Ward room',
    key: 'WARD_ROOM'
  },
  EXAMINATION_ROOM: {
    frequency: 5,
    cleaningTime: 6,
    displayName: 'Examination room',
    key: 'EXAMINATION_ROOM'
  },
  CORRIDOR: {
    frequency: 3,
    cleaningTime: 9,
    displayName: 'Corridor',
    key: 'CORRIDOR'
  },
  WAITING_ROOM: {
    frequency: 5,
    cleaningTime: 10,
    displayName: 'Waiting room',
    key: 'WAITING_ROOM'
  },
});