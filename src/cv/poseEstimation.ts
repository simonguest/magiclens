import { Debug } from "../debug";
import { MediaPipe } from "./mediapipe";
import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";

export class PoseEstimation {

  public async detectPose(mp: MediaPipe, image: ImageData, model: ModelData) {
    Debug.write("Detecting pose");
    return await mp.detectPose(image, model);
  }

  public async displayPose(canvas: HTMLCanvasElement, pose: PoseLandmarkerResult) {
    Debug.write("Drawing poses");
    const ctx = canvas.getContext("2d");
    pose.landmarks[0].forEach(point => {
      const x = point.x * 1024;
      const y = point.y * 1024;

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
      ctx.moveTo(start.x * 1024, start.y * 1024);
      ctx.lineTo(end.x * 1024, end.y * 1024);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  public getPositionOf(bodyPart: number, pose: PoseLandmarkerResult) {
    if (pose.landmarks.length === 0) {
      Debug.write("No landmarks detected");
      return null;
    }
    let coords = pose.landmarks[0][bodyPart];
    let x = coords.x * 1024;
    let y = coords.y * 1024;
    let position: Position = { x: x, y: y };
    Debug.write(`Getting position of body part id: ${bodyPart} at ${position.x},${position.y}`);
    return position;
  }

}