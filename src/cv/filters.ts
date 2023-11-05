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

  public rotateLeft(image: ImageData) {
    Debug.write("Invoking filter to rotate image left");
    let width = image.width;
    let height = image.height;
    let data = image.data;
    let length = data.length;
    let result = new ImageData(height, width);
    let resultData = result.data;
    for (let i = 0; i < length; i += 4) {
      let x = Math.floor(i / 4) % width;
      let y = Math.floor(i / 4 / width);
      let newY = width - x - 1;
      let newIndex = (newY * height + y) * 4;
      resultData[newIndex] = data[i];
      resultData[newIndex + 1] = data[i + 1];
      resultData[newIndex + 2] = data[i + 2];
      resultData[newIndex + 3] = data[i + 3];
    }
    return result;
  }

  public rotate180(image: ImageData) {
    Debug.write("Invoking filter to rotate image 180");
    let width = image.width;
    let height = image.height;
    let data = image.data;
    let length = data.length;
    let result = new ImageData(width, height);
    let resultData = result.data;
    for (let i = 0; i < length; i += 4) {
      let x = Math.floor(i / 4) % width;
      let y = Math.floor(i / 4 / width);
      let newX = width - x - 1;
      let newY = height - y - 1;
      let newIndex = (newY * width + newX) * 4;
      resultData[newIndex] = data[i];
      resultData[newIndex + 1] = data[i + 1];
      resultData[newIndex + 2] = data[i + 2];
      resultData[newIndex + 3] = data[i + 3];
    }
    return result;
  }

  public flipHorizontal(image: ImageData) {
    Debug.write("Invoking filter to flip image horizontally");
    let width = image.width;
    let height = image.height;
    let data = image.data;
    let length = data.length;
    let result = new ImageData(width, height);
    let resultData = result.data;
    for (let i = 0; i < length; i += 4) {
      let x = Math.floor(i / 4) % width;
      let y = Math.floor(i / 4 / width);
      let newX = width - x - 1;
      let newIndex = (y * width + newX) * 4;
      resultData[newIndex] = data[i];
      resultData[newIndex + 1] = data[i + 1];
      resultData[newIndex + 2] = data[i + 2];
      resultData[newIndex + 3] = data[i + 3];
    }
    return result;
  }

  public flipVertical(image: ImageData) {
    Debug.write("Invoking filter to flip image vertically");
    let width = image.width;
    let height = image.height;
    let data = image.data;
    let length = data.length;
    let result = new ImageData(width, height);
    let resultData = result.data;
    for (let i = 0; i < length; i += 4) {
      let x = Math.floor(i / 4) % width;
      let y = Math.floor(i / 4 / width);
      let newY = height - y - 1;
      let newIndex = (newY * width + x) * 4;
      resultData[newIndex] = data[i];
      resultData[newIndex + 1] = data[i + 1];
      resultData[newIndex + 2] = data[i + 2];
      resultData[newIndex + 3] = data[i + 3];
    }
    return result;
  }

  public invert(image: ImageData) {
    Debug.write("Invoking filter to invert image");
    let data = image.data;
    let length = data.length;
    for (let i = 0; i < length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    return image;
  }

  private createGaussianKernel(radius: number) {
    let size = radius * 2 + 1;
    let kernel = new Array(size);
    let sigma = radius / 3;
    let sum = 0;
    for (let i = 0; i < size; i++) {
      let x = i - radius;
      kernel[i] = Math.exp(-x * x / (2 * sigma * sigma));
      sum += kernel[i];
    }
    for (let i = 0; i < size; i++) {
      kernel[i] /= sum;
    }
    return kernel;
  }

  public blur(image: ImageData, radius: number) {
    Debug.write("Invoking filter to blur image");
    let width = image.width;
    let height = image.height;
    let data = image.data;
    let length = data.length;
    let result = new ImageData(width, height);
    let resultData = result.data;
    let kernel = this.createGaussianKernel(radius);
    let kernelSize = kernel.length;
    let kernelHalfSize = Math.floor(kernelSize / 2);
    for (let i = 0; i < length; i += 4) {
      let x = Math.floor(i / 4) % width;
      let y = Math.floor(i / 4 / width);
      let sum = 0;
      let r = 0;
      let g = 0;
      let b = 0;
      for (let j = 0; j < kernelSize; j++) {
        let k = j - kernelHalfSize;
        let pixelIndex = ((y + k) * width + x) * 4;
        if (pixelIndex < 0 || pixelIndex >= length) {
          continue;
        }
        r += data[pixelIndex] * kernel[j];
        g += data[pixelIndex + 1] * kernel[j];
        b += data[pixelIndex + 2] * kernel[j];
        sum += kernel[j];
      }
      resultData[i] = r / sum;
      resultData[i + 1] = g / sum;
      resultData[i + 2] = b / sum;
      resultData[i + 3] = data[i + 3];
    }
    return result;
  }

}