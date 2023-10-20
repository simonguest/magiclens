import {Debug} from "../debug";

export class Webcam {

  private static FPSCounter = class {
    private readonly sampleSize: number;
    private readonly timestamps: number[];

    constructor(sampleSize = 5) {
      this.sampleSize = sampleSize;
      this.timestamps = [];
    }

    calculateFPS(time) {
      this.timestamps.push(time);

      // If we have more than the sample size, remove the oldest timestamp
      if (this.timestamps.length > this.sampleSize) {
        this.timestamps.shift();
      }

      // Calculate Average FPS
      const averageDuration = this.timestamps[this.timestamps.length - 1] - this.timestamps[0];
      const averageFPS = (this.timestamps.length - 1) / (averageDuration / 1000);

      return {
        averageFPS
      };
    }
  }

  private currentStream = null;
  private videoElement = document.getElementById('hidden-video') as HTMLVideoElement;
  private videoCanvas = document.getElementById('hidden-video-canvas') as HTMLCanvasElement;

  private fpsCounter = new Webcam.FPSCounter();

  private canPlayCallback = () => {
    Debug.write("Webcam started");
  }

  private wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  public async start(deviceId: string) {
    Debug.write(`Starting webcam`);
    return new Promise(async (resolve, reject) => {
      if (this.currentStream) {
        Debug.write("Webcam is already on.");
        return resolve(this.currentStream);
      }
      let that = this;
      navigator.mediaDevices.getUserMedia({video: {deviceId: deviceId}})
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

  private createGreenImageData() {
    const width = 1024;
    const height = 1024;

    // Create an offscreen canvas
    const offscreenCanvas = document.createElement('canvas');
    const context = offscreenCanvas.getContext('2d');

    // Create an empty ImageData object
    const imageData = context.createImageData(width, height);

    // Fill the ImageData object with green
    for (let i = 0; i < width * height * 4; i += 4) {
      imageData.data[i + 0] = 0;       // Red: 0
      imageData.data[i + 1] = 255;     // Green: 255
      imageData.data[i + 2] = 0;       // Blue: 0
      imageData.data[i + 3] = 255;     // Alpha: 255 (fully opaque)
    }

    return imageData;
  }

  public async captureImage() {
    Debug.write("Trying to capture webcam image");
    return new Promise(async (resolve, reject) => {
      if (!this.currentStream) {
        Debug.write("Webcam is not started.");
        // Create a default green image instead
        resolve(this.createGreenImageData());
      }
      let ctx = this.videoCanvas.getContext('2d');
      ctx.drawImage(this.videoElement, 0, 0, 1024, 1024);
      let averageFPS = this.fpsCounter.calculateFPS(Date.now()).averageFPS;
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.strokeText(`FPS: ${averageFPS.toFixed(2)}`, 10, 25);
      ctx.fillText(`FPS: ${averageFPS.toFixed(2)}`, 10, 25);

      let imageData = ctx.getImageData(0, 0, 1024, 1024);
      resolve(imageData);
    });
  }
}