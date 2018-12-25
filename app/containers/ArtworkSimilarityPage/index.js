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
    if(this.timeoutObject){
      clearTimeout(this.timeoutObject);
    }
    let value = event.target.value;
    console.log('something is typing ' + value);
    this.setState({input: value});
    this.timeoutObject = setTimeout(() => {
      console.log('Fire!!!!!11');
      this.handleClick();
    }, 1500)
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
            <div>by <b>{s.artist_name}</b></div>
            <div><b>Medium:</b> {s.medium}</div>
            <div><b>Dimensions:</b> {s.dimensions}</div>
          </div>

          <div className="sim-score">

            score <div className="score">{s.score.toFixed(4)}</div>
        </div>
        <div className="clear"></div>
      </li>
    });

    return <li key={i}>
      <div className="artwork">
        <img src={a.artwork.image} className="artwork-img"/>
        <div className="artwork-details">
          <h2>{a.artwork.title}</h2>
          <h3>by {a.artwork.artist_name}</h3>
          <div><b>Medium:</b> {a.artwork.medium}</div>
          <div><b>Dimensions:</b> {a.artwork.dimensions}</div>
        </div>
      </div>
      <div className="sim-panel">
        <span className="title">Similar artworks</span>
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
          Artwork Similarity Visualization Tool
        </h1>
        <div className="form">
          <input type="text" placeholder="artwork's title" onChange={this.handleChange}/>
          <button onClick={this.handleClick} value="Update">Force Reload</button>
          <div className="clear"></div>
        </div>
        <div className="datasource">
          <b>Datasource:</b> {qs.parse(location.search).s}
        </div>
      <ul className="artwork-list">
        {artworkDoms}
      </ul>
    </div>
  );
}}
