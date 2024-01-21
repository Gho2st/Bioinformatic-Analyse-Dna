"use client";
import { useState } from "react";
import Sequence from "./components/Sequence";
import Pdb from "./components/Pdb";
import Button from "./components/UI/Button";
import Header from "./components/UI/Header";
import classes from "./page.module.css";
import ToolChooser from "./components/ToolChooser";
import Footer from "./components/UI/Footer";
import Fasta from "./components/Fasta";

function DnaAnalyzer() {
  const [dnaSequence, setDnaSequence] = useState("");
  const [analysisResultsDNA, setAnalysisResultsDNA] = useState(null);
  const [analysisResultsPDB, setAnalysisResultsPDB] = useState(null);
  const [analysisResultsFasta, setAnalysisResultsFasta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdbFile, setPdbFile] = useState(null);
  const [fastaFile, setFastaFile] = useState(null);
  const [pdbFileName, setPdbFileName] = useState("");
  const [fastaFileName, setFastaFileName] = useState("");
  const [showSequence, setShowSequence] = useState(null);
  const [showPDB, setShowPDB] = useState(null);
  const [showFasta, setShowFasta] = useState(null);

  const handleAnalyzeDNA = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("dna_sequence", dnaSequence);

      const response = await fetch("http://127.0.0.1:8080/api/analyze_dna", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResultsDNA(data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("An error occurred during DNA analysis:", error.message);
      setError("An error occurred during DNA analysis. Please try again."); // Set error state
    } finally {
      setLoading(false);
    }
  };

  const handlePdbUpload = async () => {
    try {
      console.log("click");
      const formData = new FormData();
      formData.append("pdb_file", pdbFile);

      const response = await fetch("http://127.0.0.1:8080/api/pdb", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setAnalysisResultsPDB(data);
    } catch (error) {
      console.error("An error occurred during PDB file upload:", error.message);
    }
  };
  const handleFastaUpload = async () => {
    try {
      console.log("click");
      const formData = new FormData();
      formData.append("fasta_file", fastaFile);

      const response = await fetch("http://127.0.0.1:8080/api/fasta", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setAnalysisResultsFasta(data);
    } catch (error) {
      console.error("An error occurred during PDB file upload:", error.message);
    }
  };

  const handleReset = () => {
    setDnaSequence("");
    setAnalysisResultsDNA(null);
    setAnalysisResultsPDB(null);
    setAnalysisResultsFasta(null);
    setFastaFileName("");
    setFastaFile(null);
    setError(null);
    setPdbFileName("");
    setPdbFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPdbFile(file);
    const fileName = event.target.files[0].name;
    setPdbFileName(fileName);
  };

  const handleFileChangeFasta = (event) => {
    const file = event.target.files[0];
    setFastaFile(file); // Set the file object
    const fileName = file.name; // Get the file name from the file object
    setFastaFileName(fileName); // Set the file name
  };

  const ChooseToolSequence = () => {
    setShowSequence(!showSequence);
    setShowPDB(null);
    setShowFasta(null);
  };
  const ChooseToolPDB = () => {
    setShowPDB(!showPDB);
    setShowSequence(null);
    setShowFasta(null);
  };
  const ChooseToolFasta = () => {
    setShowFasta(!showFasta);
    setShowPDB(null);
    setShowSequence(null);
  };

  return (
    <>
      <Header />
      <ToolChooser
        ChooseToolPDB={ChooseToolPDB}
        ChooseToolSequence={ChooseToolSequence}
        ChooseToolFasta={ChooseToolFasta}
      />
      {showSequence && (
        <Sequence
          dnaSequence={dnaSequence}
          handleAnalyzeDNA={handleAnalyzeDNA}
          loading={loading}
          handleReset={handleReset}
          error={error}
          analysisResultsDNA={analysisResultsDNA}
          setDnaSequence={setDnaSequence}
          handleFileChange={handleFileChange}
        />
      )}
      {showPDB && (
        <Pdb
          handleFileChange={handleFileChange}
          analysisResultsPDB={analysisResultsPDB}
          handlePdbUpload={handlePdbUpload}
          pdbFileName={pdbFileName}
          handleReset={handleReset}
        />
      )}
      {showFasta && (
        <Fasta
          fastaFileName={fastaFileName}
          handleFileChangeFasta={handleFileChangeFasta}
          handleFastaUpload={handleFastaUpload}
          handleReset={handleReset}
          analysisResultsFasta={analysisResultsFasta}
        />
      )}
      <Footer />
    </>
  );
}

export default DnaAnalyzer;
