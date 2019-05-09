import React from 'react';

import CodeEditor from './AceEditor/AceEditor';

const Editor = ({ code, index }) => {

  return (
    <CodeEditor
      index={index}
      mode='javascript'
      theme='twilight'
      setReadOnly={true}
      style={{ height: '500px', width: '100%' }}
      setValue={code}
      setUseWorker={false}
    >
    </CodeEditor>
  );
}

export default Editor;
