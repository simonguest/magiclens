import { resolve } from "path";
import cv2 from "../../lib/opencv.js";

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
  
      img.onload = function() {
        resolve(img);  // resolves with the image element
      };
  
      img.onerror = function() {
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

  public async displayMat(mat: any) {
    cv2.imshow("runAreaCanvas", mat);
  }
}