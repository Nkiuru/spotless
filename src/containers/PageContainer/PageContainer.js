import React from 'react';
import styles from './PageContainer.module.scss';
import PropTypes from 'prop-types';

const PageContainer = ({ children }) => (
  <div className={styles.pageContainer}>
    <div className={styles.pageContent}>{children}</div>
  </div>
);
PageContainer.propTypes = {
  children: PropTypes.node,
};

export default PageContainer;
