import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import classes from "./ImageSlider.module.css";
import Image from "next/image";

export default function ImageSlider({ analysisResultsDNA }) {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...carouselSettings} className={classes.slickSlider}>
      <div>
        <Image
          src={`data:image/png;base64,${analysisResultsDNA.gc_plot}`}
          width={300}
          height={300}
          layout="responsive"
          alt="GC Content Pie Chart"
        />
      </div>
      <div>
        <Image
          src={`data:image/png;base64,${analysisResultsDNA.amino_acid_plot}`}
          width={300}
          height={300}
          layout="responsive"
          alt="Amino Acid Percentages Bar Chart"
        />
      </div>
      <div>
        <Image
          src={`data:image/png;base64,${analysisResultsDNA.dna_sequence_plot}`}
          width={300}
          height={300}
          layout="responsive"
          alt="Dna visualization"
        />
      </div>
      <div>
        <Image
          src={`data:image/png;base64,${analysisResultsDNA.protein_sequence_plot}`}
          width={300}
          height={300}
          layout="responsive"
          alt="Protein visualization"
        />
      </div>
    </Slider>
  );
}
