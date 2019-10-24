import * as React from 'react';

import './mturk-manage.css';

const MturkSuccess = () => {
  return (
    <iframe
      className="mturk-manage"
      src="https://mturk-manager.firebaseapp.com"
      frameborder="0"
    />
  );
};

export default MturkSuccess;
