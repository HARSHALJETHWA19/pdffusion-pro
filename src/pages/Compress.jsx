import React, { useState } from "react";
import AdBanner from "../components/AdBanner";
import ToolsLayout from "../components/ToolsLayout";
import { PDFDocument } from "pdf-lib";

export default function Compress() {
  const [pdfFile, setPdfFile] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState(0.6);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
    setCompressedUrl(null);
  };

  const handleCompress = async () => {
    if (!pdfFile) return alert("Please upload a PDF first.");
    setIsProcessing(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Re-embed pages with reduced scale (pseudo compression)
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.scale(compressionLevel, compressionLevel);
        newPdf.addPage(page);
      });

      const compressedBytes = await newPdf.save({ useObjectStreams: true });
      const blob = new Blob([compressedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setCompressedUrl(url);
    } catch (error) {
      console.error("Compression failed:", error);
      alert("Compression failed. Please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <><ToolsLayout title="Compress PDF" description="Reduce PDF size efficiently.">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700" />

      <div className="flex items-center justify-between mt-4">
        <label className="text-gray-600">Compression Level</label>
        <input
          type="range"
          min="0.3"
          max="1"
          step="0.1"
          value={compressionLevel}
          onChange={(e) => setCompressionLevel(parseFloat(e.target.value))}
          className="w-1/2" />
        <span className="text-gray-700 text-sm">{compressionLevel}</span>
      </div>

      <button
        onClick={handleCompress}
        disabled={isProcessing}
        className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {isProcessing ? "Compressing..." : "Compress PDF"}
      </button>

      {compressedUrl && (
        <a
          href={compressedUrl}
          download="compressed.pdf"
          className="block w-full mt-4 text-center bg-gray-100 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
        >
          Download Compressed PDF
        </a>
      )}
    </ToolsLayout><div className="merge-section">
        {/* your PDF merge code here */}
        <AdBanner />  {/* ✅ Works now */}
      </div></>
    
  );
}
