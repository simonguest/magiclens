import { Debug } from "../debug";

import { FilesetResolver, ObjectDetector, PoseLandmarker, ImageSegmenter } from "@mediapipe/tasks-vision";

export class MediaPipe {

  public static POSE_CONNECTIONS = PoseLandmarker.POSE_CONNECTIONS;

  private vision = null;

  private models = {};

  public async init() {
    return new Promise(async (resolve) => {
      this.vision = await FilesetResolver.forVisionTasks(
      );
      Debug.write("MediaPipe initialized");
      resolve("MediaPipe initialized");
    });
  }

  private getModel(path: string) {
    Debug.write(`Trying to load model ${path} from cache`);
    return this.models[path];
  }

  private cacheModel(path: string, model: any) {
    Debug.write(`Saving model ${path} to cache`);
    this.models[path] = model;
  }

  public async detectObjects(image: ImageData, model: ModelData) {
    let detector = this.getModel(model.path);
    if (!detector) {
      detector = await ObjectDetector.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: model.path,
          delegate: "GPU",
        },
        scoreThreshold: 0.5,
        runningMode: "IMAGE",
      });
      this.cacheModel(model.path, detector);
    }

    return detector.detect(image);
  }

  public async segment(image: ImageData, model: ModelData) {
    let segmenter = this.getModel(model.path);
    if (!segmenter) {
      segmenter = await ImageSegmenter.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: model.path,
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        outputCategoryMask: true,
        outputConfidenceMasks: false
      });
      this.cacheModel(model.path, segmenter);
    }

    return { result: segmenter.segment(image), category: model.category };
  }

  public async detectPose(image: ImageData, model: ModelData) {
    let poseLandmarker = this.getModel(model.path);
    if (!poseLandmarker) {
      poseLandmarker = await PoseLandmarker.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: model.path,
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        numPoses: 1,
      });
      this.cacheModel(model.path, poseLandmarker);
    }
    return poseLandmarker.detect(image);
  }

}