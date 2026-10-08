export default function AdminPageHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-h3">{title}</h1>
        {description && <p className="text-body mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
