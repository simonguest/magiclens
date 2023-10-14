import { Debug } from "../debug";

import * as cv2 from "@techstark/opencv-js"

import { Webcam } from "./webcam";
import { MP } from "./models/mp";
export class CV {

  private DISPLAY_WAIT_TIME = 1; // ms to wait for image to be displayed before continuing

  private webcam = new Webcam();
  private mp = new MP();

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
      let ctx = document.getElementById("hidden-image-canvas").getContext("2d");
      ctx.drawImage(imageEl, 0, 0);
      resolve(ctx.getImageData(0, 0, 1024, 1024));
    });
  }

  // public convertMatToGray(mat: any) {
  //   let gray = new cv2.Mat();
  //   cv2.cvtColor(mat, gray, cv2.COLOR_RGBA2GRAY)
  //   return gray;
  // }

  // public rotateRight(mat: any) {
  //   let dst = new cv2.Mat();
  //   cv2.rotate(mat, dst, cv2.ROTATE_90_CLOCKWISE);
  //   return dst;
  // }

  // private drawSegments(ctx, mask_img) {
  //   Debug.write("Drawing segmentation mask");
  //   ctx.putImageData(mask_img, 0, 0); // put overlay to canvas
  // }

  public async startWebcam(deviceId: string) {
    await this.webcam.start(deviceId);
  }

  public async stopWebcam() {
    await this.webcam.stop();
  }

  public async captureWebcamImage() {
    return await this.webcam.captureImage();
  }

  private drawBoxes(ctx, detectionResult) {
    Debug.write("Drawing bounding boxes");

    detectionResult.detections.forEach((detection) => {
      const label = detection.categories[0].categoryName;
      const color = "#777777";
      const score = (detection.categories[0].score * 100).toFixed(1);
      console.log(detection);
      let { originX, originY, width, height } = detection.boundingBox;

      // draw border box
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.strokeRect(originX, originY, width, height);

      // draw the label background.
      ctx.fillStyle = color;
      ctx.font = "20px Arial";
      ctx.textBaseline = "top";
      const textWidth = ctx.measureText(label + " - " + score + "%").width;
      const textHeight = 18;
      const textY = originY - (textHeight + ctx.lineWidth);
      ctx.fillRect(
        originX - 1,
        textY < 0 ? 0 : textY,
        textWidth + ctx.lineWidth,
        textHeight + ctx.lineWidth
      );

      // // Draw labels
      ctx.fillStyle = "#ffffff";
      ctx.fillText(label + " - " + score + "%", originX - 1, textY < 0 ? 1 : textY + 1);
    });
  }

  public async displayBoundingBoxes(objects: any) {
    this.clearBoundingBoxes();
    const ctx = document.getElementById("bounding-box-canvas").getContext("2d");
    this.drawBoxes(ctx, objects);
    await this.wait(this.DISPLAY_WAIT_TIME); // Wait to allow the image to be displayed
  }

  public async detectObjects(mat: any) {
    let detections = this.mp.detectObjects(mat);
    return detections;
  }

  private wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  public async displayImage(image: ImageData) {
    Debug.write("Displaying image");
    // cv2.imshow("image-canvas", mat);
    const ctx = document.getElementById("image-canvas").getContext("2d");
    ctx.putImageData(image, 0, 0); // put overlay to canvas
    await this.wait(this.DISPLAY_WAIT_TIME); // Wait to allow the image to be displayed
  }

  public clearImage() {
    let imagemat = new cv2.Mat(1024, 1024, cv2.CV_8UC4, [0, 0, 0, 255]);
    cv2.imshow("image-canvas", imagemat);
  }

  public clearBoundingBoxes() {
    let boundingmat = new cv2.Mat(1024, 1024, cv2.CV_8UC4, [0, 0, 0, 0]);
    cv2.imshow("bounding-box-canvas", boundingmat);
  }

  public clearSegmentationMask() {
    let segmat = new cv2.Mat(1024, 1024, cv2.CV_8UC4, [0, 0, 0, 0]);
    cv2.imshow("segmentation-mask-canvas", segmat);
  }

  public clearCanvasCollection() {
    // Set up everything for run
    Debug.write("Clearing canvas collection");
    this.clearImage();
    this.clearBoundingBoxes();
    this.clearSegmentationMask();
  }

  // public async displaySegmentation(objects: any) {
  //   this.clearSegmentationMask();
  //   const ctx = document.getElementById("segmentation-mask-canvas").getContext("2d");
  //   this.drawSegments(ctx, objects.mask);
  //   await this.wait(this.DISPLAY_WAIT_TIME); // Wait to allow the image to be displayed
  // }

  public async init() {
    Debug.write("Initializing CV");
    Debug.write("Detecting Webcam devices");
    let devices = await navigator.mediaDevices.enumerateDevices();
    window["devices"] = devices.filter(device => device.kind === "videoinput");

    Debug.write("Initializing mediapipe")
    await this.mp.init();
  }
}