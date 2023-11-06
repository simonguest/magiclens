import { Debug } from "../debug";
import { MediaPipe } from "./mediapipe";
import { ObjectDetectorResult } from "@mediapipe/tasks-vision";

export class ObjectDetection {

  private BOUNDING_BOX_COLOR : string = "#777777";
  private BOUNDING_BOX_FONT : string = "14px Arial";
  private BOUNDING_BOX_FONT_COLOR : string = "#ffffff";

  public async detectObjects(mediapipe: MediaPipe, image: ImageData, model: ModelData) {
    Debug.write("Detecting objects");
    return await mediapipe.detectObjects(image, model);
  }

  public async displayBoundingBoxes(canvas: HTMLCanvasElement, result: ObjectDetectorResult) {
    Debug.write("Displaying bounding boxes");
    let ctx = canvas.getContext("2d");
    result.detections.forEach((detection) => {
      const label = detection.categories[0].categoryName;
      const score = (detection.categories[0].score * 100).toFixed(1);
      let { originX, originY, width, height } = detection.boundingBox;

      // draw border box
      ctx.strokeStyle = this.BOUNDING_BOX_COLOR;
      ctx.lineWidth = 3;
      ctx.strokeRect(originX, originY, width, height);

      // draw the label background
      ctx.fillStyle = this.BOUNDING_BOX_COLOR;
      ctx.font = this.BOUNDING_BOX_FONT;
      ctx.textBaseline = "top";
      const textWidth = ctx.measureText(label + " - " + score + "%").width;
      const textHeight = 14;
      const textY = originY - (textHeight + ctx.lineWidth);
      ctx.fillRect(
        originX - 1,
        textY < 0 ? 0 : textY,
        textWidth + ctx.lineWidth,
        textHeight + ctx.lineWidth
      );
      ctx.fillStyle = this.BOUNDING_BOX_FONT_COLOR;
      ctx.fillText(label + " - " + score + "%", originX - 1, textY < 0 ? 1 : textY + 1);
    });
  }

  public objectContains(result: ObjectDetectorResult, label: string) {
    let contains = false;
    result.detections.forEach((detection) => {
      if (detection.categories[0].categoryName === label) {
        contains = true;
      }
    });
    return contains;
  }
}