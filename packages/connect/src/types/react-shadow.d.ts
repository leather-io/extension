declare module 'react-shadow/styled-components' {
  import * as React from 'react';

  type Root = {
    // [name: string]: React.ComponentType;
    div: React.FC<React.HTMLAttributes>;
  };

  const ReactShadowRoot: Root;

  export default ReactShadowRoot;
}