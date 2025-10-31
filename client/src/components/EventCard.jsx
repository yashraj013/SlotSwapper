import React from 'react';

export default function EventCard({ event, onToggleSwappable, onDelete }) {
  const start = new Date(event.startTime).toLocaleString();
  const end = new Date(event.endTime).toLocaleString();
  const swappable = event.status === 'SWAPPABLE';
  return (
    <div className="card">
      <div className="card-title">{event.title}</div>
      <div className="card-sub">{start} → {end}</div>
      <div className="row">
        <span className={`badge ${event.status.toLowerCase()}`}>{event.status}</span>
        <div className="spacer" />
        <button className="btn" onClick={() => onToggleSwappable(event)}>
          {swappable ? 'Mark Busy' : 'Make Swappable'}
        </button>
        <button className="btn danger" onClick={() => onDelete(event)}>Delete</button>
      </div>
    </div>
  );
}
