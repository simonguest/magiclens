import { Debug } from "../debug";

export class Filters {

  public convertToGrayscale(image: ImageData) {
    Debug.write("Invoking filter to convert to grayscale");
    let data = image.data;
    let length = data.length;
    for (let i = 0; i < length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      data[i] = data[i + 1] = data[i + 2] = v;
    }
    return image;
  }

  public rotateRight(image: ImageData) {
    Debug.write("Invoking filter to rotate image right");
    let width = image.width;
    let height = image.height;
    let data = image.data;
    let length = data.length;
    let result = new ImageData(height, width);
    let resultData = result.data;
    for (let i = 0; i < length; i += 4) {
      let x = Math.floor(i / 4) % width;
      let y = Math.floor(i / 4 / width);
      let newX = height - y - 1;
      let newIndex = (x * height + newX) * 4;
      resultData[newIndex] = data[i];
      resultData[newIndex + 1] = data[i + 1];
      resultData[newIndex + 2] = data[i + 2];
      resultData[newIndex + 3] = data[i + 3];
    }
    return result;
  }

}