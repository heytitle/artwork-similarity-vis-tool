/*
* HomePage
*
* This is the first thing users see of our App, at the '/' route
*
* NOTE: while this component should technically be a stateless functional
* component (SFC), hot reloading does not currently support SFCs. If hot
* reloading is not a necessity for you then you can refactor it and remove
* the linting exception.
*/

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './style.css';
import _ from 'lodash';
import * as qs from 'query-string';


/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      input: '',
      filter: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event){
      let value = event.target.value;
      console.log('something is typing ' + value);
      this.setState({input: value});
  }

  handleClick(event){
      this.setState({filter: this.state.input});
  }

  componentDidMount() {
    const datasource = qs.parse(location.search).s;
    if(!datasource){
        alert('please specify datasource `..?s=<SOURCE>`');
    }

    fetch(datasource)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          data: result
        });
      },
      (error) => {
        alert('something strange is happening!')
      }
    )
  }
  render() {
    const { filter, data } = this.state;

    let artworks;
    if(filter){
      artworks = data.filter( a => {
          return a.artwork.title.match(new RegExp(filter, 'i'));
      });
    } else {
      artworks = _.take(data, 10);
    }

    let artworkDoms = artworks.map( (a, i) => {
      let simDoms = _.take(a.sims, 5).map( (s, j) => {
        return <li key={j}>
          <img src={s.image} className="sim-img"/>
          <div className="sim-details">
            <h3>{s.title}</h3>
            from <b>{s.external_house}</b> on {s.auction_date} | ID: {s.id} | hammer price: {s.hammer_price}
          </div>

          <div className="sim-score">

            score <div className="score">{s.score.toFixed(4)}</div>
        </div>
        <div className="clear"></div>
      </li>
    });

    return <li key={i}>
      <div className="artwork">
        <h2>{a.artwork.title}</h2>
        <img src={a.artwork.image} className="artwork-img"/>
        <div className="artwork-details">
          <h3>{a.artwork.artist_name}</h3>
          <b>Dimensions: {a.artwork.measurement_height} x {a.artwork.measurement_width}</b>
          <div>ID: {a.artwork.id} | hammer price: {a.artwork.hammer_price}</div>
        </div>
      </div>
      <div className="sim-panel">
        <span className="title">Similar lots</span>
        <ul className="sim-list">
          {simDoms}
        </ul>
      </div>
      <div className="clear"></div>
    </li>
    return
  });

  return (
    <div className="artwork-similarity-page">
        <h1>
          <FormattedMessage {...messages.header} /><br/>
        </h1>
        Title Filter: <input type="text" placeholder="type something" onChange={this.handleChange}/>
        <button onClick={this.handleClick} value="Update">Update</button>
      <hr/>
      <ul className="artwork-list">
        {artworkDoms}
      </ul>
    </div>
  );
}}
