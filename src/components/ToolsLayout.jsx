import React from "react";

export default function ToolsLayout({ title, description, children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-2 text-center">{title}</h1>
        <p className="text-gray-500 mb-6 text-center">{description}</p>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
