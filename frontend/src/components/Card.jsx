export default function Card({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      {title && <h3 className="text-base font-semibold mb-3">{title}</h3>}
      {children}
    </div>
  );
}
