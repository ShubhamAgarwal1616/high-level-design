import React, { useState } from 'react';
import { addServer, removeServer, addKey } from '../services/api';

export const Controls: React.FC<{ load: () => {} }> = ({load}) => {
  const [serverId, setServerId] = useState('');
  const [key, setKey] = useState('');

  function addNewServer() {
    if (serverId.trim() !== '') {
      addServer(serverId.toUpperCase()).then(() => {
        load();
      });
      setServerId('');
    }
  }

  function remove() {
    if (serverId.trim() !== '') {
      removeServer(serverId.toUpperCase()).then(() => {
        load();
      });
      setServerId('');
    }
  }

  function addNewKey() {
    if (key.trim() !== '') {
      addKey(key.toUpperCase()).then(() => {
        load();
      });
      setKey('');
    }
  }

  return (
    <div>
      <input placeholder="Server ID" value={serverId} onChange={e => setServerId(e.target.value)} />
      <button onClick={addNewServer}>Add Server</button>
      <button onClick={remove}>Remove Server</button>
      <br/>
      <input placeholder="Key" value={key} onChange={e => setKey(e.target.value)} />
      <button onClick={addNewKey}>Add Key</button>
    </div>
  );
};
