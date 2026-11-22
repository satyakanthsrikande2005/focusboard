function StatCard({ label, value, caption, icon: Icon, tone }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__top">
        <span className="stat-card__icon" aria-hidden="true">
          <Icon size={20} />
        </span>
        <h2 className="stat-card__label">{label}</h2>
      </div>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__caption">{caption}</p>
    </article>
  );
}

export default StatCard;
