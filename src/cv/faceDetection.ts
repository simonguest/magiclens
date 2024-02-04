import { Debug } from "../debug";
import { MediaPipe } from "./mediapipe";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";

export class FaceDetection {

  public async detectFace(mp: MediaPipe, image: ImageData, model: ModelData, delegate: string, displayMessage: any, clearMessage: any) {
    Debug.write("Detecting face");
    return await mp.detectFace(image, model, delegate, displayMessage, clearMessage);
  }

  public async drawFace(canvas: HTMLCanvasElement, face: FaceLandmarkerResult, width: number, height: number) {
   if (face.faceLandmarks.length === 0) {
      Debug.write("No landmarks detected");
      return null;
    }
    Debug.write("Drawing face");
    const ctx = canvas.getContext("2d");
    face.faceLandmarks[0].forEach(point => {
      const x = point.x * width;
      const y = point.y * height;

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    });

    // Draw connections
    MediaPipe.FACE_CONNECTIONS.forEach(conn => {
      const start = face.faceLandmarks[0][conn.start];
      const end = face.faceLandmarks[0][conn.end];

      ctx.beginPath();
      ctx.moveTo(start.x * width, start.y * height);
      ctx.lineTo(end.x * width, end.y * height);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

}