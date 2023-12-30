import { Debug } from "../debug";

export class Samples {

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = function () {
        resolve(img);  // resolves with the image element
      };

      img.onerror = function () {
        reject(new Error(`Failed to load image's URL: ${url}`));
      };

      img.src = url;
    });
  }

  public async loadSampleImage(filename: string, width: number, height: number) {
    Debug.write(`Loading the ${filename} image`);
    const imageEl = await this.loadImage(`./images/${filename}`);
    Debug.write(`Image loaded`);
    const ctx = (document.getElementById("sample-image-canvas") as HTMLCanvasElement).getContext("2d");
    ctx.drawImage(imageEl, 0, 0);
    return ctx.getImageData(0, 0, width, height);
  }

}