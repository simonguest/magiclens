import { Debug } from "../../debug";

import cv2 from "../../../lib/opencv.js";
import { Tensor, InferenceSession } from "onnxruntime-web";
import { Colors } from "./colors";

const colors = new Colors();

export class YoloV8 {

  public static MODEL_WIDTH = 640;
  public static MODEL_HEIGHT = 640;

  private preprocess(mat, modelWidth, modelHeight) {
    Debug.write("Preprocessing image");
    const matC3 = new cv2.Mat(mat.rows, mat.cols, cv2.CV_8UC3); // new image matrix
    cv2.cvtColor(mat, matC3, cv2.COLOR_RGBA2BGR); // RGBA to BGR

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
    matC3.delete();
    matPad.delete();

    return [input, xRatio, yRatio];
  }

  public async segment(mat: cv2.Mat) {
    Debug.write("Loading yolov8 segmentation model");
    const modelFile = await fetch(`/models/yolov8-seg-onnxruntime-web/yolov8n-seg.onnx`);
    const model = await modelFile.arrayBuffer();
    const session = await InferenceSession.create(model);

    let [input, xRatio, yRatio] = this.preprocess(mat, YoloV8.MODEL_WIDTH, YoloV8.MODEL_HEIGHT);

    const modelInputShape = [1, 3, YoloV8.MODEL_WIDTH, YoloV8.MODEL_HEIGHT];

    const tensor = new Tensor("float32", input.data32F, modelInputShape); // to ort.Tensor

    Debug.write("Running yolov8 segmentation model");
    const { output0: detection, output1: mask } = await session.run({ images: tensor });
    return { detection: detection, mask: mask, xRatio: xRatio, yRatio: yRatio };
  }

  public async detectObjects(mat: any) {
    Debug.write("Loading yolov8 nms model");
    const yolov8NmsModelFile = await fetch(`/models/yolov8-seg-onnxruntime-web/nms-yolov8.onnx`);
    const yolov8NmsModel = await yolov8NmsModelFile.arrayBuffer();
    const yolov8NmsSession = await InferenceSession.create(yolov8NmsModel);

    Debug.write("Loading yolov8 segmentation model");
    const yolov8SegModelFile = await fetch(`/models/yolov8-seg-onnxruntime-web/mask-yolov8-seg.onnx`);
    const yolov8SegModel = await yolov8SegModelFile.arrayBuffer();
    const yolov8SegSession = await InferenceSession.create(yolov8SegModel);

    Debug.write("Loading yolov8 nms labels");
    const labelsFile = await fetch(`/models/yolov8-seg-onnxruntime-web/labels.json`);
    const labels = await labelsFile.json();

    const topk = 100;
    const iouThreshold = 0.45;
    const scoreThreshold = 0.25;

    const config = new Tensor(
      "float32",
      new Float32Array([
        labels.length, // num class
        topk, // topk per class
        iouThreshold, // iou threshold
        scoreThreshold, // score threshold
      ])
    ); // nms config tensor

    const seg = await this.segment(mat)

    const detection = seg.detection;
    const xRatio = seg.xRatio;
    const yRatio = seg.yRatio;


    Debug.write("Running yolov8 nms model");
    const { selected } = await yolov8NmsSession.run({ detection: detection, config: config });

    const boxes = [];
    let overlay = new Tensor("uint8", new Uint8Array(YoloV8.MODEL_WIDTH * YoloV8.MODEL_HEIGHT * 4), [
      YoloV8.MODEL_WIDTH, YoloV8.MODEL_HEIGHT,
      4,
    ]);
    const maxSize = Math.max(YoloV8.MODEL_WIDTH, YoloV8.MODEL_HEIGHT); // max size in input model

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
      const color = colors.get(label);

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
        color: color
      }); // update boxes to draw later

      Debug.write("Detecting segmentation mask");

      const mask = new Tensor(
        "float32",
        new Float32Array([
          ...box, // original scale box
          ...data.slice(4 + labels.length), // mask data
        ])
      ); // mask input

      const maskConfig = new Tensor(
        "float32",
        new Float32Array([
          maxSize,
          x, // upscale x
          y, // upscale y
          w, // upscale width
          h, // upscale height
          ...Colors.hexToRgba(color, 120),
        ])
      ); // mask config

      Debug.write("Running segmentation model");
      const { mask_filter } = await yolov8SegSession.run({
        detection: mask,
        mask: seg.mask,
        config: maskConfig,
        overlay: overlay,
      }); // perform post-process to get mask

      overlay = mask_filter; // update overlay

    }

    const mask_img = new ImageData(new Uint8ClampedArray(overlay.data), YoloV8.MODEL_WIDTH, YoloV8.MODEL_HEIGHT);
    return { boxes: boxes, mask: mask_img };
  }
}