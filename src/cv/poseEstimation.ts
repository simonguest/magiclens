import { Debug } from "../debug";
import { MediaPipe } from "./mediapipe";
import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";

export class PoseEstimation {

  public async detectPose(mp: MediaPipe, image: ImageData, model: ModelData, delegate: string, displayMessage: any, clearMessage: any) {
    Debug.write("Detecting pose");
    return await mp.detectPose(image, model, delegate, displayMessage, clearMessage);
  }

  public async displayPose(canvas: HTMLCanvasElement, pose: PoseLandmarkerResult, width: number, height: number) {
    if (pose.landmarks.length === 0) {
      Debug.write("No landmarks detected");
      return null;
    }
    Debug.write("Drawing poses");
    const ctx = canvas.getContext("2d");
    pose.landmarks[0].forEach(point => {
      const x = point.x * width;
      const y = point.y * height;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    });

    // Draw connections
    MediaPipe.POSE_CONNECTIONS.forEach(conn => {
      const start = pose.landmarks[0][conn.start];
      const end = pose.landmarks[0][conn.end];

      ctx.beginPath();
      ctx.moveTo(start.x * width, start.y * height);
      ctx.lineTo(end.x * width, end.y * height);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  public getPositionOf(bodyPart: number, pose: PoseLandmarkerResult, width: number, height: number) {
    if (pose.landmarks.length === 0) {
      Debug.write("No landmarks detected");
      return null;
    }
    const coords = pose.landmarks[0][bodyPart];
    const x = coords.x * width;
    const y = coords.y * height;
    const position: Position = { x: x, y: y };
    Debug.write(`Getting position of body part id: ${bodyPart} at ${position.x},${position.y}`);
    return position;
  }

}