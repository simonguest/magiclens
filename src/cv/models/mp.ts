import { Debug } from "../../debug";

import { FilesetResolver, ObjectDetector, PoseLandmarker } from "@mediapipe/tasks-vision";

export class MP {

  public POSE_CONNECTIONS = PoseLandmarker.POSE_CONNECTIONS;

  private vision = null;
  private objectDetector = null;
  private poseLandmarker = null;

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
      this.poseLandmarker = await PoseLandmarker.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: `./models/PoseLandmarker/pose_landmarker_lite.task`,
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        numPoses: 2,
      });
      Debug.write("MediaPipe initialized");
      resolve("MediaPipe initialized");
    });
  }

  public async detectObjects(image: ImageData) {
    const detections = await this.objectDetector.detect(image);
    return detections;
  }

  public async detectPoses(image: ImageData) {
    const poses = await this.poseLandmarker.detect(image);
    return poses;
  }

}