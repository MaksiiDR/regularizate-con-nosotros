import { useState, useEffect } from 'react';

export default function DebtForm({ debt, onSave, onClose }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (debt) {
      setName(debt.name);
      setAmount(debt.amount);
      setDescription(debt.description || '');
      setStatus(debt.status);
    }
  }, [debt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    
    onSave({
      id: debt ? debt.id : Date.now().toString(),
      name,
      amount: Number(amount),
      description,
      status
    });
  };

  return (
    <div className="screen-overlay">
      <div className="screen-header">
        <button className="btn-text" type="button" onClick={onClose}>Cancelar</button>
        <h2>{debt ? 'Editar Deuda' : 'Nueva Deuda'}</h2>
        <button className="btn-text" style={{fontWeight: 'bold'}} type="button" onClick={handleSubmit}>Guardar</button>
      </div>
      <div className="screen-content">
        <form id="debt-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">¿A quién o qué le debes?</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej. Tarjeta de Crédito, Juan" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Monto</label>
            <input 
              type="number" 
              className="form-control" 
              inputMode="numeric"
              placeholder="Ej. 5000" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción (opcional)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej. Cuota 1 de 3" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select 
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pendiente</option>
              <option value="paid">Pagada</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
}
