export function descendingComparator(a, b, orderBy) {
  if (typeof a[orderBy] === 'string' && typeof b[orderBy] === 'string') {
    if (a[orderBy] === undefined) return 1;
    if (b[orderBy].toUpperCase() < a[orderBy].toUpperCase()) {
      return -1;
    }
    if (b[orderBy].toUpperCase() > a[orderBy].toUpperCase()) {
      return 1;
    }
    return 0;
  } else {
    if (a[orderBy] === undefined) return 1;

    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export function handleClick(event, item, selected, setSelected) {
  const selectedIndex = selected.indexOf(item);
  let newSelected = [];

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, item);
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selected.slice(1));
  } else if (selectedIndex === selected.length - 1) {
    newSelected = newSelected.concat(selected.slice(0, -1));
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selected.slice(0, selectedIndex),
      selected.slice(selectedIndex + 1),
    );
  }

  setSelected(newSelected);
}