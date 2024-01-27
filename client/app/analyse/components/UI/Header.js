import Image from "next/image";
import classes from "./Header.module.css";

export default function Header() {
  return (
    <>
      <div className={classes.container}>
        <div className={classes.headerContainer}>
          <h1 className={classes.header}>Analizowanie DNA & Python & NextJS</h1>
          <p className={classes.text}>
            Analizator DNA to prosty interaktywny interfejs, który umożliwia
            użytkownikom badanie sekwencji DNA. Wprowadź sekwencję, a analizator
            dostarczy informacji, takich jak komplementarna sekwencja, długość,
            zawartość GC i sekwencja białkowa. To przyjazne narzędzie, idealne
            do szybkiego zrozumienia podstawowych cech sekwencji DNA bez
            konieczności zaawansowanej wiedzy biologicznej.
          </p>
        </div>
        <div className={classes.imageContainer}>
          <Image
            src={"/dnav.jpeg"}
            width={100}
            height={100}
            layout="responsive"
          />
        </div>
      </div>
    </>
  );
}
