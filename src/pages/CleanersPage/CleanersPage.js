import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import moment from "moment";
import {IconButton, Paper, Table, TableContainer, TableHead, TableRow, Typography} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {VisibilityOutlined} from "@material-ui/icons";
import {getCleaners} from "../../utils/api";

const CleanersPage = () => {
  const [cleaners, setCleaners] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getCleaners()
      .then((cleaners) => {
        console.log(cleaners)
        setCleaners(cleaners);
        setIsLoaded(true);
      }, (err) => {
        console.log(err);
      })
  }, [])
  return (
    <div>
      <Typography variant={"h5"}>Cleaners</Typography>
      {isLoaded && <CleanersTable cleaners={cleaners}/>}
    </div>
  )
}

const CleanersTable = ({cleaners}) => {
  const history = useHistory();

  const viewCleaner = (cleaner) => {
    const id = cleaner['_id'];
    history.push({
      pathname: `/cleaners/${id}`,
      state: {id}
    })
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Shift start</TableCell>
            <TableCell align="right">Shift end</TableCell>
            <TableCell align="right">Cleaning percent</TableCell>
            <TableCell align="right">Current location</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cleaners.map((row) => (
            <TableRow key={row['_id']}>
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell align="right">{row['shift_start']}</TableCell>
              <TableCell align="right">{row['shift_end']}</TableCell>
              <TableCell align="right">{}</TableCell>
              <TableCell align="right">{}</TableCell>
              <TableCell align="right">{}</TableCell>
              <TableCell>
                <IconButton color={"secondary"} onClick={() => {
                  viewCleaner(row)
                }}><VisibilityOutlined/></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


export default CleanersPage;