import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Item({ req, onAccept, onReject }){
  const my = req.mySlotId;
  const th = req.theirSlotId;
  return (
    <div className="card">
      <div className="card-title">{th?.title} ↔ {my?.title}</div>
      <div className="card-sub">Status: <b>{req.status}</b></div>
      {onAccept && onReject && req.status === 'PENDING' && (
        <div className="row">
          <div className="spacer" />
          <button className="btn" onClick={()=>onReject(req)}>Reject</button>
          <button className="btn primary" onClick={()=>onAccept(req)}>Accept</button>
        </div>
      )}
    </div>
  );
}

export default function Requests(){
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const fetchAll = async () => {
    const [i, o] = await Promise.all([
      api.get('/swap/incoming'),
      api.get('/swap/outgoing')
    ]);
    setIncoming(i.data);
    setOutgoing(o.data);
  };

  useEffect(()=>{ fetchAll(); }, []);

  const accept = async (req) => {
    await api.post(`/swap-response/${req._id}`, { accept: true });
    await fetchAll();
  };

  const reject = async (req) => {
    await api.post(`/swap-response/${req._id}`, { accept: false });
    await fetchAll();
  };

  return (
    <div className="page">
      <div className="columns">
        <div className="col">
          <h3>Incoming</h3>
          {incoming.map((r)=> (
            <Item key={r._id} req={r} onAccept={accept} onReject={reject} />
          ))}
          {incoming.length === 0 && <div className="muted">No incoming requests.</div>}
        </div>
        <div className="col">
          <h3>Outgoing</h3>
          {outgoing.map((r)=> (
            <Item key={r._id} req={r} />
          ))}
          {outgoing.length === 0 && <div className="muted">No outgoing requests.</div>}
        </div>
      </div>
    </div>
  );
}
