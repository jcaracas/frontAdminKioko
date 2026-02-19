function MenuBadges({ a, b, c }) {
  return (
    <>
      {a && <span className="badge bg-primary me-1">A</span>}
      {b && <span className="badge bg-success me-1">B</span>}
      {c && <span className="badge bg-warning text-dark">C</span>}
      {!a && !b && !c && (
        <span className="text-muted">—</span>
      )}
    </>
  );
}
export default MenuBadges;