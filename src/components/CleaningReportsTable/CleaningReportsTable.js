import React from "react";
import {
  IconButton,
  Paper,
  Table,
  TableContainer,
  TableHead, TablePagination,
  TableRow,
  TableSortLabel,
  Typography
} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Check, CloseRounded, VisibilityOutlined} from "@material-ui/icons";
import {Link as RouterLink, useHistory} from 'react-router-dom';
import moment from "moment";
import styles from './CleaningReportTable.module.scss';
import Link from "@material-ui/core/Link";
import PropTypes from 'prop-types';
import {getComparator, stableSort} from "../../utils/tableUtils";
import {makeStyles} from "@material-ui/core/styles";

function ReportsTableHead(props) {
  const {classes, order, orderBy, onRequestSort, type} = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const headCells = [
    {id: 'cleaning_time', numeric: true, disablePadding: false, label: 'Cleaning time'},
    {id: 'cleaning_successful', numeric: false, disablePadding: false, label: 'Cleaning successful'},
    {id: 'action', numeric: true, disablePadding: false, label: 'Action'},
  ];
  if (type === 'room') {
    headCells.unshift({id: 'room', numeric: false, disablePadding: false, label: 'Room'});
  } else {
    headCells.unshift({id: 'cleaner', numeric: false, disablePadding: false, label: 'Cleaner'});
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

ReportsTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['room', 'cleaner']).isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const CleaningReportsTable = ({reports, type}) => {
  const history = useHistory();
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [reportsPerPage, setReportsPerPage] = React.useState(10);
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setReportsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Typography variant={"h5"} style={{margin: '16px 0'}} className={styles.semiBold}>Past cleaning
        reports</Typography>
      {reports.length > 0 ?
        <Paper className={classes.paper}>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
              size={'small'}
            >
              <ReportsTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                type={type}
              />
              <TableBody>
                {stableSort(reports, getComparator(order, orderBy))
                  .slice(page * reportsPerPage, page * reportsPerPage + reportsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={labelId}
                        style={{height: '33px'}}
                      >
                        <TableCell component="th" id={labelId} scope="row">
                          {type === 'room' ? getCleaner(row) : getRoom(row)}
                        </TableCell>
                        <TableCell align="right">{moment(row['cleaning_time']).format('DD.MM.YYYY HH:mm')}</TableCell>
                        <TableCell>{getIcon(row['cleaning_succesful'])}</TableCell>
                        <TableCell align="right">
                          <IconButton color={"secondary"} size={"small"}
                                      onClick={() => {
                                        viewReport(row)
                                      }}>
                            <VisibilityOutlined/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={reports.length}
            rowsPerPage={reportsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
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