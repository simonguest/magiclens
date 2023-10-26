export class Display {

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

  private fpsCounter = new Display.FPSCounter();

  private DISPLAY_WAIT_TIME = 1; // ms to wait for image to be displayed before continuing

  private wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  public async displayFrame(imageCanvas: HTMLCanvasElement, hiddenImageCanvas: HTMLCanvasElement, boundingBoxCanvas: HTMLCanvasElement, segmentationMaskCanvas: HTMLCanvasElement, poseCanvas: HTMLCanvasElement) {
    const ctx = imageCanvas.getContext("2d");
    ctx.drawImage(hiddenImageCanvas, 0, 0);
    ctx.drawImage(segmentationMaskCanvas,0, 0);
    ctx.drawImage(boundingBoxCanvas, 0, 0);
    ctx.drawImage(poseCanvas, 0, 0);

    // Overlay the FPS counter in the top left corner
    let averageFPS = this.fpsCounter.calculateFPS(Date.now()).averageFPS;
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText(`FPS: ${averageFPS.toFixed(2)}`, 10, 25);
    ctx.fillText(`FPS: ${averageFPS.toFixed(2)}`, 10, 25);

    // Wait for screen to update
    await this.wait(this.DISPLAY_WAIT_TIME); // Wait to allow the image to be displayed
  }

}