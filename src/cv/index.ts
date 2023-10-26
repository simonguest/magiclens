import { Debug } from "../debug";

import { Webcam } from "./webcam";
import { MediaPipe } from "./mediapipe";
import { Samples } from "./samples";
import { ObjectDetection } from "./objectDetection";

import { ImageSegmenterResult, ObjectDetectorResult, PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { ImageSegmentation } from "./imageSegmentation";
import { PoseEstimation } from "./poseEstimation";
import { Transform } from "./transform";
import { Display } from "./display";

// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
export class CV {

  private DISPLAY_WAIT_TIME = 1; // ms to wait for image to be displayed before continuing

  private mp = new MediaPipe();
  private webcam = new Webcam();
  private samples = new Samples();
  private transform = new Transform();
  private objectDetection = new ObjectDetection();
  private imageSegmentation = new ImageSegmentation();
  private poseEstimation = new PoseEstimation();
  private display = new Display();

  /*************************
   Canvas Collection
   *************************/

  private imageCanvas = document.getElementById("image-canvas") as HTMLCanvasElement;
  private hiddenImageCanvas = document.getElementById("hidden-image-canvas") as HTMLCanvasElement;
  private boundingBoxCanvas = document.getElementById("bounding-box-canvas") as HTMLCanvasElement;
  private segmentationMaskCanvas = document.getElementById("segmentation-mask-canvas") as HTMLCanvasElement;
  private poseCanvas = document.getElementById("pose-canvas") as HTMLCanvasElement;

  /*************************
   Display Methods
   *************************/

  private wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  /*************************
   WebCam
   *************************/

  public async startWebcam(deviceId: string) {
    await this.webcam.start(deviceId, this.imageCanvas);
    this.clearCanvas(this.imageCanvas);
  }

  public async stopWebcam() {
    await this.webcam.stop();
  }

  public async captureWebcamImage() {
    return await this.webcam.captureImage();
  }

  /*************************
   Samples
   *************************/

  private loadSampleImage(filename: string) {
    return this.samples.loadSampleImage(filename);
  }

  /*************************
   Transform
   *************************/

  public addImageToFrame(image: ImageData) {
    return this.transform.addImageToFrame(this.hiddenImageCanvas, image);
  }

  // TODO: Need to convert these from prior OpenCV methods

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

  public async colorSegment(data: {result: ImageSegmenterResult, category: number}, rgb: number[]) {
    await this.imageSegmentation.colorSegment(this.segmentationMaskCanvas, data.result, data.category, rgb);
  }

  public async replaceSegmentWithImage(data: {result: ImageSegmenterResult, category:number}, image: ImageData, transparency: number) {
    await this.imageSegmentation.replaceSegmentWithImage(this.segmentationMaskCanvas, data.result, data.category, image, transparency);
  }

  /*************************
   Pose Detection
   *************************/

  public async detectPose(image: ImageData, model: ModelData) {
    return await this.poseEstimation.detectPose(this.mp, image, model);
  }

  public async drawPose(pose: PoseLandmarkerResult) {
    this.clearCanvas(this.poseCanvas);
    await this.poseEstimation.displayPose(this.poseCanvas, pose);
  }

  /*************************
   Other Display Methods
   *************************/

  public async displayFrame() {
    Debug.write("Display frame");
    this.clearCanvas(this.imageCanvas);
    await this.display.displayFrame(this.imageCanvas, this.hiddenImageCanvas, this.boundingBoxCanvas, this.segmentationMaskCanvas, this.poseCanvas);
    // Clear the hidden image canvas
    this.clearCanvas(this.hiddenImageCanvas);
    this.clearCanvas(this.boundingBoxCanvas);
    this.clearCanvas(this.segmentationMaskCanvas);
    this.clearCanvas(this.poseCanvas);
  }

  private clearCanvas(canvas: HTMLCanvasElement) {
    canvas.width = 1024;
    canvas.height = 1024;
  }

  public clearCanvasCollection() {
    Debug.write("Clearing canvas collection");
    this.clearCanvas(this.imageCanvas);
    this.clearCanvas(this.boundingBoxCanvas);
    this.clearCanvas(this.segmentationMaskCanvas);
    this.clearCanvas(this.poseCanvas);
  }

  public async init() {
    Debug.write("Initializing CV");
    Debug.write("Detecting Webcam devices");
    let devices = await navigator.mediaDevices.enumerateDevices();
    window["devices"] = devices.filter(device => device.kind === "videoinput");

    Debug.write("Initializing mediapipe")
    await this.mp.init();
  }
}