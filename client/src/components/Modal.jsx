
import React from 'react';

export default function Modal({ open, onClose, title, children, footer }) {
    if (!open) return null;
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <button className="btn secondary" onClick={onClose}>Close</button>
                </div>
                <div style={{ marginTop: 12 }}>{children}</div>
                {footer && <div style={{ marginTop: 16 }} className="row">{footer}</div>}
            </div>
        </div>
    );
}



