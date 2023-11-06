import { Debug } from "../debug";

import { Webcam } from "./webcam";
import { MediaPipe } from "./mediapipe";
import { Samples } from "./samples";
import { ObjectDetection } from "./objectDetection";

import { ImageSegmenterResult, ObjectDetectorResult, PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { ImageSegmentation } from "./imageSegmentation";
import { PoseEstimation } from "./poseEstimation";
import { Filters } from "./filters";
import { Display } from "./display";

// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
export class CV {

  private DISPLAY_WAIT_TIME = 1; // ms to wait for image to be displayed before continuing

  private mp = new MediaPipe();
  private webcam = new Webcam();
  private samples = new Samples();
  private filters = new Filters();
  private objectDetection = new ObjectDetection();
  private imageSegmentation = new ImageSegmentation();
  private poseEstimation = new PoseEstimation();
  private display = new Display();

  private readonly width: number = 1024;
  private readonly height: number = 1024;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /*************************
   Canvas Collection
   *************************/

  private imageCanvas = document.getElementById("image-canvas") as HTMLCanvasElement;
  private hiddenImageCanvas = document.getElementById("hidden-image-canvas") as HTMLCanvasElement;
  private boundingBoxCanvas = document.getElementById("bounding-box-canvas") as HTMLCanvasElement;
  private segmentationMaskCanvas = document.getElementById("segmentation-mask-canvas") as HTMLCanvasElement;
  private poseCanvas = document.getElementById("pose-canvas") as HTMLCanvasElement;
  private userCanvas = document.getElementById("user-canvas") as HTMLCanvasElement;


  /*************************
   Display Methods
   *************************/

  private wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  /*************************
   WebCam
   *************************/

  public async startWebcam(deviceId: string) {
    try {
      await this.webcam.start(deviceId, this.imageCanvas, this.width, this.height);
    } catch (err) {
      Debug.write(err);
    }
    this.clearCanvas(this.imageCanvas);
  }

  public async stopWebcam() {
    await this.webcam.stop();
  }

  public async captureWebcamImage() {
    return await this.webcam.captureImage(this.width, this.height);
  }

  /*************************
   Samples
   *************************/

  private loadSampleImage(filename: string) {
    return this.samples.loadSampleImage(filename, this.width, this.height);
  }

  /*************************
   Filters
   *************************/

  public convertToGrayscale(image: ImageData) {
    return this.filters.convertToGrayscale(image);
  }

  public rotateRight(image: ImageData) {
    return this.filters.rotateRight(image);
  }

  public rotateLeft(image: ImageData) {
    return this.filters.rotateLeft(image);
  }

  public rotate180(image: ImageData) {
    return this.filters.rotate180(image);
  }

  public flipHorizontal(image: ImageData) {
    return this.filters.flipHorizontal(image);
  }

  public flipVertical(image: ImageData) {
    return this.filters.flipVertical(image);
  }

  public invert(image: ImageData) {
    return this.filters.invert(image);
  }

  public blur(image: ImageData, radius: number) {
    return this.filters.blur(image, radius);
  }

  /*************************
   Object Detection
   *************************/

  public async detectObjects(image: ImageData, model: ModelData) {
    return this.objectDetection.detectObjects(this.mp, image, model);
  }

  public async drawBoundingBoxes(result: ObjectDetectorResult) {
    await this.objectDetection.displayBoundingBoxes(this.boundingBoxCanvas, result);
  }

  public objectsContain(result: ObjectDetectorResult, label: string) {
    return this.objectDetection.objectContains(result, label);
  }

  /*************************
   Image Segmentation
   *************************/

  public async segment(image: ImageData, model: ModelData) {
    return this.imageSegmentation.segment(this.mp, image, model);
  }

  public async colorSegment(data: { result: ImageSegmenterResult, category: number }, rgb: number[]) {
    await this.imageSegmentation.colorSegment(this.segmentationMaskCanvas, data.result, data.category, rgb, this.width, this.height);
  }

  public async replaceSegmentWithImage(data: {
    result: ImageSegmenterResult,
    category: number
  }, image: ImageData, transparency: number) {
    await this.imageSegmentation.replaceSegmentWithImage(this.segmentationMaskCanvas, data.result, data.category, image, transparency, this.width, this.height);
  }

  /*************************
   Pose Detection
   *************************/

  public async detectPose(image: ImageData, model: ModelData) {
    return await this.poseEstimation.detectPose(this.mp, image, model);
  }

  public async drawPose(pose: PoseLandmarkerResult) {
    this.clearCanvas(this.poseCanvas);
    await this.poseEstimation.displayPose(this.poseCanvas, pose, this.width, this.height);
  }

  public getPositionOf(bodyPart: number, pose: PoseLandmarkerResult) {
    return this.poseEstimation.getPositionOf(bodyPart, pose, this.width, this.height);
  }

  /*************************
   Other Display Methods
   *************************/

  public addImageToFrame(image: ImageData) {
    return this.display.addImageToFrame(this.hiddenImageCanvas, image);
  }

  public async displayFrame() {
    // Check to see whether user has hit the stop button
    // noinspection TypeScriptUnresolvedReference
    if (window["cancelRequest"]) {
      throw "User canceled code execution"
    }
    Debug.write("Display frame");
    this.clearCanvas(this.imageCanvas);
    await this.display.displayFrame(this.imageCanvas, this.hiddenImageCanvas, this.boundingBoxCanvas, this.segmentationMaskCanvas, this.poseCanvas, this.userCanvas);
    // Clear the hidden image canvas
    this.clearCanvas(this.hiddenImageCanvas);
    this.clearCanvas(this.boundingBoxCanvas);
    this.clearCanvas(this.segmentationMaskCanvas);
    this.clearCanvas(this.poseCanvas);
    this.clearCanvas(this.userCanvas);
  }

  public drawTextAt(text: string, position: Position, font: string, size: number, color: string) {
    this.display.drawTextAt(this.userCanvas, text, position, font, size, color);
  }

  public drawEmojiAt(emoji: string, position: Position, size: number) {
    this.display.drawEmojiAt(this.userCanvas, emoji, position, size);
  }

  public inProximityOf(first: Position, second: Position, radius: number) {
    if (first === null) return;
    if (second === null) return;
    return Math.sqrt((second.x - first.x) ** 2 + (second.y - first.y) ** 2) <= radius;
  }

  private clearCanvas(canvas: HTMLCanvasElement) {
    canvas.width = this.width;
    canvas.height = this.height;
  }

  public clearCanvasCollection() {
    Debug.write("Clearing canvas collection");
    this.clearCanvas(this.imageCanvas);
    this.clearCanvas(this.boundingBoxCanvas);
    this.clearCanvas(this.segmentationMaskCanvas);
    this.clearCanvas(this.poseCanvas);
    this.clearCanvas(this.userCanvas);
  }

  public async init() {
    Debug.write("Initializing CV");
    Debug.write("Detecting Webcam devices");
    try {
      let currentStream = await navigator.mediaDevices.getUserMedia({ video: true });
      let devices = await navigator.mediaDevices.enumerateDevices();
      window["devices"] = devices.filter(device => device.kind === "videoinput");
      let tracks = currentStream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
    } catch (err) {
      Debug.write("Error detecting webcam devices: " + err);
    }

    Debug.write("Initializing mediapipe")
    await this.mp.init();
  }
}