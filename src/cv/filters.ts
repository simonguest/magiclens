import { Debug } from "../debug";

export class Filters {

  public convertToGrayscale(image: ImageData) {
    Debug.write("Invoking filter to convert to grayscale");
    const data = image.data;
    const length = data.length;
    for (let i = 0; i < length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      data[i] = data[i + 1] = data[i + 2] = v;
    }
    return image;
  }

  public rotateRight(image: ImageData) {
    Debug.write("Invoking filter to rotate image right");
    const width = image.width;
    const height = image.height;
    const data = image.data;
    const length = data.length;
    const result = new ImageData(height, width);
    const resultData = result.data;
    for (let i = 0; i < length; i += 4) {
      const x = Math.floor(i / 4) % width;
      const y = Math.floor(i / 4 / width);
      const newX = height - y - 1;
      const newIndex = (x * height + newX) * 4;
      resultData[newIndex] = data[i];
      resultData[newIndex + 1] = data[i + 1];
      resultData[newIndex + 2] = data[i + 2];
      resultData[newIndex + 3] = data[i + 3];
    }
    return result;
  }

  public rotateLeft(image: ImageData) {
    Debug.write("Invoking filter to rotate image left");
    const width = image.width;
    const height = image.height;
    const data = image.data;
    const length = data.length;
    const result = new ImageData(height, width);
    const resultData = result.data;
    for (let i = 0; i < length; i += 4) {
      const x = Math.floor(i / 4) % width;
      const y = Math.floor(i / 4 / width);
      const newY = width - x - 1;
      const newIndex = (newY * height + y) * 4;
      resultData[newIndex] = data[i];
      resultData[newIndex + 1] = data[i + 1];
      resultData[newIndex + 2] = data[i + 2];
      resultData[newIndex + 3] = data[i + 3];
    }
    return result;
  }

  public rotate180(image: ImageData) {
    Debug.write("Invoking filter to rotate image 180");
    const width = image.width;
    const height = image.height;
    const data = image.data;
    const length = data.length;
    const result = new ImageData(width, height);
    const resultData = result.data;
    for (let i = 0; i < length; i += 4) {
      const x = Math.floor(i / 4) % width;
      const y = Math.floor(i / 4 / width);
      const newX = width - x - 1;
      const newY = height - y - 1;
      const newIndex = (newY * width + newX) * 4;
      resultData[newIndex] = data[i];
      resultData[newIndex + 1] = data[i + 1];
      resultData[newIndex + 2] = data[i + 2];
      resultData[newIndex + 3] = data[i + 3];
    }
    return result;
  }

  public flipHorizontal(image: ImageData) {
    Debug.write("Invoking filter to flip image horizontally");
    const width = image.width;
    const height = image.height;
    const data = image.data;
    const length = data.length;
    const result = new ImageData(width, height);
    const resultData = result.data;
    for (let i = 0; i < length; i += 4) {
      const x = Math.floor(i / 4) % width;
      const y = Math.floor(i / 4 / width);
      const newX = width - x - 1;
      const newIndex = (y * width + newX) * 4;
      resultData[newIndex] = data[i];
      resultData[newIndex + 1] = data[i + 1];
      resultData[newIndex + 2] = data[i + 2];
      resultData[newIndex + 3] = data[i + 3];
    }
    return result;
  }

  public flipVertical(image: ImageData) {
    Debug.write("Invoking filter to flip image vertically");
    const width = image.width;
    const height = image.height;
    const data = image.data;
    const length = data.length;
    const result = new ImageData(width, height);
    const resultData = result.data;
    for (let i = 0; i < length; i += 4) {
      const x = Math.floor(i / 4) % width;
      const y = Math.floor(i / 4 / width);
      const newY = height - y - 1;
      const newIndex = (newY * width + x) * 4;
      resultData[newIndex] = data[i];
      resultData[newIndex + 1] = data[i + 1];
      resultData[newIndex + 2] = data[i + 2];
      resultData[newIndex + 3] = data[i + 3];
    }
    return result;
  }

  public invert(image: ImageData) {
    Debug.write("Invoking filter to invert image");
    const data = image.data;
    const length = data.length;
    for (let i = 0; i < length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    return image;
  }

  private createGaussianKernel(radius: number) {
    const size = radius * 2 + 1;
    const kernel = new Array(size);
    const sigma = radius / 3;
    let sum = 0;
    for (let i = 0; i < size; i++) {
      const x = i - radius;
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
    const width = image.width;
    const height = image.height;
    const data = image.data;
    const length = data.length;
    const result = new ImageData(width, height);
    const resultData = result.data;
    const kernel = this.createGaussianKernel(radius);
    const kernelSize = kernel.length;
    const kernelHalfSize = Math.floor(kernelSize / 2);
    for (let i = 0; i < length; i += 4) {
      const x = Math.floor(i / 4) % width;
      const y = Math.floor(i / 4 / width);
      let sum = 0;
      let r = 0;
      let g = 0;
      let b = 0;
      for (let j = 0; j < kernelSize; j++) {
        const k = j - kernelHalfSize;
        const pixelIndex = ((y + k) * width + x) * 4;
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