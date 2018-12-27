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
import _ from 'lodash';
import * as qs from 'query-string';
import styles from './style.css';
import { datasource } from './datasource';

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      input: '',
      filter: '',
      dataset: 'moma-artworks-1000',
      architecture: 'vgg16',
      src: qs.parse(location.search).s,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChangeDataset = this.handleChangeDataset.bind(this);
    this.handleChangeArchitecture = this.handleChangeArchitecture.bind(this);

    this.takeRandomArtwork = this.takeRandomArtwork.bind(this);
  }

  handleChange(event) {
    if (this.timeoutObject) {
      clearTimeout(this.timeoutObject);
    }
    const value = event.target.value;
    console.log(`something is typing ${value}`);
    this.setState({ input: value });
    this.timeoutObject = setTimeout(() => {
      console.log('Fire!!!!!11');
      this.handleClick();
    }, 1500);
  }

  handleChangeDataset(event) {
    this.setState({ dataset: event.target.value, data: [] }, () => {
      this.fetchData();
    });
  }

  handleChangeArchitecture(event) {
    console.log(event.target.value);
    this.setState({ architecture: event.target.value, data: [] }, () => {
      this.fetchData();
    });
  }

  handleClick(event) {
    this.setState({ filter: this.state.input });
  }

  takeRandomArtwork(event) {
    const idx = Math.floor(Math.random() * this.state.data.length);

    const title = this.state.data[idx].artwork.title;

    this.setState({
      input: title,
      filter: title,
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  buildSource() {
    if (this.state.src) {
      return this.state.src;
    }

    return datasource.mapping[
      `${this.state.dataset}--${this.state.architecture}`
    ];
  }

  fetchData() {
    const src = this.buildSource();
    console.log(`fetching ${src}`);
    fetch(src)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            data: result,
          });
        },
        error => {
          alert('something strange is happening!');
        },
      );
  }

  render() {
    const { filter, data } = this.state;

    let artworks;
    if (filter) {
      const efilter = filter.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      artworks = data.filter(a =>
        a.artwork.title.match(new RegExp(efilter, 'i')),
      );

      artworks = _.take(artworks, 20);
    } else {
      artworks = _.take(data, 20);
    }

    const artworkDoms = artworks.map((a, i) => {
      const simDoms = _.take(a.sims, 5).map((s, j) => (
        <li key={j}>
          <img src={s.image} className="sim-img" />
          <div className="sim-details">
            <h3>{s.title}</h3>
            <div>
              by <b>{s.artist_name}</b>
            </div>
            <div>
              <b>Medium:</b> {s.medium}
            </div>
            <div>
              <b>Dimensions:</b> {s.dimensions}
            </div>
            <div
              className="manipulate"
              title={`Manipulated by ${s.manipulation_profile}`}
            >
              {s.manipulation_profile}
            </div>
          </div>

          <div className="sim-score">
            score <div className="score">{s.score.toFixed(4)}</div>
          </div>
          <div className="clear" />
        </li>
      ));

      return (
        <li key={i}>
          <div className="artwork">
            <img src={a.artwork.image} className="artwork-img" />
            <div className="artwork-details">
              <h2>{a.artwork.title}</h2>
              <h3>by {a.artwork.artist_name}</h3>
              <div>
                <b>Medium:</b> {a.artwork.medium}
              </div>
              <div>
                <b>Dimensions:</b> {a.artwork.dimensions}
              </div>
            </div>
          </div>
          <div className="sim-panel">
            <span className="title">Similar artworks</span>
            <ul className="sim-list">{simDoms}</ul>
          </div>
          <div className="clear" />
        </li>
      );
    });

    const datasetDOM = datasource.datasets.map(d => (
      <option key={d.key} value={d.key}>
        {d.desc}
      </option>
    ));

    const architectureDOM = datasource.architectures.map(a => (
      <option key={a.key} value={a.key}>
        {a.desc}
      </option>
    ));

    return (
      <div className="artwork-similarity-page">
        <h1>Visually Similar Image Search Analysis Tool</h1>
        <div className="form">
          {!qs.parse(location.search).s && (
            <div>
              <span className="dropdown">
                <b>Dataset</b>
                <select
                  defaultValue={this.state.dataset}
                  onChange={this.handleChangeDataset}
                >
                  {datasetDOM}
                </select>
              </span>

              <span className="dropdown">
                <b>Features computed from</b>
                <select
                  defaultValue={this.state.architecture}
                  onChange={this.handleChangeArchitecture}
                >
                  {architectureDOM}
                </select>
              </span>
            </div>
          )}
          <input
            type="text"
            placeholder="artwork's title"
            onChange={this.handleChange}
            value={this.state.input}
          />
          <button onClick={this.takeRandomArtwork} value="Update">
            Surpise me!
          </button>
          <div className="clear" />
        </div>
        <div className="datasource">
          <b>Datasource:</b> {this.buildSource()}
        </div>
        <ul className="artwork-list">{artworkDoms}</ul>
      </div>
    );
  }
}
