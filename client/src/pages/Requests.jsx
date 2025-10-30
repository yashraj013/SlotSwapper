import React, { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function Requests() {
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);

    const fetchData = async () => {
        // Assuming backend provides filtered lists; if not, this is a placeholder for demo purposes.
        // Reuse swap model endpoints; you might need to implement these on backend if missing.
        try {
            const res = await api.get('/event/getEvents');
            // Placeholder: frontends usually need dedicated endpoints. Leave minimal UI.
        } catch (_) {}
    };

    useEffect(() => { fetchData(); }, []);

    const respond = async (id, accept) => {
        await api.post(`/swap/respond/${id}`, { accept });
        fetchData();
    };

    return (
        <div className="container">
            <h2>Requests</h2>
            <div className="row" style={{ gap: 24, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <div className="card"><strong>Incoming</strong>
                        {incoming.length === 0 && <div style={{ color: 'var(--muted)', marginTop: 8 }}>No incoming requests</div>}
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <div className="card"><strong>Outgoing</strong>
                        {outgoing.length === 0 && <div style={{ color: 'var(--muted)', marginTop: 8 }}>No outgoing requests</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}



