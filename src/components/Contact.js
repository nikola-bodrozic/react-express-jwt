import React, { Component } from 'react';
import wireCompWithProp from './hoc';

class Contact extends Component {
  render() {
    return(    
      <div className="Border">
        i'm contact number from HOC {this.props.passedNumber}.
        <br />
        <br />
        <br />
        <br />
        {
          this.props.contacts.map( c => <div key={c.email}> {c.email} </div> )
        }
      </div>
    )
  }
}

export default wireCompWithProp(Contact);