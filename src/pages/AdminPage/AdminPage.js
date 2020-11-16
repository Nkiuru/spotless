import React from 'react';
import PageContainer from "../../containers/PageContainer";
import {Typography} from "@material-ui/core";

const AdminPage = () => {
  return (
    <PageContainer style={{textAlign: 'start'}}>
      <Typography variant={"h5"}>Simulator</Typography>
    </PageContainer>
  )
}

export default AdminPage;