import React from "react";
import {IconButton, Paper, Table, TableContainer, TableHead, TableRow, Typography} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Check, CloseRounded, VisibilityOutlined} from "@material-ui/icons";
import {Link as RouterLink, useHistory} from 'react-router-dom';
import moment from "moment";
import styles from './CleaningReportTable.module.scss';
import Link from "@material-ui/core/Link";
import PropTypes from 'prop-types';

const CleaningReportsTable = ({reports, type}) => {
  const history = useHistory();
  const viewReport = (report) => {
    const id = report['_id'];
    history.push({
      pathname: `/rooms/reports/${id}`,
      state: {id}
    })
  }
  const getIcon = (successful) => {
    return successful ? (<Check className={styles.good}/>) : (<CloseRounded color={"error"}/>);
  }

  const getCleaner = (report) => {
    return (<Link component={RouterLink} color="secondary"
                  to={{
                    pathname: `/cleaners/${report['cleaner_id']}`,
                    state: {id: report['cleaner_id']}
                  }}>
      {report['cleaner_name']}
    </Link>);
  }

  const getRoom = (report) => {
    return (<Link component={RouterLink} color="secondary"
                  to={{
                    pathname: `/rooms/${report['room_id']}`,
                    state: {id: report['room_id']}
                  }}>
      {report['room_name']}
    </Link>);
  }
  return (
    <div>
      <Typography variant={"h5"} style={{margin: '16px 0'}} className={styles.semiBold}>Past cleaning reports</Typography>
      {reports.length > 0 ?
        <TableContainer component={Paper}>
          <Table size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell>{type === 'room' ? 'Cleaner' : 'Room'}</TableCell>
                <TableCell align="right">Cleaning time</TableCell>
                <TableCell>Cleaning successful</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((row) => (
                <TableRow key={row['_id']}>
                  <TableCell component="th" scope="row">
                    {type === 'room' ? getCleaner(row) : getRoom(row)}
                  </TableCell>
                  <TableCell align="right">{moment(row['cleaning_time']).format('DD.MM.YYYY HH:mm')}</TableCell>
                  <TableCell>{getIcon(row['cleaning_succesful'])}</TableCell>
                  <TableCell>
                    <IconButton size={"small"} color={"secondary"} onClick={() => {
                      viewReport(row)
                    }}><VisibilityOutlined/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        : <Typography variant={"h6"}>No cleaning Reports</Typography>
      }
    </div>
  );
}
CleaningReportsTable.propTypes = {
  reports: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['cleaner', 'room']).isRequired

}
export default CleaningReportsTable;