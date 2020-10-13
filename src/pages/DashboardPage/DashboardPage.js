import React from 'react';
import {Button} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const DashboardPage = () => {
  return (
    <div style={{paddingTop: '16px'}}>
      <p>Dashboard</p>
      <Button color="secondary" variant="contained">Test button</Button>
    </div>
  )
}

export default DashboardPage;