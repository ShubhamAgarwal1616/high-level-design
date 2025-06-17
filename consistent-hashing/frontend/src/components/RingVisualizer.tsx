import React from 'react';

export const RingVisualizer: React.FC<{ mapping: { key: string; serverId: string | null; hash: number }[] }> = ({ mapping }) => (
  <table border={1} cellPadding={5}>
    <thead>
    <tr><th>Key</th><th>Hash</th><th>Server</th></tr>
    </thead>
    <tbody>
    {mapping.map(m => (
      <tr key={m.key}>
        <td>{m.key}</td>
        <td>{m.hash}</td>
        <td>{m.serverId || '—'}</td>
      </tr>
    ))}
    </tbody>
  </table>
);
