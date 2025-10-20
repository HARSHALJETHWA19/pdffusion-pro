import React, { useState } from "react";
import AdBanner from "../components/AdBanner";

import { PDFDocument } from "pdf-lib";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
// } from "@hello-pangea/dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Merge = () => {
  const [files, setFiles] = useState([]);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemove = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(files);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setFiles(reordered);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files.");
      return;
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => mergedPdf.addPage(p));
    }

    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "merged.pdf";
    link.click();
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Merge PDF</h1>

      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFiles}
        className="hidden"
        id="pdfUpload"
      />
      <label
        htmlFor="pdfUpload"
        className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
      >
        Upload PDFs
      </label>

      {files.length > 0 && (
        <div className="mt-8 flex flex-col items-center">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="pdf-list">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col space-y-3 w-80"
                >
                  {files.map((file, index) => (
                    <Draggable
                      key={file.name + index}
                      draggableId={file.name + index}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 rounded-md shadow-md border bg-white flex justify-between items-center transition 
                            ${snapshot.isDragging ? "bg-gray-100" : ""}`}
                        >
                          <span className="truncate max-w-[180px]">{file.name}</span>
                          <button
                            onClick={() => handleRemove(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

          <button
            onClick={handleMerge}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Merge PDFs
          </button>
        </div>
      )}

    <div className="merge-section">
        {/* your PDF merge code here */}
        <AdBanner />  {/* ✅ Works now */}
      </div>
    </div>
  );
};

export default Merge;
