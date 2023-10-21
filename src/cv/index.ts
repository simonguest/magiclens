import { Debug } from "../debug";

import { Webcam } from "./webcam";
import { MediaPipe } from "./mediapipe";
import { Samples } from "./samples";
import { ObjectDetection } from "./objectDetection";

import { ImageSegmenterResult, ObjectDetectorResult, PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { ImageSegmentation } from "./imageSegmentation";
import { PoseEstimation } from "./poseEstimation";

// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
export class CV {

  private DISPLAY_WAIT_TIME = 1; // ms to wait for image to be displayed before continuing

  private mp = new MediaPipe();
  private webcam = new Webcam();
  private samples = new Samples();
  private objectDetection = new ObjectDetection();
  private imageSegmentation = new ImageSegmentation();
  private poseEstimation = new PoseEstimation();

  /*************************
   Canvas Collection
   *************************/

  private imageCanvas = document.getElementById("image-canvas") as HTMLCanvasElement;
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

  // TODO: Need to convert these from prior OpenCV methods

  /*************************
   Object Detection
   *************************/

  public async detectObjects(image: ImageData, model: ModelData) {
    return this.objectDetection.detectObjects(this.mp, image, model);
  }

  public async displayBoundingBoxes(result: ObjectDetectorResult) {
    this.clearCanvas(this.boundingBoxCanvas);
    await this.objectDetection.displayBoundingBoxes(this.boundingBoxCanvas, result);
    await this.wait(this.DISPLAY_WAIT_TIME);
  }

  /*************************
   Image Segmentation
   *************************/

  public async segment(image: ImageData, model: ModelData) {
    return this.imageSegmentation.segment(this.mp, image, model);
  }

  public async colorSegment(data: {result: ImageSegmenterResult, category: number}, rgb: number[]) {
    this.clearCanvas(this.segmentationMaskCanvas);
    await this.imageSegmentation.colorSegment(this.segmentationMaskCanvas, data.result, data.category, rgb);
    await this.wait(this.DISPLAY_WAIT_TIME);
  }

  public async replaceSegmentWithImage(data: {result: ImageSegmenterResult, category:number}, image: ImageData, transparency: number) {
    this.clearCanvas(this.segmentationMaskCanvas);
    await this.imageSegmentation.replaceSegmentWithImage(this.segmentationMaskCanvas, data.result, data.category, image, transparency);
    await this.wait(this.DISPLAY_WAIT_TIME);
  }

  /*************************
   Pose Detection
   *************************/

  public async detectPose(image: ImageData, model: ModelData) {
    return await this.poseEstimation.detectPose(this.mp, image, model);
  }

  public async displayPose(pose: PoseLandmarkerResult) {
    this.clearCanvas(this.poseCanvas);
    await this.poseEstimation.displayPose(this.poseCanvas, pose);
    await this.wait(this.DISPLAY_WAIT_TIME); // Wait to allow the image to be displayed
  }

  /*************************
   Other Display Methods
   *************************/

  public async displayImage(image: ImageData) {
    Debug.write("Displaying image");
    const ctx = this.imageCanvas.getContext("2d");
    ctx.putImageData(image, 0, 0); // put overlay to canvas
    await this.wait(this.DISPLAY_WAIT_TIME); // Wait to allow the image to be displayed
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