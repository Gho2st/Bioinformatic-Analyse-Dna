"use client";
import Image from "next/image";
import Button from "./UI/Button";
import classes from "./Fasta.module.css";
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
            <p className={classes.selectedFile}>
              Wybrany plik: {fastaFileName ? fastaFileName : "brak"}
            </p>
          </div>
          {analysisResultsFasta && (
            <div className={classes.results}>
              {analysisResultsFasta.sequences.map((sequence) => (
                <>
                  <div className={classes.paragraphs}>
                    <p>Name: {sequence.name}</p>
                    <p className={classes.sequence}>
                      <span className={classes.span}>Protein Sequence:</span>{" "}
                      {sequence.sequence}
                    </p>
                    <p>Sequence length: {sequence.length}</p>
                    <p>Isoelectric point: {sequence.isoelectric_point}</p>
                    <p>Molecular weight: {sequence.molecular_weight}</p>
                    <p>GC content: {sequence.gc_content.toFixed(2)}%</p>
                  </div>
                  <Image
                    src={`data:image/png;base64,${sequence.amino_acid_plot}`}
                    width={300}
                    height={300}
                    layout="responsive"
                    alt="Amino Acid Percentages Bar Chart"
                  />
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
