import React, {useEffect, useState} from "react";
import {useLocation} from 'react-router-dom';
import {IconButton, Paper, Table, TableContainer, TableHead, TableRow, Typography} from "@material-ui/core";
import {getAssignedRooms, getCleaner} from "../../utils/api";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {DeleteForever} from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import PageContainer from "../../containers/PageContainer";


const CleanerDetailsPage = () => {
  const location = useLocation();
  const params = location.state;
  const [cleanerLoaded, setCleanerLoaded] = useState(false);
  const [cleaner, setCleaner] = useState({});

  useEffect(() => {
    getCleaner(params.id)
      .then((room) => {
          console.log(room);
          setCleaner(room);
          setCleanerLoaded(true);
        },
        (error) => {
          console.log(error);
        });

  }, [params.id]);

  return (
    <PageContainer>
      <Typography variant={"h5"}>Cleaner details</Typography>
      {cleanerLoaded && (
        <>
          <Typography>Cleaner name: {cleaner.name}</Typography>
          <AssignmentsTable cleaner={cleaner}/>
        </>
      )}
    </PageContainer>
  );
}

const AssignmentsTable = ({cleaner}) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAssignedRooms(cleaner['_id'])
      .then((assignments) => {
        console.log(assignments);
        setAssignments(assignments);
        setLoading(false);
      }, (error) => {
        console.log(error);
      })
  }, [cleaner]);
  return (
    loading ? <CircularProgress color="secondary"/> :
      <TableContainer component={Paper}>
        <Table size={"small"}>
          <TableHead>
            <TableRow>
              <TableCell>Room</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Contamination Index</TableCell>
              <TableCell align="right">Room type</TableCell>
              <TableCell align="right">Cleaning Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((row) => (
              <TableRow key={row['_id']}>
                <TableCell component="th" scope="row">{row.name}</TableCell>
                <TableCell align="right">{}</TableCell>
                <TableCell align="right">{row['contamination_index']}</TableCell>
                <TableCell align="right">{row['room_type']}</TableCell>
                <TableCell align="right">{row['is_cleaning'] ? 'Cleaning in progress' : 'Needs cleaning'}</TableCell>
                <TableCell>
                  <IconButton><DeleteForever/></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
}

export default CleanerDetailsPage;