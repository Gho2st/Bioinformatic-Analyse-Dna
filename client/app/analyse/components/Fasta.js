"use client";
import Button from "./UI/Button";
import classes from "./Pdb.module.css";
import { useRef } from "react";

export default function Fasta({
  handleFileChangeFasta,
  analysisResultsFasta,
  handleFastaUpload,
  fastaFileName,
  handleReset,
}) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className={classes.container}>
        <div>
          <div>
            <h1>Analizuj dane z plikow Fasta</h1>
            <input
              type="file"
              onChange={handleFileChangeFasta}
              accept=".fasta"
              ref={fileInputRef}
              className={classes.input}
            />
            <Button text="Wybierz plik" onClick={handleButtonClick} />
            <Button text="Analyse Fasta file!" onClick={handleFastaUpload} />
            <Button text="Reset!" onClick={handleReset} />
            <p>Wybrany plik: {fastaFileName ? fastaFileName : "brak"}</p>
          </div>
          {analysisResultsFasta && (
            <div>
              <h2>Summary:</h2>
              <p>Total Sequences: {analysisResultsFasta.summary.total_sequences}</p>
              <p>Average Length: {analysisResultsFasta.summary.average_length.toFixed(2)}</p>
              <p>
                Average GC Content:{" "}
                {analysisResultsFasta.summary.average_gc_content.toFixed(2)}%
              </p>
              <h2>Sequences:</h2>
          <ul>
            {analysisResultsFasta.sequences.map((sequence) => (
              <li key={sequence.name}>
                Name: {sequence.name}, Length: {sequence.length}, GC Content: {sequence.gc_content.toFixed(2)}%
              </li>
            ))}
          </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
