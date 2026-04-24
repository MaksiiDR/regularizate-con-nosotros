export default function DebtList({ debts, onEdit, onDelete, onToggleStatus }) {
  const pending = debts.filter(d => d.status === 'pending');
  const paid = debts.filter(d => d.status === 'paid');

  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  if (debts.length === 0) {
    return (
      <div className="empty-state">
        <h2>Sin deudas 🎉</h2>
        <p>No tienes ninguna deuda registrada. ¡Agrega una para comenzar!</p>
      </div>
    );
  }

  const renderItem = (debt) => (
    <div key={debt.id} className="list-item" style={{flexDirection: 'column'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        <div className="item-left">
          <div className="item-title">{debt.name}</div>
          <div className="item-subtitle">{debt.description || 'Sin descripción'}</div>
        </div>
        <div className="item-right">
          <div className="item-amount text-primary-color">{formatter.format(Number(debt.amount))}</div>
        </div>
      </div>
      <div className="item-actions" style={{ width: '100%' }}>
        <button className="btn-action-text edit" onClick={() => onEdit(debt)}>Editar</button>
        <button 
          className="btn-action-text" 
          style={{color: debt.status === 'pending' ? 'var(--success-color)' : 'var(--text-secondary)'}} 
          onClick={() => onToggleStatus(debt.id)}
        >
          {debt.status === 'pending' ? 'Pagada' : 'Pendiente'}
        </button>
        <button className="btn-action-text delete" onClick={() => onDelete(debt.id)}>Eliminar</button>
      </div>
    </div>
  );

  return (
    <>
      {pending.length > 0 && (
        <div style={{marginBottom: '20px'}}>
          <h2>Pendientes</h2>
          <div className="list-group">
            {pending.map(renderItem)}
          </div>
        </div>
      )}
      {paid.length > 0 && (
        <div>
          <h2>Pagadas</h2>
          <div className="list-group">
            {paid.map(renderItem)}
          </div>
        </div>
      )}
    </>
  );
}
