import {Debug} from "../debug";

export class Webcam {

  private currentStream = null;
  private videoElement = document.getElementById('hidden-video') as HTMLVideoElement;
  private videoCanvas = document.getElementById('hidden-video-canvas') as HTMLCanvasElement;

  private canPlayCallback = () => {
    Debug.write("Webcam started");
  }

  private wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  private displayStartingWebCamImage(canvas: HTMLCanvasElement) {
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

  public async start(deviceId: string, canvas: HTMLCanvasElement) {
    Debug.write("Displaying starting webcam image");
    this.displayStartingWebCamImage(canvas);

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
    return new Promise(async (resolve) => {
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
      imageData.data[i] = 0;       // Red: 0
      imageData.data[i + 1] = 255;     // Green: 255
      imageData.data[i + 2] = 0;       // Blue: 0
      imageData.data[i + 3] = 255;     // Alpha: 255 (fully opaque)
    }

    return imageData;
  }

  public async captureImage() {
    Debug.write("Trying to capture webcam image");
    return new Promise(async (resolve) => {
      if (!this.currentStream) {
        Debug.write("Webcam is not started.");
        // Create a default green image instead
        resolve(this.createGreenImageData());
      }
      let ctx = this.videoCanvas.getContext('2d');
      ctx.drawImage(this.videoElement, 0, 0, 1024, 1024);

      // Extract the image data and return
      let imageData = ctx.getImageData(0, 0, 1024, 1024);
      resolve(imageData);
    });
  }
}