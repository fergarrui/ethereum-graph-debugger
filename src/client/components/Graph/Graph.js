import React,  { Component } from 'react';

import styles from './Graph.scss';

import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz';

import { connect } from 'react-redux';
import * as actions from '../../_redux/actions.js';

const mapDispatchToProps = {
  selectLines: actions.selectEditorLines,
  toggleEVMState: actions.toggleEVMState,
}

const previousPolygons = []

class ConnectedGraph extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    const { cfg, graphId, graphType } = this.props;
    const graphclass = graphId.replace('.sol', '').replace('.evm', '');
    const graphviz = d3.select(`.graph--${graphclass}--${graphType}`).graphviz()
    graphviz.totalMemory(1074790400)
    graphviz.renderDot(cfg);
    // TODO make it configurable?
    graphviz._zoomBehavior.scaleExtent([1/10, 10000]);
    d3.selectAll("a").attr("href", null).attr("title", null);
  }

  handleClick(event) {
    const { operations, selectLines, trace, toggleEVMState } = this.props;
    
    if (event.target.tagName === 'text') {
      const elem = d3.select(event.target.parentElement.parentElement);
      const domId = elem.attr('id')
      const id = domId.replace('a_', '');
      const idNum = parseInt(id, 16);
      if(trace && trace[idNum]) {
        toggleEVMState(trace[idNum]);
      } else {
        toggleEVMState('');
      }
      const polygon = document.getElementById(domId).getElementsByTagName("polygon")[0];
      polygon.setAttribute('fill', 'white');
      this.clearPreviousPolygons();
      previousPolygons.push(polygon)
      const selectedOperation = operations.find(op => op.offset === idNum);

      if (selectedOperation && selectedOperation.begin && selectedOperation.end) {
        selectLines([selectedOperation.begin, selectedOperation.end]);
      }
    }
  }

  clearPreviousPolygons() {
    for (const pol of previousPolygons) {
      pol.setAttribute('fill', 'none');
    }
    previousPolygons.length = 0
  }

  render() {
    const { cfg, graphId, graphType } = this.props;

    const graphclass = `${graphId.replace('.sol', '').replace('.evm', '')}--${graphType}`;

    return (
      <div className={styles['graph-container']}>
        <div onClick={(e) => this.handleClick(e)} className={`graph--${graphclass}`} cfg={cfg}></div>
      </div>
    );
  }
}

const Graph = connect(null, mapDispatchToProps)(ConnectedGraph);

export default Graph;
