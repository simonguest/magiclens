import { Debug } from "../debug";

import cv2 from "../../lib/opencv.js";

export class Webcam {
  private currentStream = null;
  private videoElement = document.getElementById('hidden-video') as HTMLVideoElement;

  private canPlayCallback = () => {
    Debug.write("Webcam started");
  }

  private wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  public async start(deviceId: string) {
    Debug.write(`Starting webcam`);
    return new Promise(async (resolve, reject) => {08
      if (this.currentStream) {
        Debug.write("Webcam is already on.");
        return resolve(this.currentStream);
      }
      let that = this;
      navigator.mediaDevices.getUserMedia({ video: { deviceId: deviceId } })
        .then(async function (stream) {
          that.currentStream = stream;
          that.videoElement.srcObject = stream;
          that.videoElement.addEventListener("canplay", that.canPlayCallback, false);
          await that.videoElement.play();
          await that.wait(500); // Wait for the webcam to receive enough light after startup before capturing an image
          resolve(that.currentStream);
        })
        .catch(function (err) {
          Debug.write("An error occurred: " + err);
          reject("An error occurred: " + err);
        });
    });
  }

  public async stop() {
    Debug.write("Stopping webcam");
    return new Promise(async (resolve, reject) => {
      if (!this.currentStream) {
        Debug.write("Webcam is not started.")
        return resolve("Webcam is not started.");
      }
      let tracks = this.currentStream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
      this.videoElement.removeEventListener("canplay", this.canPlayCallback);
      this.videoElement.srcObject = null;
      this.currentStream = null;
      Debug.write("Webcam stopped");
      resolve("Webcam stopped");
    });
  }

  private videoCapture = new cv2.VideoCapture(this.videoElement);
  private currentFrame = null;

  public async captureImage() {
    Debug.write("Trying to capture webcam image");
    return new Promise(async (resolve, reject) => {
      if (!this.currentStream) {
        Debug.write("Webcam is not started.");
        // Create a default green image instead
        let frame = new cv2.Mat(1024, 1024, cv2.CV_8UC4, [0, 255, 0, 255]);
        resolve(frame);
      }
      //let cap = new cv2.VideoCapture(this.videoElement);
      if (!this.currentFrame) {
        this.currentFrame = new cv2.Mat(this.videoElement.height, this.videoElement.width, cv2.CV_8UC4);
      }
      await this.videoCapture.read(this.currentFrame);
      Debug.write("Webcam image captured");
      resolve(this.currentFrame);
    });
  };
}