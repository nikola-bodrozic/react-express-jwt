import React from 'react';
import wireCompWithProp from './hoc';

const Posts = props => (
  <div className="Border">
    i'm post number from HOC {props.passedNumber}.
  </div>
);

export default wireCompWithProp(Posts);