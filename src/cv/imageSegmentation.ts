import { Debug } from "../debug";
import { MediaPipe } from "./mediapipe";
import { ImageSegmenterResult } from "@mediapipe/tasks-vision";

export class ImageSegmentation {

  private legendColors = [
    [255, 197, 0, 255], // Vivid Yellow
    [128, 62, 117, 255], // Strong Purple
    [255, 104, 0, 255], // Vivid Orange
    [166, 189, 215, 255], // Very Light Blue
    [193, 0, 32, 255], // Vivid Red
    [206, 162, 98, 255], // Grayish Yellow
    [129, 112, 102, 255], // Medium Gray
    [0, 125, 52, 255], // Vivid Green
    [246, 118, 142, 255], // Strong Purplish Pink
    [0, 83, 138, 255], // Strong Blue
    [255, 112, 92, 255], // Strong Yellowish Pink
    [83, 55, 112, 255], // Strong Violet
    [255, 142, 0, 255], // Vivid Orange Yellow
    [179, 40, 81, 255], // Strong Purplish Red
    [244, 200, 0, 255], // Vivid Greenish Yellow
    [127, 24, 13, 255], // Strong Reddish Brown
    [147, 170, 0, 255], // Vivid Yellowish Green
    [89, 51, 21, 255], // Deep Yellowish Brown
    [241, 58, 19, 255], // Vivid Reddish Orange
    [35, 44, 22, 255], // Dark Olive Green
    [0, 161, 194, 255] // Vivid Blue
  ];

  public async displaySegmentation(canvas: HTMLCanvasElement, result: ImageSegmenterResult) {
    Debug.write("Drawing segmentation mask");
    const ctx = canvas.getContext("2d");
    let imageData = ctx.getImageData(0, 0, 1024, 1024).data;
    const mask = result.categoryMask.getAsUint8Array();
    for (let i in mask) {
      if (mask[i] > 0) {
        //category = labels[mask[i]];
      }
      const legendColor = this.legendColors[mask[i] % this.legendColors.length];
      imageData[i * 4] = (legendColor[0] + imageData[i * 4]) / 2;
      imageData[i * 4 + 1] = (legendColor[1] + imageData[i * 4 + 1]) / 2;
      imageData[i * 4 + 2] = (legendColor[2] + imageData[i * 4 + 2]) / 2;
      imageData[i * 4 + 3] = (legendColor[3] + imageData[i * 4 + 3]) / 2;
    }
    const uint8Array = new Uint8ClampedArray(imageData.buffer);
    const dataNew = new ImageData(uint8Array, 1024, 1024);
    ctx.putImageData(dataNew, 0, 0);
  }

  public async segment(mp: MediaPipe, image: ImageData, model: ModelData) {
    Debug.write("Segment Image");
    return await mp.segment(image, model);
  }
}