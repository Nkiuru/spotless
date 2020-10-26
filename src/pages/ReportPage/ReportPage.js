import React from 'react';
import {useLocation} from "react-router-dom";

const ReportPage = () => {
  const location = useLocation();
  const {id} = location.state;
  return (
    <div>
      Report details {id}
    </div>
  )
}

export default ReportPage;