import { Localized, withLocalization } from 'fluent-react/compat';
import * as React from 'react';

import './mturk-success.css';

const MturkSuccess = () => {
  return (
    <div className="contribution-mturk-success">
      <Localized id="mturk-upload-success-clips">
        <h1 />
      </Localized>
    </div>
  );
};

export default withLocalization(MturkSuccess);
