import React from 'react';
import styles from './PageContainer.module.scss';
import PropTypes from 'prop-types';

const PageContainer = ({ children, style, noToolbar }) => {
  const top = noToolbar ? 0 : '48px';
  return (
    <div className={styles.pageContainer} style={{top}}>
      <div className={styles.pageContent} style={style}>{children}</div>
    </div>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  noToolbar: PropTypes.bool
};

export default PageContainer;
