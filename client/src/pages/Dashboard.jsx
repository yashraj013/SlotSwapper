import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import EventCard from '../components/EventCard.jsx';
import Modal from '../components/Modal.jsx';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const fetchEvents = async () => {
        const res = await api.get('/event/getEvents');
        setEvents(res.data || []);
    };

    useEffect(() => { fetchEvents(); }, []);

    const createEvent = async () => {
        await api.post('/event/create', { title, startTime, endTime });
        setOpen(false);
        setTitle(''); setStartTime(''); setEndTime('');
        fetchEvents();
    };

    const toggleSwappable = async (event) => {
        const status = event.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
        await api.put(`/event/update/${event._id}`, { status });
        fetchEvents();
    };

    return (
        <div className="container">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>My Events</h2>
                <button className="btn" onClick={() => setOpen(true)}>Create Event</button>
            </div>
            <div className="grid">
                {events.map((ev) => (
                    <EventCard key={ev._id} event={ev} onToggleSwappable={toggleSwappable} />
                ))}
            </div>

            <Modal open={open} onClose={() => setOpen(false)} title="Create Event" footer={
                <>
                    <button className="btn secondary" onClick={() => setOpen(false)}>Cancel</button>
                    <button className="btn" onClick={createEvent}>Create</button>
                </>
            }>
                <div className="row" style={{ flexDirection: 'column', gap: 12 }}>
                    <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input className="input" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    <input className="input" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
            </Modal>
        </div>
    );
}



