import React from "react";
import classes from "./Sequence.module.css";
import Header from "./UI/Header";
import ImageSlider from "./ImageSlider";

export default function Sequence({
  dnaSequence,
  loading,
  handleAnalyzeDNA,
  handleReset,
  error,
  analysisResultsDNA,
  setDnaSequence,
}) {
  return (
    <>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div>
            <h2 className={classes.header}>
              Wpisz sekwencje, ktora chcesz analizowac!
            </h2>
            <textarea
              value={dnaSequence}
              onChange={(e) => setDnaSequence(e.target.value)}
            />
            <div className={classes.buttonContainer}>
              <button onClick={handleAnalyzeDNA} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze DNA"}
              </button>
              <button onClick={handleReset}>Reset</button>
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {analysisResultsDNA && (
            <div className={classes.resultsContainer}>
              <p>Odwrotna komplementarna nić: {analysisResultsDNA.reverse_complement}</p>
              <p>Komplementarna nić: {analysisResultsDNA.complement}</p>
              <p>Length: {analysisResultsDNA.length}</p>
              <p>AT Content: {analysisResultsDNA.at_content}</p>
              <p>GC Content: {analysisResultsDNA.gc_content}</p>
              <p>Protein Sequence: {analysisResultsDNA.protein_sequence}</p>
              <p>Isoelectric Point: {analysisResultsDNA.isoelectric_point}</p>
              <p>Molecular weight: {analysisResultsDNA.molecular_weight}</p>
              <p>Transcribt: {analysisResultsDNA.transcribt}</p>
              <p>Melting temp: {analysisResultsDNA.melting_temp}</p>
              <ImageSlider analysisResultsDNA={analysisResultsDNA} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
