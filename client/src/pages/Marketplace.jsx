import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

function Card({ slot, onRequest }){
  const start = new Date(slot.startTime).toLocaleString();
  const end = new Date(slot.endTime).toLocaleString();
  return (
    <div className="card">
      <div className="card-title">{slot.title}</div>
      <div className="card-sub">{start} → {end}</div>
      <div className="row">
        <span className="badge swappable">SWAPPABLE</span>
        <div className="spacer" />
        <button className="btn primary" onClick={() => onRequest(slot)}>Request Swap</button>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [mySwappable, setMySwappable] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [chosenMyId, setChosenMyId] = useState('');
  const [error, setError] = useState('');

  const fetchSlots = async () => {
    const { data } = await api.get('/swappable-slots');
    setSlots(data);
  };

  const fetchMy = async () => {
    const { data } = await api.get('/event/getEvents');
    setMySwappable(data.filter((e) => e.status === 'SWAPPABLE'));
  };

  useEffect(() => { fetchSlots(); fetchMy(); }, []);

  const openModal = (slot) => { setSelected(slot); setOpen(true); setChosenMyId(''); setError(''); };

  const createRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/swap-request', { mySlotId: chosenMyId, theirSlotId: selected._id });
      setOpen(false);
      await fetchSlots();
      await fetchMy();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request');
    }
  };

  return (
    <div className="page">
      <div className="page-header"><h2>Swappable Slots</h2></div>
      <div className="grid">
        {slots.map((s) => (<Card key={s._id} slot={s} onRequest={openModal} />))}
        {slots.length === 0 && <div className="muted">No swappable slots available.</div>}
      </div>

      <Modal open={open} title="Offer Your Slot" onClose={()=>setOpen(false)}>
        {error && <div className="error">{error}</div>}
        <form className="form" onSubmit={createRequest}>
          <label>Select your swappable slot</label>
          <select required value={chosenMyId} onChange={(e)=>setChosenMyId(e.target.value)}>
            <option value="" disabled>Choose one</option>
            {mySwappable.map((e)=> (
              <option key={e._id} value={e._id}>{e.title} ({new Date(e.startTime).toLocaleString()})</option>
            ))}
          </select>
          <button className="btn primary">Send Request</button>
        </form>
      </Modal>
    </div>
  );
}
