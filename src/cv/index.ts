import cv2 from "../../lib/opencv.js";
import { Tensor, InferenceSession } from "onnxruntime-web";

export class CV {
  constructor(initCallback) {
    cv2["onRuntimeInitialized"] = async () => {
      console.log("OpenCV.js is ready");
      console.log(cv2.getBuildInformation());
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
      console.log(`Loading the ${image} image`);
      const imageEl = await this.loadImage(`./images/${image}`);
      console.log('Image loaded');
      let mat = cv2.imread(imageEl);
      //console.log(mat);
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

  private divStride(stride, width, height) {
    if (width % stride !== 0) {
      if (width % stride >= stride / 2) width = (Math.floor(width / stride) + 1) * stride;
      else width = Math.floor(width / stride) * stride;
    }
    if (height % stride !== 0) {
      if (height % stride >= stride / 2) height = (Math.floor(height / stride) + 1) * stride;
      else height = Math.floor(height / stride) * stride;
    }
    return [width, height];
  }

  private preprocess(mat, modelWidth, modelHeight, stride = 32) {
    const matC3 = new cv2.Mat(mat.rows, mat.cols, cv2.CV_8UC3); // new image matrix
    cv2.cvtColor(mat, matC3, cv2.COLOR_RGBA2BGR); // RGBA to BGR

    const [w, h] = this.divStride(stride, matC3.cols, matC3.rows);
    cv2.resize(matC3, matC3, new cv2.Size(w, h));

    // padding image to [n x n] dim
    const maxSize = Math.max(matC3.rows, matC3.cols); // get max size from width and height
    const xPad = maxSize - matC3.cols, // set xPadding
      xRatio = maxSize / matC3.cols; // set xRatio
    const yPad = maxSize - matC3.rows, // set yPadding
      yRatio = maxSize / matC3.rows; // set yRatio
    const matPad = new cv2.Mat(); // new mat for padded image
    cv2.copyMakeBorder(matC3, matPad, 0, yPad, 0, xPad, cv2.BORDER_CONSTANT); // padding black

    const input = cv2.blobFromImage(
      matPad,
      1 / 255.0, // normalize
      new cv2.Size(modelWidth, modelHeight), // resize to model input size
      new cv2.Scalar(0, 0, 0),
      true, // swapRB
      false // crop
    ); // preprocessing image matrix

    // release mat opencv
    mat.delete();
    matC3.delete();
    matPad.delete();

    return [input, xRatio, yRatio];
  }

  public async detectObjects(mat: any) {
    console.log("Loading yolov8 models and labels");
    const yolov8ModelFile = await fetch(`/models/yolov8-seg-onnxruntime-web/yolov8n-seg.onnx`);
    const yolov8Model = await yolov8ModelFile.arrayBuffer();
    const yolov8Session = await InferenceSession.create(yolov8Model);

    const yolov8NmsModelFile = await fetch(`/models/yolov8-seg-onnxruntime-web/nms-yolov8.onnx`);
    const yolov8NmsModel = await yolov8NmsModelFile.arrayBuffer();
    const yolov8NmsSession = await InferenceSession.create(yolov8NmsModel);

    const labels = await fetch(`/models/yolov8-seg-onnxruntime-web/labels.json`);

    console.log("Preprocessing image");
    //const [input, xRatio, yRatio] = this.preprocess(mat, 416, 416);

    return ["test"];

  }

  public async displayMat(mat: any) {
    cv2.imshow("runAreaCanvas", mat);
  }
}