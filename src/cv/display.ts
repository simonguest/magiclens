import { Debug } from "../debug";

import { emojis } from "../blocks/display/drawEmojiAt";

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

  public addImageToFrame(canvas: HTMLCanvasElement, image: ImageData) {
    Debug.write("Add image to frame (hidden image canvas)");
    const ctx = canvas.getContext("2d");
    ctx.putImageData(image, 0, 0); // put overlay to canvas
  }

  public async displayFrame(imageCanvas: HTMLCanvasElement, hiddenImageCanvas: HTMLCanvasElement, boundingBoxCanvas: HTMLCanvasElement, segmentationMaskCanvas: HTMLCanvasElement, poseCanvas: HTMLCanvasElement, userCanvas: HTMLCanvasElement) {
    const ctx = imageCanvas.getContext("2d");
    ctx.drawImage(hiddenImageCanvas, 0, 0);
    ctx.drawImage(segmentationMaskCanvas, 0, 0);
    ctx.drawImage(boundingBoxCanvas, 0, 0);
    ctx.drawImage(poseCanvas, 0, 0);
    ctx.drawImage(userCanvas, 0, 0);

    // Overlay the FPS counter in the top left corner
    const averageFPS = this.fpsCounter.calculateFPS(Date.now()).averageFPS;
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText(`FPS: ${averageFPS.toFixed(2)}`, 10, 25);
    ctx.fillText(`FPS: ${averageFPS.toFixed(2)}`, 10, 25);

    // Wait for screen to update
    await this.wait(this.DISPLAY_WAIT_TIME); // Wait to allow the image to be displayed
  }

  public drawTextAt(userCanvas: HTMLCanvasElement, text: string, position: Position, font: string, size: number, color: string) {
    if (position === null) {
      Debug.write("No position provided");
      return;
    }
    Debug.write(`Drawing text ${text} at ${position.x},${position.y}`);
    const ctx = userCanvas.getContext("2d");
    // draw the label background
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = color;

    // Calculate text width
    const textWidth = ctx.measureText(text).width;

    // Set x and y coordinates to center the text
    const x = position.x - (textWidth / 2);
    const y = position.y - (size / 2);

    // Set the background stroke
    const strokeColor = "#000000"; // Black color
    const strokeWidth = 3; // Width of the stroke in pixels
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  }


  public drawEmojiAt(userCanvas: HTMLCanvasElement, emoji: string, position: Position, size: number) {
    if (position === null) {
      Debug.write("No position provided");
      return;
    }
    Debug.write(`Drawing emoji ${emoji} at ${position.x},${position.y}`);
    const ctx = userCanvas.getContext("2d");
    // draw the label background
    ctx.font = `${size}px serif`;
    const icon = emojis.find(e => e.id === emoji).title;
    ctx.fillText(icon, position.x, position.y);
  }

}