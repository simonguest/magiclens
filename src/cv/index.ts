import {Debug} from "../debug";

import {Webcam} from "./webcam";
import {MP} from "./models/mp";
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


  private displayStartingWebCamImage() {
    const canvas = document.getElementById("image-canvas") as HTMLCanvasElement;
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.font = '28px sans-serif';           // You can adjust the size and font-family to your liking
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw the text in the center of the canvas
    ctx.fillText('Starting Webcam', canvas.width / 2, canvas.height / 2);
  }

  public async startWebcam(deviceId: string) {
    this.displayStartingWebCamImage();
    await this.webcam.start(deviceId);
    const canvas = document.getElementById("image-canvas") as HTMLCanvasElement;
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, 1024, 1024);
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
      let {originX, originY, width, height} = detection.boundingBox;

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
    Debug.write("Displaying bounding boxes");
    this.clearBoundingBoxes();
    const ctx = document.getElementById("bounding-box-canvas").getContext("2d");
    this.drawBoxes(ctx, objects);
    await this.wait(this.DISPLAY_WAIT_TIME); // Wait to allow the image to be displayed
  }

  public async detectObjects(image: ImageData, model: Model[]) {
    Debug.write("Detecting objects");
    let detections = this.mp.detectObjects(image, model[0]);
    return detections;
  }

  private drawPoses(ctx, data) {
    // Draw keypoints
    data.landmarks[0].forEach(point => {
      const x = point.x * 1024;
      const y = point.y * 1024;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    });

    // Draw connections
    this.mp.POSE_CONNECTIONS.forEach(conn => {
      const start = data.landmarks[0][conn.start];
      const end = data.landmarks[0][conn.end];

      ctx.beginPath();
      ctx.moveTo(start.x * 1024, start.y * 1024);
      ctx.lineTo(end.x * 1024, end.y * 1024);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  public async displayPose(poses: any) {
    Debug.write("Drawing poses");
    this.clearPoses();
    const ctx = (document.getElementById("pose-canvas") as HTMLCanvasElement).getContext("2d");
    this.drawPoses(ctx, poses);
    await this.wait(this.DISPLAY_WAIT_TIME); // Wait to allow the image to be displayed
  }

  public async detectPose(mat: ImageData) {
    Debug.write("Detecting poses");
    let poses = this.mp.detectPoses(mat);
    return poses;
  }

  private legendColors = [
    [255, 197, 0, 255], // Vivid Yellow
    [128, 62, 117, 255], // Strong Purple
    [255, 104, 0, 255], // Vivid Orange
    [166, 189, 215, 255], // Very Light Blue
    [193, 0, 32, 255], // Vivid Red
    [206, 162, 98, 255], // Grayish Yellow
    [129, 112, 102, 255], // Medium Gray
    [0, 125, 52, 255], // Vivid Green
    [246, 118, 142, 255], // Strong Purplish Pink
    [0, 83, 138, 255], // Strong Blue
    [255, 112, 92, 255], // Strong Yellowish Pink
    [83, 55, 112, 255], // Strong Violet
    [255, 142, 0, 255], // Vivid Orange Yellow
    [179, 40, 81, 255], // Strong Purplish Red
    [244, 200, 0, 255], // Vivid Greenish Yellow
    [127, 24, 13, 255], // Strong Reddish Brown
    [147, 170, 0, 255], // Vivid Yellowish Green
    [89, 51, 21, 255], // Deep Yellowish Brown
    [241, 58, 19, 255], // Vivid Reddish Orange
    [35, 44, 22, 255], // Dark Olive Green
    [0, 161, 194, 255] // Vivid Blue
  ];

  private drawSegments(ctx, result) {
    Debug.write("Drawing segmentation mask");
    let imageData = ctx.getImageData(0, 0, 1024, 1024).data;
    const mask = result.categoryMask.getAsUint8Array();
    for (let i in mask) {
      if (mask[i] > 0) {
        //category = labels[mask[i]];
      }
      const legendColor = this.legendColors[mask[i] % this.legendColors.length];
      imageData[i * 4] = (legendColor[0] + imageData[i * 4]) / 2;
      imageData[i * 4 + 1] = (legendColor[1] + imageData[i * 4 + 1]) / 2;
      imageData[i * 4 + 2] = (legendColor[2] + imageData[i * 4 + 2]) / 2;
      imageData[i * 4 + 3] = (legendColor[3] + imageData[i * 4 + 3]) / 2;
    }
    const uint8Array = new Uint8ClampedArray(imageData.buffer);
    const dataNew = new ImageData(uint8Array, 1024, 1024);
    ctx.putImageData(dataNew, 0, 0);
  }

  public async displaySegmentation(objects: any) {
    this.clearSegmentationMask();
    const ctx = document.getElementById("segmentation-mask-canvas").getContext("2d");
    this.drawSegments(ctx, objects);
    await this.wait(this.DISPLAY_WAIT_TIME); // Wait to allow the image to be displayed
  }

  public async segment(image: ImageData, model: Model) {
    Debug.write("Segment Image");
    let segmentation = await this.mp.segment(image, model[0]);
    return segmentation;
  }


  private wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  public async displayImage(image: ImageData) {
    Debug.write("Displaying image");
    const ctx = document.getElementById("image-canvas").getContext("2d");
    ctx.putImageData(image, 0, 0); // put overlay to canvas
    await this.wait(this.DISPLAY_WAIT_TIME); // Wait to allow the image to be displayed
  }

  public clearImage() {
    // Create a new ImageData of 1024 x 1024
    const canvas = document.getElementById("image-canvas") as HTMLCanvasElement;
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, 1024, 1024);
  }

  public clearBoundingBoxes() {
    const canvas = document.getElementById("bounding-box-canvas") as HTMLCanvasElement;
    canvas.width = 1024;
    canvas.height = 1024;
  }

  public clearSegmentationMask() {
    const canvas = document.getElementById("segmentation-mask-canvas") as HTMLCanvasElement;
    canvas.width = 1024;
    canvas.height = 1024;
  }

  public clearPoses() {
    const canvas = document.getElementById("pose-canvas") as HTMLCanvasElement;
    canvas.width = 1024;
    canvas.height = 1024;
  }

  public clearCanvasCollection() {
    // Set up everything for run
    Debug.write("Clearing canvas collection");
    this.clearImage();
    this.clearBoundingBoxes();
    this.clearSegmentationMask();
    this.clearPoses();
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