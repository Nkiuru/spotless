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

export const HOSPITAL_MAP = Object.freeze({
  name: "hospital map",
  areas: [
    {
      shape: "rect",
      coords: [132, 25, 193, 144],
    },
    {
      shape: "rect",
      coords: [62, 27, 126, 144],
    },
    {
      shape: "rect",
      coords: [9, 48, 57, 160],
    },
    {
      shape: "rect",
      coords: [9, 165, 79, 254],
    },
    {
      shape: "poly",
      coords: [368, 27, 368, 113, 316, 113, 316, 27, 369, 27],
    },
    {
      shape: "poly",
      coords: [
        310,
        112,
        288,
        112,
        287,
        160,
        253,
        160,
        253,
        74,
        201,
        74,
        200,
        26,
        311,
        26,
        312,
        112,
        310,
        111,
      ],
    },
    {
      shape: "rect",
      coords: [291, 116, 369, 160],
    },
    {
      shape: "rect",
      coords: [374, 27, 429, 144],
    },
    {
      shape: "rect",
      coords: [433, 27, 488, 145],
    },
    {
      shape: "rect",
      coords: [494, 27, 548, 145],
    },
    {
      shape: "rect",
      coords: [554, 26, 608, 145],
    },
    {
      shape: "rect",
      coords: [373, 149, 641, 211],
    },
    {
      shape: "rect",
      coords: [596, 216, 639, 307],
    },
    {
      shape: "rect",
      coords: [522, 216, 558, 307],
    },
    {
      shape: "rect",
      coords: [476, 215, 517, 306],
    },
    {
      shape: "rect",
      coords: [418, 215, 472, 306],
    },
    {
      shape: "rect",
      coords: [365, 215, 414, 307],
    },
    {
      shape: "rect",
      coords: [293, 216, 360, 307],
    },
    {
      shape: "rect",
      coords: [259, 214, 289, 307],
    },
    {
      shape: "rect",
      coords: [174, 258, 255, 305],
    },
    {
      shape: "rect",
      coords: [175, 215, 255, 255],
    },
    {
      shape: "rect",
      coords: [85, 215, 172, 256],
    },
    {
      shape: "rect",
      coords: [85, 259, 171, 307],
    },
    {
      shape: "poly",
      coords: [
        368,
        164,
        368,
        211,
        85,
        210,
        84,
        149,
        184,
        148,
        184,
        164,
        368,
        164,
        368,
        163,
      ],
    },
    {
      shape: "poly",
      coords: [
        84,
        370,
        193,
        371,
        194,
        356,
        258,
        357,
        257,
        310,
        83,
        310,
        83,
        370,
      ],
    },
    {
      shape: "rect",
      coords: [9, 262, 79, 358],
    },
    {
      shape: "rect",
      coords: [262, 311, 369, 358],
    },
    {
      shape: "rect",
      coords: [373, 310, 608, 372],
    },
    {
      shape: "rect",
      coords: [551, 378, 610, 494],
    },
    {
      shape: "rect",
      coords: [492, 377, 550, 494],
    },
    {
      shape: "rect",
      coords: [432, 377, 487, 494],
    },
    {
      shape: "rect",
      coords: [374, 376, 428, 494],
    },
    {
      shape: "rect",
      coords: [290, 362, 369, 405],
    },
    {
      shape: "rect",
      coords: [13, 363, 57, 474],
    },
    {
      shape: "rect",
      coords: [61, 376, 129, 492],
    },
    {
      shape: "poly",
      coords: [
        368,
        494,
        368,
        409,
        285,
        409,
        286,
        362,
        261,
        362,
        262,
        494,
        368,
        494,
      ],
    },
    {
      shape: "poly",
      coords: [
        133,
        376,
        133,
        494,
        194,
        494,
        194,
        441,
        247,
        442,
        249,
        397,
        195,
        396,
        195,
        376,
        133,
        377,
      ],
    },
  ],
});