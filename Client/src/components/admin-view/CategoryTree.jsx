// File: src/components/admin-view/CategoryTree.jsx
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function CategoryTree({ tree }) {
  return (
    <ul className="pl-2">
      {tree.map((node) => (
        <TreeNode key={node._id} node={node} />
      ))}
    </ul>
  );
}

function TreeNode({ node }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <li className="mb-1">
      <div
        className="flex items-center cursor-pointer select-none"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {node.children?.length > 0 && (
          <span className="mr-1">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        <span className="text-sm font-medium">{node.name}</span>
      </div>

      {expanded && node.children?.length > 0 && (
        <ul className="pl-4 border-l ml-1 mt-1">
          {node.children.map((child) => (
            <TreeNode key={child._id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}
