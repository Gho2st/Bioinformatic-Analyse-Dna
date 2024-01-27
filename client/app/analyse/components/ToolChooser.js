"use client";
import { useState } from "react";
import Image from "next/image";
import classes from "./ToolChooser.module.css";
import Button from "./UI/Button";
export default function ToolChooser({
  ChooseToolPDB,
  ChooseToolSequence,
  ChooseToolFasta,
}) {
  const [isTable, setIsTable] = useState(false);

  function tableToggler() {
    setIsTable(!isTable);
  }

  return (
    <div className={classes.container}>
      <div className={classes.toolContainer}>
        <div>
          <h2>Wybierz narzędzie!</h2>
        </div>
        <div className={classes.buttonContainer}>
          <Button text="Sequence Analyse" onClick={ChooseToolSequence} />
          <Button text="PDB Analyse" onClick={ChooseToolPDB} />
          <Button text="Fasta Analyse" onClick={ChooseToolFasta} />
          <Button text="Tabela aminokwasów" onClick={tableToggler} />
        </div>
      </div>
      {isTable && <div className={classes.table}> <Image src={"/aminoacids.png"} width={100} height={100} layout="responsive"></Image> </div>}
    </div>
  );
}
