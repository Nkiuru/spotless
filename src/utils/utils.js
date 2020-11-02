import {ROOM_TYPES} from "./constants";
import StatusDot from "../components/StatusDot";
import React from "react";

export const getRoomTypeProp = (room, propName) => {
  return room['room_type'] !== '<empty>' ? ROOM_TYPES[room['room_type']][propName] : '';
}

export const getStatus = (contamination) => {
  let variant = 'neutral';
  if (contamination >= 60) {
    variant = 'critical';
  } else if (contamination >= 30) {
    variant = 'medium';
  } else if (contamination < 30) {
    variant = 'good';
  }
  return <StatusDot variant={variant} size={"tiny"} tooltip={contamination}/>
}

function convert64to8(array) {
  let min, max, pix;
  // eslint-disable-next-line no-undef
  let minRaw = BigInt(Number.MAX_SAFE_INTEGER);
  // eslint-disable-next-line no-undef
  let maxRaw = BigInt(0);
  for (let j = 0; j < array.length; j++) {
    pix = array[j]
    if (pix < minRaw) {
      minRaw = pix
    }
    if (pix > maxRaw) {
      maxRaw = pix
    }
  }
  // eslint-disable-next-line no-undef
  max = BigInt(maxRaw)
  // eslint-disable-next-line no-undef
  min = BigInt(minRaw)
  let pix1;
  let im_p = [];
  if (max <= min) {
    max = min + 1n
  }
  for (let i = 0; i < array.length; i++) {
    // eslint-disable-next-line no-undef
    pix1 = (array[i] - min) * 255n / (max - min);
    if (pix1 > 255n) {
      pix1 = 255
    }
    if (pix1 < 0n) {
      pix1 = 0n
    }
    im_p.push(Number(pix1));
  }
  return new Uint8Array(im_p);
}

// lookup color table to apply to grayscale image
function initColorMaps() {
  let tableRed = []
  let tableGreen = []
  let tableBlue = []
  let red, green, blue;
  let a, b;
  for (let i = 0; i <= 255; i++) {
    a = i * 0.01236846501;
    b = Math.cos(a - 1.0)
    red = Math.round(Math.pow(2.0, Math.sin(a - 1.6)) * 200)
    green = Math.round(Math.atan(a) * b * 155 + 100.0)
    blue = Math.round(b * 255)
    red = Math.min(255, red);
    green = Math.min(255, green);
    blue = Math.min(255, blue);
    red = Math.max(0, red);
    green = Math.max(0, green);
    blue = Math.max(0, blue);
    tableRed.push(red)
    tableGreen.push(green)
    tableBlue.push(blue)
  }
  return [new Uint8ClampedArray(tableRed), new Uint8ClampedArray(tableGreen), new Uint8ClampedArray(tableBlue)];
}

export function update_img(arrayBuffer, auxCanvas, canvas) {
  let arr = null;
  try {
    // eslint-disable-next-line no-undef
    arr = new BigUint64Array(arrayBuffer);
  } catch (error) {
    throw error;
  }
  let bytearray = convert64to8(arr);
  let [redMap, greenMap, blueMap] = initColorMaps();
  let img = null; //ImageData
  let imgArr = null; //Uint8ClampedArray
  const h = bytearray.length / 72;
  if (bytearray) {
    img = new ImageData(72, h); // Note: the actual array is 4 times bigger because has (RGBA) pixels
    imgArr = img.data;
    let byteIdx = 0;

    if (true) { // color mapped image
      for (let imgIdx = 0; imgIdx < imgArr.length; imgIdx += 4) {
        let grayValue = bytearray[byteIdx];
        imgArr[imgIdx] = redMap[grayValue]; // R value
        imgArr[imgIdx + 1] = greenMap[grayValue]; // G value
        imgArr[imgIdx + 2] = blueMap[grayValue]; // B value
        imgArr[imgIdx + 3] = 255; // Alpha value
        byteIdx++;
      }
    } else { // Normal grayscale image
      for (let imgIdx = 0; imgIdx < imgArr.length; imgIdx += 4) {
        let grayValue = bytearray[byteIdx];
        imgArr[imgIdx] = grayValue; // R value
        imgArr[imgIdx + 1] = grayValue; // G value
        imgArr[imgIdx + 2] = grayValue; // B value
        imgArr[imgIdx + 3] = 255; // Alpha value
        byteIdx++;
      }
    }
  }
  console.log(img)
  // Scaling. It seems that with putImageData we cannot scale the canvas directly
  // auxCanvas has the image and
  let ctx = canvas.getContext('2d');
  auxCanvas.getContext("2d").putImageData(img, 0, 0);
  ctx.drawImage(auxCanvas, 0, 0)
  // flip Y AND X axis
  canvas.style = "transform: scale(1, 1); flex: 0";
}

/*function update_scale(){
  // clear
  auxCanvas.getContext("2d").clearRect(0,0,auxCanvas.width,auxCanvas.height);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  //scale = Number($("scale").value);

  ctx.scale(scale, scale);
  //console.log("new scale: %f", scale);
}*/