import React from "react";
import styles from "./DashboardPage.module.scss";
import {Typography} from "@material-ui/core";

const KeyStat = ({value, subtitle, color}) => {
  return (
    <div className={styles.stat}>
      <div className={styles.keyStat}>
        <Typography variant={"h3"} style={{color}}>{value}</Typography>
      </div>
      <Typography variant={"body2"} className={styles.subtitle}>{subtitle}</Typography>
    </div>
  );
}

export default KeyStat;