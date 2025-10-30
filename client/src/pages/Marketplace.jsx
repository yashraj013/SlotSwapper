import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import EventCard from '../components/EventCard.jsx';
import Modal from '../components/Modal.jsx';

export default function Marketplace() {
    const [slots, setSlots] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [selected, setSelected] = useState(null);
    const [offerId, setOfferId] = useState('');

    const fetchData = async () => {
        const [swappable, my] = await Promise.all([
            api.get('/swap/slots'),
            api.get('/event/getEvents'),
        ]);
        setSlots(swappable.data || []);
        setMyEvents((my.data || []).filter((e) => e.status === 'SWAPPABLE'));
    };

    useEffect(() => { fetchData(); }, []);

    const requestSwap = async () => {
        await api.post('/swap/request', { mySlotId: offerId, theirSlotId: selected._id });
        setSelected(null); setOfferId('');
    };

    return (
        <div className="container">
            <h2>Marketplace</h2>
            <div className="grid">
                {slots.map((ev) => (
                    <EventCard key={ev._id} event={ev}>
                        <button className="btn" onClick={() => setSelected(ev)}>Request Swap</button>
                    </EventCard>
                ))}
            </div>

            <Modal open={!!selected} onClose={() => setSelected(null)} title="Offer your slot" footer={
                <>
                    <button className="btn secondary" onClick={() => setSelected(null)}>Cancel</button>
                    <button className="btn" disabled={!offerId} onClick={requestSwap}>Send Request</button>
                </>
            }>
                <div className="row" style={{ flexDirection: 'column', gap: 12 }}>
                    <select className="input" value={offerId} onChange={(e) => setOfferId(e.target.value)}>
                        <option value="">Select your swappable slot</option>
                        {myEvents.map((e) => (
                            <option key={e._id} value={e._id}>{e.title} ({new Date(e.startTime).toLocaleString()})</option>
                        ))}
                    </select>
                </div>
            </Modal>
        </div>
    );
}



