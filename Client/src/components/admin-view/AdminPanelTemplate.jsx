import { Fragment } from "react";

function AdminPanelTemplate({ title, columns, children, actions }) {
  return (
    <Fragment>
      {/* 🔥 Section Title + Action Button */}
      <div className="mb-5 flex items-center justify-between px-4 pt-6">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {actions}
      </div>

      {/* ✅ Table Layout */}
      <div className="border rounded-md overflow-auto w-full bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-white text-xs font-semibold text-muted-foreground">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`p-3 ${col.align === "right" ? "text-right" : ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default AdminPanelTemplate;
