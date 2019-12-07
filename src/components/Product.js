import React from 'react';
import wireCompWithProp from './hoc';

const Product = props => (
  <div className="Border">
    i'm product number from HOC {props.passedNumber}.
  </div>
);

export default wireCompWithProp(Product);