import React, { useState } from "react";
import ToolsLayout from "../components/ToolsLayout";
import { PDFDocument, degrees } from "pdf-lib";

export default function Rotate() {
  const [pdfFile, setPdfFile] = useState(null);
  const [rotation, setRotation] = useState(90);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [rotatedUrl, setRotatedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRotatedUrl(null);
    }
  };

  const handleRotate = async () => {
    if (!pdfFile) return alert("Please upload a PDF first.");
    setIsProcessing(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotation) % 360));
      }

      const rotatedBytes = await pdfDoc.save();
      const blob = new Blob([rotatedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setRotatedUrl(url);
    } catch (err) {
      console.error("Rotation error:", err);
      alert("Rotation failed. Please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <ToolsLayout title="Rotate PDF" description="Rotate your PDF pages instantly.">
      <input type="file" accept="application/pdf" onChange={handleFileChange} className="block w-full text-sm text-gray-700" />

      {previewUrl && (
        <iframe src={previewUrl} title="PDF Preview" className="w-full h-64 border rounded-lg mt-4"></iframe>
      )}

      <div className="flex items-center justify-between mt-4">
        <label className="text-gray-600">Rotation (degrees)</label>
        <select
          value={rotation}
          onChange={(e) => setRotation(parseInt(e.target.value))}
          className="border border-gray-300 rounded-lg px-2 py-1 text-gray-700"
        >
          <option value={90}>90°</option>
          <option value={180}>180°</option>
          <option value={270}>270°</option>
        </select>
      </div>

      <button
        onClick={handleRotate}
        disabled={isProcessing}
        className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {isProcessing ? "Rotating..." : "Rotate PDF"}
      </button>

      {rotatedUrl && (
        <a
          href={rotatedUrl}
          download="rotated.pdf"
          className="block w-full mt-4 text-center bg-gray-100 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
        >
          Download Rotated PDF
        </a>
      )}
    </ToolsLayout>
  );
}
