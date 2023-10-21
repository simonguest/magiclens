import { Debug } from "../debug";
import { MediaPipe } from "./mediapipe";
import { ImageSegmenterResult } from "@mediapipe/tasks-vision";

export class ImageSegmentation {


  public async colorSegment(canvas: HTMLCanvasElement, result: ImageSegmenterResult, category: number, rgb: number[]) {
    Debug.write("Color segment");

    const ctx = canvas.getContext("2d");
    let imageDataObj = ctx.getImageData(0, 0, 1024, 1024);
    let imageData = imageDataObj.data;
    const mask = result.categoryMask.getAsUint8Array();
    const len = mask.length;

    for (let i = 0; i < len; i++) {
      if (mask[i] === category) {
        const idx = i * 4;
        imageData[idx] = rgb[0];
        imageData[idx + 1] = rgb[1];
        imageData[idx + 2] = rgb[2];
        imageData[idx + 3] = rgb[3];
      }
    }
    ctx.putImageData(imageDataObj, 0, 0);
    const uint8Array = new Uint8ClampedArray(imageData.buffer);
    const dataNew = new ImageData(uint8Array, 1024, 1024);
    ctx.putImageData(dataNew, 0, 0);
    Debug.write("Done color segment")
  }

  public async segment(mp: MediaPipe, image: ImageData, model: ModelData) {
    Debug.write("Segment Image");
    return await mp.segment(image, model);
  }
}