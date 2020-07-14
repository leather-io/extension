import React, { useState } from 'react';
import { mdx } from '@mdx-js/react';
import * as BlockstackUI from '@blockstack/ui';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import { JsxEditor, SimpleCodeBlock, Preview } from '@components/code-block/components';
import { useForceUpdate } from '@blockstack/ui';

export const CodeBlock = ({ className, live = true, isManual, render, children, ...props }) => {
  const [editorCode, setEditorCode] = useState(children.trim());

  const update = useForceUpdate();
  React.useEffect(() => {
    update();
  }, []);

  const language = className && className.replace(/language-/, '');

  const liveProviderProps = {
    language,
    code: editorCode,
    transformCode: code => '/** @jsx mdx */' + code,
    scope: {
      ...BlockstackUI,
      mdx,
    },
    noInline: isManual,
    ...props,
  };
  const handleCodeChange = (newCode: string) => setEditorCode(newCode.trim());
  if (language === 'jsx' && live === true) {
    return (
      <JsxEditor
        liveProviderProps={liveProviderProps}
        editorCode={editorCode}
        handleCodeChange={handleCodeChange}
        language={language}
      />
    );
  }
  if (render) {
    return <Preview liveProviderProps={liveProviderProps} {...props} />;
  }
  return <SimpleCodeBlock editorCode={editorCode} language={language} {...props} />;
};

CodeBlock.defaultProps = {
  mountStylesheet: false,
};

export default CodeBlock;
