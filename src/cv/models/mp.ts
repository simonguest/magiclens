import { Debug } from "../../debug";

import { FilesetResolver, ObjectDetector, PoseLandmarker, ImageSegmenter } from "@mediapipe/tasks-vision";

export class MP {

  public POSE_CONNECTIONS = PoseLandmarker.POSE_CONNECTIONS;

  private vision = null;
  private objectDetector: ObjectDetector = null;
  private objectDetectorModelAssetPath: string = null;
  private poseLandmarker = null;
  private imageSegmenter = null;

  public async init() {
    return new Promise(async (resolve, reject) => {
      this.vision = await FilesetResolver.forVisionTasks(
      );

      this.poseLandmarker = await PoseLandmarker.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: `./models/PoseLandmarker/pose_landmarker_lite.task`,
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        numPoses: 1,
      });
      this.imageSegmenter = await ImageSegmenter.createFromOptions(this.vision, {
        baseOptions: {
          //modelAssetPath: './models/DeepLabv3/deeplabv3.tflite',
          modelAssetPath: './models/SelfieSegmenter/selfie_segmenter.tflite',
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        outputCategoryMask: true,
        outputConfidenceMasks: false
      });
      Debug.write("MediaPipe initialized");
      resolve("MediaPipe initialized");
    });

  }

  public async detectObjects(image: ImageData, model: Model) {
    if (this.objectDetectorModelAssetPath !== model.path) {
      this.objectDetector = null;
      this.objectDetectorModelAssetPath = model.path;
    }

    if (this.objectDetector === null){
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

  public async detectPoses(image: ImageData) {
    const poses = await this.poseLandmarker.detect(image);
    return poses;
  }

  public async detectSegmentation(image: ImageData) {
    const segmentation = await this.imageSegmenter.segment(image);
    return segmentation;
  }

}