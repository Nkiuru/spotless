import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import {getCleaners} from "../../utils/api";
import styles from "./ContaminationMap.module.scss";

const ContaminationMap = ({onChange, style}) => {
  const [options, setOptions] = useState([]);
  const [openSelect, setOpenSelect] = useState(false);
  const [cleaner, setCleaner] = useState(null);
  const loading = openSelect && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const clnrs = await getCleaners();

      if (active) {
        setOptions(clnrs);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  const onSelectChange = (event, newValue) => {
    setCleaner(newValue);
    onChange(event, newValue);
  }

  return (
    <Autocomplete
      open={openSelect}
      onOpen={() => {
        setOpenSelect(true);
      }}
      onClose={() => {
        setOpenSelect(false);
      }}
      className={styles.autocomplete}
      style={style}
      getOptionLabel={(option) => option.name || ''}
      options={options}
      loading={loading}
      value={cleaner}
      onChange={onSelectChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Cleaner"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

ContaminationMap.propTypes = {
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object
}

export default ContaminationMap;