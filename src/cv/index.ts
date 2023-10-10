import { Debug } from "../debug";

import cv2 from "../../lib/opencv.js";

import { YoloV8 } from "./models/yolov8";
import { Webcam } from "./webcam";
export class CV {

  private yolov8 = new YoloV8();
  private webcam = new Webcam();

  constructor(initCallback) {
    cv2["onRuntimeInitialized"] = async () => {
      Debug.write("OpenCV.js is ready");
      Debug.write(cv2.getBuildInformation());

      // get all video input devices
      let devices = await navigator.mediaDevices.enumerateDevices();
      // iterate through every device and filter out non-cameras
      window["devices"] = devices.filter(device => device.kind === "videoinput");

      initCallback();
    };
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      let img = new Image();

      img.onload = function () {
        resolve(img);  // resolves with the image element
      };

      img.onerror = function () {
        reject(new Error(`Failed to load image's URL: ${url}`));
      };

      img.src = url;
    });
  }

  public async loadSampleImage(image: string) {
    return new Promise(async (resolve, reject) => {
      Debug.write(`Loading the ${image} image`);
      const imageEl = await this.loadImage(`./images/${image}`);
      Debug.write(`Image loaded`);
      let mat = cv2.imread(imageEl);
      resolve(mat);
    });
  }

  

  public convertMatToGray(mat: any) {
    let gray = new cv2.Mat();
    cv2.cvtColor(mat, gray, cv2.COLOR_RGBA2GRAY)
    return gray;
  }

  public rotateRight(mat: any) {
    let dst = new cv2.Mat();
    cv2.rotate(mat, dst, cv2.ROTATE_90_CLOCKWISE);
    return dst;
  }

  private drawSegments(ctx, mask_img) {
    Debug.write("Drawing segmentation mask");
    ctx.putImageData(mask_img, 0, 0); // put overlay to canvas
  }

  public async startWebcam(deviceId : string) {
    await this.webcam.start(deviceId);
  }

  public async stopWebcam() {
    await this.webcam.stop();
  }

  public async captureWebcamImage() {
    return await this.webcam.captureImage();
  } 




  private drawBoxes(ctx, boxes) {
    Debug.write("Drawing bounding boxes");
    // font configs
    const font = `${Math.max(
      Math.round(Math.max(ctx.canvas.width, ctx.canvas.height) / 40),
      14
    )}px Arial`;
    ctx.font = font;
    ctx.textBaseline = "top";

    boxes.forEach((box) => {
      const klass = box.label;
      const color = "#cccccc";
      const score = (box.probability * 100).toFixed(1);
      let [x1, y1, width, height] = box.bounding;

      // draw border box
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(Math.min(1024, 1024) / 200, 2.5);

      //ctx.strokeRect(x1*2*0.8, y1*2*0.8, width*2*0.8, height*2*0.8);
      ctx.strokeRect(x1, y1, width, height);


      // draw the label background.
      ctx.fillStyle = color;
      const textWidth = ctx.measureText(klass + " - " + score + "%").width;
      const textHeight = parseInt(font, 10); // base 10
      const yText = y1 - (textHeight + ctx.lineWidth);
      ctx.fillRect(
        x1 - 1,
        yText < 0 ? 0 : yText,
        textWidth + ctx.lineWidth,
        textHeight + ctx.lineWidth
      );

      // Draw labels
      ctx.fillStyle = "#ffffff";
      ctx.fillText(klass + " - " + score + "%", x1 - 1, yText < 0 ? 1 : yText + 1);
    });
  }


  public async detectObjects(mat: any) {
    return this.yolov8.detectObjects(mat);
  }

  private wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  public async displayImage(mat: any) {
    Debug.write("Displaying image");
    cv2.imshow("image-canvas", mat);
    await this.wait(1); // Wait for 1ms to allow the image to be displayed
  }

  public clearImage() {
    let imagemat = new cv2.Mat(1024, 1024, cv2.CV_8UC4, [0, 0, 0, 255]);
    cv2.imshow("image-canvas", imagemat);
  }

  public clearBoundingBoxes() {
    let boundingmat = new cv2.Mat(YoloV8.MODEL_WIDTH, YoloV8.MODEL_HEIGHT, cv2.CV_8UC4, [0, 0, 0, 0]);
    cv2.imshow("bounding-box-canvas", boundingmat);
  }

  public clearSegmentationMask() {
    let segmat = new cv2.Mat(YoloV8.MODEL_WIDTH, YoloV8.MODEL_HEIGHT, cv2.CV_8UC4, [0, 0, 0, 0]);
    cv2.imshow("segmentation-mask-canvas", segmat);
  }

  public async displayBoundingBoxes(objects: any) {
    this.clearBoundingBoxes();
    const ctx = document.getElementById("bounding-box-canvas").getContext("2d");
    this.drawBoxes(ctx, objects.boxes);
  }

  public async displaySegmentation(objects: any) {
    this.clearSegmentationMask();
    const ctx = document.getElementById("segmentation-mask-canvas").getContext("2d");
    this.drawSegments(ctx, objects.mask);
  }

  public init() {
    // Set up everything for run
    Debug.write("Initializing CV");
    this.clearImage();
    this.clearBoundingBoxes();
    this.clearSegmentationMask();
  }

}