import { Debug } from "../../debug";

import { FilesetResolver, ObjectDetector, PoseLandmarker, ImageSegmenter } from "@mediapipe/tasks-vision";

export class MP {

  public POSE_CONNECTIONS = PoseLandmarker.POSE_CONNECTIONS;

  private vision = null;

  private objectDetector: ObjectDetector = null;
  private objectDetectorModelAssetPath: string = null;

  private imageSegmenter: ImageSegmenter = null;
  private imageSegmenterModelAssetPath: string = null;

  private poseLandmarker = null;
  private poseLandmarkerModelAssetPath: string = null;

  public async init() {
    return new Promise(async (resolve, reject) => {
      this.vision = await FilesetResolver.forVisionTasks(
      );
      Debug.write("MediaPipe initialized");
      resolve("MediaPipe initialized");
    });

  }

  public async detectObjects(image: ImageData, model: Model) {
    if (this.objectDetectorModelAssetPath !== model.path) {
      this.objectDetector = null;
      this.objectDetectorModelAssetPath = model.path;
    }

    if (this.objectDetector === null) {
      this.objectDetector = await ObjectDetector.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: model.path,
          delegate: "GPU",
        },
        scoreThreshold: 0.5,
        runningMode: "IMAGE",
      });
    }

    const detections = await this.objectDetector.detect(image);
    return detections;
  }

  public async segment(image: ImageData, model: Model) {
    if (this.imageSegmenterModelAssetPath !== model.path) {
      this.imageSegmenter = null;
      this.imageSegmenterModelAssetPath = model.path;
    }

    if (this.imageSegmenter === null) {
      this.imageSegmenter = await ImageSegmenter.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: model.path,
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        outputCategoryMask: true,
        outputConfidenceMasks: false
      });
    }
    const segments = await this.imageSegmenter.segment(image);
    return segments;
  }

  public async detectPose(image: ImageData, model: Model) {
    if (this.poseLandmarkerModelAssetPath !== model.path) {
      this.poseLandmarker = null;
      this.poseLandmarkerModelAssetPath = model.path;
    }

    if (this.poseLandmarker === null) {
      this.poseLandmarker = await PoseLandmarker.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: model.path,
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        numPoses: 1,
      });
    }
    const pose = await this.poseLandmarker.detect(image);
    return pose;
  }


}