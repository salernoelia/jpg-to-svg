const fs = require("fs");
const path = require("path");
const potrace = require("potrace");
const Jimp = require("jimp"); // Import the Jimp module

function convertToSVG(bmpInputPath, outputSVGPath) {
  const params = {
    color: "#000000",
    background: "#FFFFFF",
    threshold: 120,
  };

  const trace = new potrace.Potrace(params);

  trace.loadImage(bmpInputPath, function (err) {
    if (err) {
      console.error(`Error loading BMP image ${bmpInputPath}: ${err}`);
      return;
    }

    const svg = trace.getSVG();

    fs.writeFileSync(outputSVGPath, svg);

    console.log(`Converted ${bmpInputPath} to SVG and saved as ${outputSVGPath}`);
  });
}

function convertToBMP(inputJPGPath, outputBMPPath) {
  Jimp.read(inputJPGPath)
    .then((image) => {
      return image
        .quality(100) // Set the quality to 100%
        .writeAsync(outputBMPPath); // Write the BMP file
    })
    .then(() => {
      console.log(`Converted ${inputJPGPath} to BMP and saved as ${outputBMPPath}`);

      // After converting to BMP, start converting to SVG
      const outputSVGPath = path.join(
        "./svg",
        path.basename(outputBMPPath, ".bmp") + ".svg"
      );
      convertToSVG(outputBMPPath, outputSVGPath);
    })
    .catch((conversionError) => {
      console.error(`Error converting ${inputJPGPath} to BMP: ${conversionError}`);
    });
}

function convertBitmap() {
  const jpgInputFolder = "./jpg";
  const bmpOutputFolder = "./bitmap";
  const svgOutputFolder = "./svg";

  if (!fs.existsSync(bmpOutputFolder)) {
    fs.mkdirSync(bmpOutputFolder);
  }
  if (!fs.existsSync(svgOutputFolder)) {
    fs.mkdirSync(svgOutputFolder);
  }

  const jpgFiles = fs.readdirSync(jpgInputFolder);

  jpgFiles.forEach((file) => {
    if (path.extname(file).toLowerCase() === ".jpg" || path.extname(file).toLowerCase() === ".jpeg") {
      const inputPath = path.join(jpgInputFolder, file);
      const bmpOutputPath = path.join(bmpOutputFolder, path.basename(file, ".jpg") + ".bmp");
      const svgOutputPath = path.join(svgOutputFolder, path.basename(file, ".jpg") + ".svg");

      convertToBMP(inputPath, bmpOutputPath);
    }
  });
}

convertBitmap();
