export default function SummaryCard({ debts }) {
  const total = debts.filter(d => d.status === 'pending').reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const pending = debts.filter(d => d.status === 'pending').length;
  const paid = debts.filter(d => d.status === 'paid').length;

  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  
  return (
    <div className="card summary-card">
      <p>Total de Deuda</p>
      <div className="total">{formatter.format(total)}</div>
      
      <div className="stats-row">
        <div>
          <strong>{pending}</strong>
          <p>Pendientes</p>
        </div>
        <div>
          <strong>{paid}</strong>
          <p>Pagadas</p>
        </div>
      </div>
    </div>
  );
}
