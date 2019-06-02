import React from 'react';

import CodeEditor from './AceEditor/AceEditor';


const Editor = ({ code, path, name, index, changeCode }) => {
  return (
    <CodeEditor
      index={index}
      name={name}
      mode='javascript'
      theme='twilight'
      path={path}
      setReadOnly={false}
      style={{ height: '500px', width: '100%' }}
      setValue={code}
      setUseWorker={false}
      onChange={onChange}
    >
    </CodeEditor>
  );
}

let timeout = null

const onChange = (code, path, name, event) => {
  
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    fetch(`http://localhost:9090/files`,{
      body: JSON.stringify({
        path: path,
        name: name,
        content: code
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }, 1000)
}

export default Editor;
