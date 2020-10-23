import React from 'react';
import styles from './StatusDot.module.scss';
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";


const StatusDot = ({variant, size, tooltip}) => {
  const classes = [styles.dot];
  classes.push(variant ? styles[variant] : styles.neutral);
  classes.push(size ? styles[size] : styles.small);
  return (
    <Tooltip title={tooltip}>
      <div className={classes.join(' ')}/>
    </Tooltip>
  );
}

StatusDot.propTypes = {
  variant: PropTypes.oneOf(['good', 'critical', 'medium']).isRequired,
  size: PropTypes.oneOf(['small', 'medium']).isRequired,
  tooltip: PropTypes.string
}

export default StatusDot;