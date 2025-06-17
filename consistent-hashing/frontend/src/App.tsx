import React, { useEffect, useState } from 'react';
import { fetchState } from './services/api';
import { RingVisualizer } from './components/RingVisualizer';
import { Controls } from './components/Controls';
import Tree from "./components/Tree";

function App() {
  const [state, setState] = useState<any>(null);

  const load = () => {
    fetchState().then((s) => setState(s));
  };

  useEffect(() => {
    load();
  }, []);

  if (!state) return <div>Loading...</div>;
  console.log('testing', state);
  return (
    <div style={{ padding: 20 }}>
      <h1>Consistent Hashing Demo</h1>
      <Controls load={load} />
      <div id="visuals">
        <div>
          <h2>AVL Ring</h2>
          <Tree treeData={state.tree} />
        </div>
        <div>
          <h2>Key → Server Mapping</h2>
          <RingVisualizer mapping={state.mapping} />
        </div>
      </div>
    </div>
  );
}

export default App
