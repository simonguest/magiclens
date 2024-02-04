import { Debug } from "../debug";

import { FilesetResolver, ObjectDetector, PoseLandmarker, ImageSegmenter, FaceLandmarker } from "@mediapipe/tasks-vision";

export class MediaPipe {

  public static POSE_CONNECTIONS = PoseLandmarker.POSE_CONNECTIONS;
  public static FACE_CONNECTIONS = FaceLandmarker.FACE_LANDMARKS_CONTOURS

  private vision = null;

  private models = {};

  public async init() {
    return new Promise(async (resolve) => {
      this.vision = await FilesetResolver.forVisionTasks("."
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

  public async detectObjects(image: ImageData, model: ModelData, delegate, displayMessage: any, clearMessage: any) {
    let detector = this.getModel(`${model.path}_${delegate}`);
    if (!detector) {
      displayMessage("Loading model...");
      detector = await ObjectDetector.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: model.path,
          delegate: delegate,
        },
        scoreThreshold: 0.5,
        runningMode: "IMAGE",
      });
      this.cacheModel(`${model.path}_${delegate}`, detector);
      clearMessage();
    }

    return detector.detect(image);
  }

  public async segment(image: ImageData, model: ModelData, delegate: string, displayMessage: any, clearMessage: any) {
    if (delegate !== 'GPU' && delegate !== 'CPU') return;
    let segmenter = this.getModel(`${model.path}_${delegate}`);
    if (!segmenter) {
      displayMessage("Loading model...")
      segmenter = await ImageSegmenter.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: model.path,
          delegate: delegate,
        },
        runningMode: 'IMAGE',
        outputCategoryMask: true,
        outputConfidenceMasks: false
      });
      this.cacheModel(`${model.path}_${delegate}`, segmenter);
      clearMessage();
    }

    return { result: segmenter.segment(image), category: model.category };
  }

  public async detectPose(image: ImageData, model: ModelData, delegate: string, displayMessage: any, clearMessage: any) {
    if (delegate !== 'GPU' && delegate !== 'CPU') return;
    let poseLandmarker = this.getModel(`${model.path}_${delegate}`);
    if (!poseLandmarker) {
      displayMessage("Loading model...")
      poseLandmarker = await PoseLandmarker.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: model.path,
          delegate: delegate,
        },
        runningMode: 'IMAGE',
        numPoses: 1,
      });
      this.cacheModel(`${model.path}_${delegate}`, poseLandmarker);
      clearMessage();
    }
    return poseLandmarker.detect(image);
  }

  public async detectFace(image: ImageData, model: ModelData, delegate: string, displayMessage: any, clearMessage: any) {
    if (delegate !== 'GPU' && delegate !== 'CPU') return;
    let faceLandmarker = this.getModel(`${model.path}_${delegate}`);
    if (!faceLandmarker) {
      displayMessage("Loading model...")
      faceLandmarker = await FaceLandmarker.createFromOptions(this.vision, {
        baseOptions: {
          modelAssetPath: model.path,
          delegate: delegate,
        },
        runningMode: 'IMAGE',
        numFaces: 1,
        outputFaceBlendshapes: true
      });
      this.cacheModel(`${model.path}_${delegate}`, faceLandmarker);
      clearMessage();
    }
    return faceLandmarker.detect(image);
  }

}