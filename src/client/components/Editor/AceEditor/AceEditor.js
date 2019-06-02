import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

if (typeof window !== 'undefined') {
  const ace = require('brace');
}

const mapStateToProps = state => {
  return {
      selectedLines: state.selectLines,
 }
}

class ConnectedCodeEditor extends React.Component {

  componentDidMount() {
    if (typeof window !== 'undefined') {
      const {
        onChange,
        setReadOnly,
        setValue,
        theme,
        path,
        name,
        mode,
        setUseWorker,
        index,
        selectedLines
      } = this.props;
      require(`brace/mode/${mode}`);
      require(`brace/theme/${theme}`);
      const editor = ace.edit(`ace-editor-${index}`);
      this.editor = editor;
      editor.getSession().setMode(`ace/mode/${mode}`);
      editor.getSession().setUseWorker(setUseWorker);
      editor.setTheme(`ace/theme/${theme}`);
      editor.on('change', e => onChange(editor.getValue(),path,name, e));
      editor.setReadOnly(setReadOnly);
      editor.setValue(setValue);
      this.selectLines(selectedLines);
    }
  }

  componentDidUpdate() {
    const { selectedLines, path } = this.props;
    this.selectLines(selectedLines);
  }

  selectLines(selected) {
    const {
      index
    } = this.props;
    if(selected.length !== 2) {
      return;
    }
    const editor = ace.edit(`ace-editor-${index}`);
    const lines = editor.session.doc.getAllLines();
    let s = selected[0];
    let e = selected[1];
    let startRow = 0;
    let startCol = 0;
    let endRow = 0;
    let endCol = 0;
    let startFound = false;
    let endFound = false;
    // if (begin >= end) {
    //     const temp = begin;
    //     begin = end;
    //     end = temp;
    // }
    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (s > line.length && !startFound) {
            startRow++;
            // +1 because of new line
            s -= line.length + 1;
        } else {
            startCol = s;
            startFound = true;
        }
        if (e > line.length && !endFound) {
            endRow++;
            // + 1 because of new line
            e -= line.length + 1;
        } else {
            endCol = e;
            endFound = true;
        }
        if (startFound && endFound) {
            break;
        }
    }
    const Range = ace.acequire('ace/range').Range;
    const range = new Range(startRow, startCol, endRow, endCol);
    editor.gotoLine(startRow, 0, true);
    editor.session.selection.setSelectionRange(range, false);
  }

  render() {
    const { style, index } = this.props;

    return (
        <div id={`ace-editor-${index}`} style={style}></div>
    );
  }
}

ConnectedCodeEditor.propTypes = {
  editorId: PropTypes.string,
  onChange: PropTypes.func,
  setReadOnly: PropTypes.bool,
  setValue: PropTypes.string,
  theme: PropTypes.string,
  mode: PropTypes.string,
  style: PropTypes.object,
};

ConnectedCodeEditor.defaultProps = {
  onChange: () => {},
  setValue: '',
  setReadOnly: false,
  theme: 'eclipse',
  mode: 'javascript',
  style: { height: '300px', width: '400px'}
};


const CodeEditor = connect(mapStateToProps)(ConnectedCodeEditor);

export default CodeEditor;
