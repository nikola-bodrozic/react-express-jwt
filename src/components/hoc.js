import React from 'react';
const style = { border: "2px dotted red" }
const hocner = (WrappedComponent) => {
  class HOC extends React.Component {
    render() {
      return (
        this.props.contacts===undefined 
            ? 
            <div style={style}><WrappedComponent  {...this.props} passedNumber={42} /></div>
            :
            <div style={style}><WrappedComponent  {...this.props} passedNumber={84} /></div>
      );
    }
  }
  return HOC;
};

export default hocner;