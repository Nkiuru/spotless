import React from "react";
import {IconButton, Paper, Table, TableContainer, TableHead, TableRow, Typography} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Check, Clear, VisibilityOutlined} from "@material-ui/icons";
import {Link as RouterLink, useHistory} from 'react-router-dom';
import moment from "moment";
import styles from './RoomDetailsPage.module.scss';
import Link from "@material-ui/core/Link";

const RoomReportsTable = ({reports}) => {
  const history = useHistory();
  const viewReport = (report) => {
    const id = report['_id'];
    history.push({
      pathname: `/reports/${id}`,
      state: {id}
    })
  }
  const getIcon = (successful) => {
    return successful ? (<Check className={styles.good}/>) : (<Clear color={"error"}/>);
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
  return (
    <div>
      <Typography variant={"h5"} style={{margin: '16px 0'}}>Past cleaning reports</Typography>
      <TableContainer component={Paper}>
        <Table size={'small'}>
          <TableHead>
            <TableRow>
              <TableCell>Cleaner</TableCell>
              <TableCell align="right">Cleaning time</TableCell>
              <TableCell>Cleaning successful</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((row) => (
              <TableRow key={row['_id']}>
                <TableCell component="th" scope="row">
                  {getCleaner(row)}
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
    </div>
  );
}

export default RoomReportsTable;