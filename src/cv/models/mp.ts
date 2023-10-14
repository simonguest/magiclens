import { Debug } from "../../debug";

import { FilesetResolver, ObjectDetector, ObjectDetectorResult } from "@mediapipe/tasks-vision";

export class MP {

  private vision = null;
  private objectDetector = null;

  public async init() {
    return new Promise(async (resolve, reject) => {
      this.vision = await FilesetResolver.forVisionTasks(
      );
      this.objectDetector = await ObjectDetector.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: `./models/EfficientDet-Lite0/efficientdet_lite0.tflite`,
          delegate: "GPU",
        },
        scoreThreshold: 0.5,
        runningMode: "IMAGE",
      });
      Debug.write("MediaPipe initialized");
      resolve("MediaPipe initialized");
    });
  }

  public async detectObjects(image: ImageData) {
    const detections = await this.objectDetector.detect(image);
    return detections;
  }

}