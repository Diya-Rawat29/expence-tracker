import { useNotifications } from '../context/NotificationContext';
import { Bell, Trash2, CheckCheck } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const typeColors = { success: '#2EC4B6', error: '#FF4757', warning: '#FFCC00', info: '#6C63FF' };

export default function NotificationsPage() {
  const { notifications, markRead, markAll, deleteNotif } = useNotifications();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div><h1 className="page-title">Notifications</h1><p className="page-subtitle">{notifications.filter(n => !n.isRead).length} unread</p></div>
        {notifications.some(n => !n.isRead) && (
          <button className="btn btn-secondary btn-sm" onClick={markAll}><CheckCheck size={15} /> Mark All Read</button>
        )}
      </div>

      {notifications.length === 0
        ? <div className="card empty-state"><Bell size={40} /><p>No notifications yet.</p></div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map(n => (
            <div key={n.id} className="card" onClick={() => markRead(n.id)} style={{ cursor: 'pointer', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', opacity: n.isRead ? 0.6 : 1, borderLeft: `4px solid ${typeColors[n.type] || '#6C63FF'}` }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: n.isRead ? 'transparent' : typeColors[n.type], flexShrink: 0, border: n.isRead ? '2px solid var(--border)' : 'none' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: n.isRead ? 400 : 600, fontSize: '0.9rem' }}>{n.message}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{formatDate(n.createdAt)}</p>
              </div>
              <button className="btn-icon danger" onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>}
    </div>
  );
}
