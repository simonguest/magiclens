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
    console.log(`Loading the ${image} image`);
    const imageEl = await this.loadImage(`./images/${image}`);
    console.log('Image loaded');
    let mat = cv2.imread(imageEl);
    console.log(mat);
  } 
}