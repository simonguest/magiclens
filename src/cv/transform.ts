import { Debug } from "../debug";

export class Transform {

  public addImageToFrame(canvas: HTMLCanvasElement, image: ImageData) {
    Debug.write("Add image to frame (hidden image canvas)");
    const ctx = canvas.getContext("2d");
    ctx.putImageData(image, 0, 0); // put overlay to canvas
  }

}