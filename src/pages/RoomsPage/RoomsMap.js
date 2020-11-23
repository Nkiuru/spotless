import React from "react";
import hospitalImg from "../../assets/hospital.png";
import styles from "./RoomsPage.module.scss";
import ImageMapper from 'react-image-mapper';
import {HOSPITAL_MAP} from "../../utils/constants";

const RoomsMap = ({rooms}) => {

  const enter = (area, num, event) => {
    console.log(area);
    console.log(event)
  }
  return (
    <div>
      <ImageMapper src={hospitalImg} map={HOSPITAL_MAP} fillColor={'orange'} onMouseEnter={enter}/>
    </div>
  )
}

export default RoomsMap;