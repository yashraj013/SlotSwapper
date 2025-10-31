import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import Modal from '../components/Modal';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', startTime: '', endTime: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    const { data } = await api.get('/event/getEvents');
    setEvents(data);
  };

  useEffect(() => { fetchEvents(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/event/create', form);
      setOpen(false); setForm({ title: '', startTime: '', endTime: '' });
      await fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally { setLoading(false); }
  };

  const toggleSwappable = async (event) => {
    const next = event.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
    const { data } = await api.put(`/event/update/${event._id}`, { status: next });
    setEvents((prev) => prev.map((e) => (e._id === data._id ? data : e)));
  };

  const onDelete = async (event) => {
    await api.delete(`/event/delete/${event._id}`);
    setEvents((prev) => prev.filter((e) => e._id !== event._id));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Your Events</h2>
        <button className="btn primary" onClick={() => setOpen(true)}>Create Event</button>
      </div>

      <div className="grid">
        {events.map((ev) => (
          <EventCard key={ev._id} event={ev} onToggleSwappable={toggleSwappable} onDelete={onDelete} />
        ))}
        {events.length === 0 && <div className="muted">No events yet. Create one!</div>}
      </div>

      <Modal open={open} title="Create Event" onClose={() => setOpen(false)}>
        {error && <div className="error">{error}</div>}
        <form className="form" onSubmit={onCreate}>
          <input name="title" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required />
          <label>Start</label>
          <input type="datetime-local" value={form.startTime} onChange={(e)=>setForm({...form,startTime:e.target.value})} required />
          <label>End</label>
          <input type="datetime-local" value={form.endTime} onChange={(e)=>setForm({...form,endTime:e.target.value})} required />
          <button className="btn primary" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
        </form>
      </Modal>
    </div>
  );
}
