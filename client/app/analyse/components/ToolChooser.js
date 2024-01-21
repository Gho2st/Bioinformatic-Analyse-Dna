import classes from "./ToolChooser.module.css";
import Button from "./UI/Button";
export default function ToolChooser({ ChooseToolPDB, ChooseToolSequence, ChooseToolFasta }) {
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
        </div>
      </div>
    </div>
  );
}
