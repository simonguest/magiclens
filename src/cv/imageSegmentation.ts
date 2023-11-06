import { Debug } from "../debug";
import { MediaPipe } from "./mediapipe";
import { ImageSegmenterResult } from "@mediapipe/tasks-vision";

export class ImageSegmentation {

  public async colorSegment(canvas: HTMLCanvasElement, result: ImageSegmenterResult, category: number, rgb: number[], width: number, height: number) {
    Debug.write("Color segment");

    const ctx = canvas.getContext("2d");
    let imageDataObj = ctx.getImageData(0, 0, width, height);
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
    const dataNew = new ImageData(uint8Array, width, height);
    ctx.putImageData(dataNew, 0, 0);
    Debug.write("Done color segment")
  }

  public async replaceSegmentWithImage(canvas: HTMLCanvasElement, result: ImageSegmenterResult, category: number, image: ImageData, transparency: number, width: number, height: number) {
    Debug.write("Replace segment with image");

    // Get the image data for the current canvas
    const ctx = canvas.getContext("2d");
    let imageDataObj = ctx.getImageData(0, 0, width, height);
    let imageData = imageDataObj.data;
    const mask = result.categoryMask.getAsUint8Array();
    const len = mask.length;

    // Get the image data for the image to replace the segment with
    let replacementImageData = image.data;

    for (let i = 0; i < len; i++) {
      if (mask[i] === category) {
        const idx = i * 4;
        imageData[idx] = replacementImageData[idx];
        imageData[idx + 1] = replacementImageData[idx + 1];
        imageData[idx + 2] = replacementImageData[idx + 2];
        imageData[idx + 3] = transparency;
      }
    }
    ctx.putImageData(imageDataObj, 0, 0);
    const uint8Array = new Uint8ClampedArray(imageData.buffer);
    const dataNew = new ImageData(uint8Array, width, height);
    ctx.putImageData(dataNew, 0, 0);
    Debug.write("Done replace segment with image")

  }

  public async segment(mp: MediaPipe, image: ImageData, model: ModelData) {
    Debug.write("Segment Image");
    return await mp.segment(image, model);
  }
}