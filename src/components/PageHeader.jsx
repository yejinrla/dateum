export default function PageHeader({ eyebrow, title, description, action, className = "" }) {
  return (
    <div className={`page-header ${className}`.trim()}>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
