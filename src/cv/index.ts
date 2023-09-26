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

  private drawBoxes (ctx, boxes) {
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
      const [x1, y1, width, height] = box.bounding;
  
      // draw border box
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(Math.min(512, 512) / 200, 2.5);

      ctx.strokeRect(x1*2*0.8, y1*2*0.8, width*2*0.8, height*2*0.8);
      console.log(10, 10, 502, 502);
      //ctx.strokeRect(10*2, 10*2, 502*2, 502*2);
      
  
      // // draw the label background.
      // ctx.fillStyle = color;
      // const textWidth = ctx.measureText(klass + " - " + score + "%").width;
      // const textHeight = parseInt(font, 10); // base 10
      // const yText = y1 - (textHeight + ctx.lineWidth);
      // ctx.fillRect(
      //   x1 - 1,
      //   yText < 0 ? 0 : yText,
      //   textWidth + ctx.lineWidth,
      //   textHeight + ctx.lineWidth
      // );
  
      // // Draw labels
      // ctx.fillStyle = "#ffffff";
      // ctx.fillText(klass + " - " + score + "%", x1 - 1, yText < 0 ? 1 : yText + 1);
    });
  }

  public async detectObjects(mat: any) {
    console.log("Loading yolov8 models and labels");
    const yolov8ModelFile = await fetch(`/models/yolov8-seg-onnxruntime-web/yolov8n-seg.onnx`);
    const yolov8Model = await yolov8ModelFile.arrayBuffer();
    const yolov8Session = await InferenceSession.create(yolov8Model);

    const yolov8NmsModelFile = await fetch(`/models/yolov8-seg-onnxruntime-web/nms-yolov8.onnx`);
    const yolov8NmsModel = await yolov8NmsModelFile.arrayBuffer();
    const yolov8NmsSession = await InferenceSession.create(yolov8NmsModel);

    const labelsFile = await fetch(`/models/yolov8-seg-onnxruntime-web/labels.json`);
    const labels = await labelsFile.json();

    console.log("Preprocessing image");
    let [input, xRatio, yRatio] = this.preprocess(mat, 640, 640);

    const modelInputShape = [1, 3, 640, 640];
    const topk = 100;
    const iouThreshold = 0.45;
    const scoreThreshold = 0.25;

    const tensor = new Tensor("float32", input.data32F, modelInputShape); // to ort.Tensor
    const config = new Tensor(
      "float32",
      new Float32Array([
        labels.length, // num class
        topk, // topk per class
        iouThreshold, // iou threshold
        scoreThreshold, // score threshold
      ])
    ); // nms config tensor

    console.log("Running yolov8 model");
    const { output0, output1 } = await yolov8Session.run({ images: tensor });
    console.log(output0, output1);

    console.log("Running yolov8 nms model");
    const { selected } = await yolov8NmsSession.run({ detection: output0, config: config });
    console.log(selected);

    const boxes = [];
    const maxSize = Math.max(640, 640); // max size in input model

    const overflowBoxes = (box, maxSize) => {
      box[0] = box[0] >= 0 ? box[0] : 0;
      box[1] = box[1] >= 0 ? box[1] : 0;
      box[2] = box[0] + box[2] <= maxSize ? box[2] : maxSize - box[0];
      box[3] = box[1] + box[3] <= maxSize ? box[3] : maxSize - box[1];
      return box;
    };

    for (let idx = 0; idx < selected.dims[1]; idx++) {
      const data = selected.data.slice(idx * selected.dims[2], (idx + 1) * selected.dims[2]); // get rows
      let box = data.slice(0, 4); // det boxes
      const scores = data.slice(4, 4 + labels.length); // det classes probability scores
      const score = Math.max(...scores); // maximum probability scores
      const label = scores.indexOf(score); // class id of maximum probability scores
  

  
      box = overflowBoxes(
        [
          box[0] - 0.5 * box[2], // before upscale x
          box[1] - 0.5 * box[3], // before upscale y
          box[2], // before upscale w
          box[3], // before upscale h
        ],
        maxSize
      ); // keep boxes in maxSize range
  
      const [x, y, w, h] = overflowBoxes(
        [
          Math.floor(box[0] * xRatio), // upscale left
          Math.floor(box[1] * yRatio), // upscale top
          Math.floor(box[2] * xRatio), // upscale width
          Math.floor(box[3] * yRatio), // upscale height
        ],
        maxSize
      ); // upscale boxes
  
      boxes.push({
        label: labels[label],
        probability: score,
        bounding: [x, y, w, h], // upscale box
      }); // update boxes to draw later

      console.log(labels[label])
      console.log(boxes)

      const ctx = document.getElementById("image-canvas").getContext("2d");
      //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.drawBoxes(ctx, boxes);
    }

    






    return ["test"];

  }

  public async displayMat(mat: any) {
    cv2.imshow("image-canvas", mat);
  }
}