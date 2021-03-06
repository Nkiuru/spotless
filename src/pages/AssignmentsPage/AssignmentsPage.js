import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Button
} from '@material-ui/core';
import {getRooms, unAssignRooms} from "../../utils/api";
import {VisibilityOutlined, FilterList, Close} from "@material-ui/icons";
import moment from "moment";
import {useHistory} from 'react-router-dom';
import CircularProgress from "@material-ui/core/CircularProgress";
import PageContainer from "../../containers/PageContainer";
import {getComparator, handleClick, stableSort} from "../../utils/tableUtils";
import styles from "./AssignmentsPage.module.scss"
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {AssignCleanerDialog} from "./AssignCleanerDialog";
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from 'react-router-dom';
import {getRoomTypeProp, getStatus, mergeCleaners} from "../../utils/utils";
import TableFilters from "./TableFilters";
import EnhancedTableHead from "../../components/RoomSelector/EnhancedTableHead";

const headCells = [
  {id: 'name', numeric: false, disablePadding: true, label: 'Name'},
  {id: 'building', numeric: true, disablePadding: false, label: 'Building'},
  {id: 'floor', numeric: true, disablePadding: false, label: 'Floor'},
  {id: 'cleaner_name', numeric: false, disablePadding: false, label: 'Assigned Cleaner'},
  {id: 'status', numeric: false, disablePadding: false, label: 'Status'},
  {id: 'contamination_index', numeric: true, disablePadding: false, label: 'Contamination index'},
  {id: 'room_type', numeric: false, disablePadding: false, label: 'Room type'},
  {id: 'last_cleaned', numeric: true, disablePadding: false, label: 'Last cleaned'},
  {id: 'action', numeric: true, disablePadding: false, label: '', sort: false},
];

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    textAlign: 'left',
    flexDirection: 'column'
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  filters: {
    minHeight: 96
  },
  button: {
    minWidth: 160
  }
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {numSelected, selected, setSelected, setSnackOpen, setSnackText, getData, rooms, setRooms} = props;
  const [open, setOpen] = React.useState(false);
  const [filter, showFilters] = React.useState(false);
  const selectedWithCleaner = selected.filter((room) => {
    return room['assigned_cleaners'].length > 0;
  });

  const removeAssignments = async () => {
    await unAssignRooms(selectedWithCleaner);
    setSnackText('Cleaner unassigned');
    setSnackOpen(true);
    setSelected([]);
    getData(true);
  }
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
        [classes.filters]: filter && numSelected === 0
      })}
    >
      <div className={styles.row} style={{minHeight: 64}}>
        {numSelected > 0 ? (
          <Typography className={styles.title} color="inherit" variant="subtitle1" component="div"
                      style={{fontWeight: 600}}>
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={styles.title} variant="h5" id="tableTitle" component="div" style={{fontWeight: '600'}}
                      title="Click on row to select a room">
            Select rows to assign to cleaner
          </Typography>
        )}
        {numSelected > 0 ? (
          <>
            {selectedWithCleaner.length > 0 &&
            <Tooltip title="Remove room assignments">
              <Button variant={'contained'} startIcon={<Close/>} className={styles.critical}
                      style={{flexBasis: '300px', marginRight: 32}} onClick={removeAssignments}>Remove assignments
              </Button>
            </Tooltip>
            }
            <Tooltip title="Assign to cleaner">
              <Button variant={'contained'} color={'secondary'} style={{flexBasis: '180px'}} onClick={() => {
                setOpen(true);
              }}>Assign rooms</Button>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Filter list">
            <Button
              variant="contained"
              className={classes.button}
              startIcon={<FilterList color={filter ? 'secondary' : 'primary'}/>}
              onClick={() => {
                showFilters(!filter);
              }}
            >
              {filter ? 'Hide filters' : 'Show filters'}
            </Button>
          </Tooltip>
        )}
      </div>
      {filter && numSelected === 0 &&
      <div className={styles.row}>
        <TableFilters rooms={rooms} setRooms={setRooms}/>
      </div>
      }
      <AssignCleanerDialog open={open} setOpen={setOpen} selected={selected} onClose={() => {
        setSelected([]);
        getData(true);
      }} setSnackOpen={setSnackOpen} setSnackText={setSnackText}/>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  setSnackOpen: PropTypes.func.isRequired,
  rooms: PropTypes.array.isRequired
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

export default function AssignmentsPage() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [roomsPerPage, setRoomsPerPage] = React.useState(15);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [origRooms, setOrigRooms] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [data, getData] = React.useState(true);
  const history = useHistory();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rooms.map((n) => n);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  useEffect(() => {
    if (data) {
      getRooms(null, null, true, isLoaded)
        .then((rooms) => {
            rooms = mergeCleaners(rooms);
            setRooms(rooms);
            setOrigRooms(rooms);
            setIsLoaded(true);
            getData(false);
          },
          (error) => {
            setIsLoaded(true);
            console.log(error);
          });
    }
  }, [data, isLoaded]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRoomsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const getDate = (date) => {
    return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : 'Never';
  }

  const openRoom = (room) => {
    const id = room['_id'];
    history.push({
      pathname: `/rooms/${id}`,
      state: {id}
    })
  }

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const getCleaner = (row) => {
    if (!row.cleaner) {
      return row['cleaner_name'];
    }
    const cleaner = row.cleaner;
    return (<Link component={RouterLink} color="secondary"
                  to={{
                    pathname: `/cleaners/${cleaner['_id']}`,
                    state: {id: cleaner['_id']}
                  }}>
      {cleaner.name}
    </Link>);
  }

  return (
    <PageContainer className={classes.root}>
      {isLoaded ?
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} selected={selected} setSnackOpen={setSnackOpen}
                                setSelected={setSelected} setSnackText={setSnackText} getData={getData}
                                rooms={origRooms} setRooms={setRooms}/>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
              size={'small'}
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rooms.length}
                headCells={headCells}
                type={"selection"}
              />
              <TableBody>
                {stableSort(rooms, getComparator(order, orderBy))
                  .slice(page * roomsPerPage, page * roomsPerPage + roomsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row, selected, setSelected)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                        style={{height: '33px'}}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{'aria-labelledby': labelId}}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.building}</TableCell>
                        <TableCell align="right">{row.floor}</TableCell>
                        <TableCell>{getCleaner(row)}</TableCell>
                        <TableCell>{getStatus(row['contamination_index'])}</TableCell>
                        <TableCell align="right">{Math.min(row['contamination_index'].toFixed(2), 150)} %</TableCell>
                        <TableCell>{getRoomTypeProp(row, 'displayName')}</TableCell>
                        <TableCell align="right">{getDate(row['last_cleaned'])}</TableCell>
                        <TableCell align="right">
                          <Tooltip title={"View room"}>
                            <IconButton color={"secondary"} size={"small"}
                                        onClick={() => {
                                          openRoom(row)
                                        }}>
                              <VisibilityOutlined/>
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 25, 50]}
            component="div"
            count={rooms.length}
            rowsPerPage={roomsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        : <CircularProgress color="secondary" style={{margin: '16px auto'}}/>
      }
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}
                anchorOrigin={{vertical: "top", horizontal: "center"}}>
        <Alert variant={"filled"} severity="success" onClose={handleSnackClose}>
          {snackText}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}
