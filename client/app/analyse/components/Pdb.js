"use client";
import Button from "./UI/Button";
import classes from "./Pdb.module.css";
import dynamic from "next/dynamic";
import { useRef } from "react";
import Molecule from "./Molecule";

export default function Pdb({
  handleFileChange,
  analysisResultsPDB,
  handlePdbUpload,
  pdbFileName,
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
            <h1>Analizuj dane z plikow PDB</h1>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdb"
              ref={fileInputRef}
              className={classes.input}
            />
            <Button text="Wybierz plik" onClick={handleButtonClick} />
            <Button text="Analyse PDB file!" onClick={handlePdbUpload} />
            <Button text="Reset!" onClick={handleReset} />
            <p>Wybrany plik: {pdbFileName ? pdbFileName : "brak"}</p>
          </div>
          {analysisResultsPDB && <p>Protein name: {analysisResultsPDB.name}</p>}
          {analysisResultsPDB && (
            <p>Protein resolution: {analysisResultsPDB.resolution}</p>
          )}
          {analysisResultsPDB && (
            <p>Chains number: {analysisResultsPDB.num_chains}</p>
          )}
          {analysisResultsPDB && (
            <p>num_residues: {analysisResultsPDB.num_residues}</p>
          )}
          {analysisResultsPDB && (
            <p>num_atoms: {analysisResultsPDB.num_atoms}</p>
          )}
          {analysisResultsPDB && (
            <p>first_chain_id: {analysisResultsPDB.first_chain_id}</p>
          )}
          {analysisResultsPDB && (
            <p>first_residue_name: {analysisResultsPDB.first_residue_name}</p>
          )}
          {/* <Molecule /> */}
        </div>
      </div>
    </>
  );
}
