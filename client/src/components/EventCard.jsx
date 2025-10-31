import React from 'react';

export default function EventCard({ event, children, onToggleSwappable }) {
    return (
        <div className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontWeight: 600 }}>{event.title}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                        {new Date(event.startTime).toLocaleString()} → {new Date(event.endTime).toLocaleString()}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>Status: {event.status}</div>
                </div>
                {onToggleSwappable && (
                    <button className="btn secondary" onClick={() => onToggleSwappable(event)}>
                        {event.status === 'SWAPPABLE' ? 'Make Busy' : 'Make Swappable'}
                    </button>
                )}
            </div>
            {children && <div style={{ marginTop: 12 }}>{children}</div>}
        </div>
    );
}


