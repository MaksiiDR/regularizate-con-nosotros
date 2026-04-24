import { useState, useEffect } from 'react';
import SummaryCard from './components/SummaryCard';
import DebtList from './components/DebtList';
import DebtForm from './components/DebtForm';
import { supabase } from './supabaseClient';

function App() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [debtToDelete, setDebtToDelete] = useState(null);

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setDebts(data);
    } catch (error) {
      console.error('Error fetching debts:', error.message);
      // Fallback for demonstration if Supabase is not configured yet
      const localDebts = localStorage.getItem('debts');
      if (localDebts) setDebts(JSON.parse(localDebts));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDebt = async (debtData) => {
    try {
      if (editingDebt && editingDebt.id) {
        // Update existing debt
        const { error } = await supabase
          .from('debts')
          .update({
            name: debtData.name,
            amount: debtData.amount,
            description: debtData.description,
            status: debtData.status
          })
          .eq('id', editingDebt.id);

        if (error) throw error;
        setDebts(debts.map(d => d.id === editingDebt.id ? { ...d, ...debtData } : d));
      } else {
        // Insert new debt
        // Remove locally generated string ID so Supabase can generate UUID/serial
        const { id, ...newDebtData } = debtData;

        const { data, error } = await supabase
          .from('debts')
          .insert([newDebtData])
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          setDebts([data[0], ...debts]);
        }
      }
    } catch (error) {
      console.error('Error saving debt:', error.message);
      alert('Error al guardar. Si no configuraste Supabase, guarda en config / local.');
      // Local storage fallback logic
      const savedData = editingDebt
        ? debts.map(d => d.id === debtData.id ? debtData : d)
        : [{ ...debtData, id: Date.now().toString() }, ...debts];
      setDebts(savedData);
      localStorage.setItem('debts', JSON.stringify(savedData));
    } finally {
      setShowForm(false);
      setEditingDebt(null);
    }
  };

  const requestDeleteDebt = (id) => {
    setDebtToDelete(id);
  };

  const confirmDeleteDebt = async () => {
    const id = debtToDelete;
    if (!id) return;

    try {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDebts(debts.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting debt:', error.message);
      // Fallback
      const newDebts = debts.filter(d => d.id !== id);
      setDebts(newDebts);
      localStorage.setItem('debts', JSON.stringify(newDebts));
    } finally {
      setDebtToDelete(null);
    }
  };

  const handleEditDebt = (debt) => {
    setEditingDebt(debt);
    setShowForm(true);
  };

  const handleToggleStatus = async (id) => {
    const debtToUpdate = debts.find(d => d.id === id);
    if (!debtToUpdate) return;

    const newStatus = debtToUpdate.status === 'pending' ? 'paid' : 'pending';

    try {
      const { error } = await supabase
        .from('debts')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setDebts(debts.map(d => d.id === id ? { ...d, status: newStatus } : d));
    } catch (error) {
      console.error('Error updating status:', error.message);
      // Fallback
      const newDebts = debts.map(d => d.id === id ? { ...d, status: newStatus } : d);
      setDebts(newDebts);
      localStorage.setItem('debts', JSON.stringify(newDebts));
    }
  };

  return (
    <>
      <div className="app-header">
        <h1 style={{ marginBottom: 0 }}>Regularizate Con Nosotros</h1>
      </div>

      <div className="container" style={{ paddingBottom: '100px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>Cargando...</p>
        ) : (
          <>
            <SummaryCard debts={debts} />
            <DebtList
              debts={debts}
              onEdit={handleEditDebt}
              onDelete={requestDeleteDebt}
              onToggleStatus={handleToggleStatus}
            />
          </>
        )}
      </div>

      {!showForm && (
        <div className="fab">
          <button className="btn btn-primary" onClick={() => {
            setEditingDebt(null);
            setShowForm(true);
          }}>
            + Agregar Deuda
          </button>
        </div>
      )}

      {showForm && (
        <DebtForm
          debt={editingDebt}
          onSave={handleSaveDebt}
          onClose={() => {
            setShowForm(false);
            setEditingDebt(null);
          }}
        />
      )}

      {debtToDelete && (
        <div className="screen-overlay" style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '320px', textAlign: 'center', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>¿Eliminar deuda?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '15px' }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-danger" onClick={confirmDeleteDebt}>Eliminar</button>
              <button className="btn btn-primary" onClick={() => setDebtToDelete(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
