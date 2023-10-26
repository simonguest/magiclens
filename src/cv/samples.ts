import { Debug } from "../debug";

export class Samples {

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      let img = new Image();

      img.onload = function () {
        resolve(img);  // resolves with the image element
      };

      img.onerror = function () {
        reject(new Error(`Failed to load image's URL: ${url}`));
      };

      img.src = url;
    });
  }

  public async loadSampleImage(filename: string) {
    Debug.write(`Loading the ${filename} image`);
    const imageEl = await this.loadImage(`./images/${filename}`);
    Debug.write(`Image loaded`);
    let ctx = (document.getElementById("sample-image-canvas") as HTMLCanvasElement).getContext("2d");
    ctx.drawImage(imageEl, 0, 0);
    return ctx.getImageData(0, 0, 1024, 1024);
  }

}