# MagicLens

MagicLens is a prototype that demonstrates how students (grades 7-12) can use block-based programming to learn AI through computer vision. Students can build programs using a variety of models that include object detection, pose detection, and image segmentation.

Students can learn about AI and computer vision by presenting various objects via their webcam, experimenting with the impacts of running models on the CPU vs GPU, and by using image pre-processing filters.

Designed to run on minimal hardware, MagicLens is fully browser-based and requires no installation. It uses WebGL to run models on the GPU and works (albeit with a slower framerate) on many low-end laptops and Chromebooks.

MagicLens is made possible thanks to Google's [Google's Blockly](https://github.com/google/blockly) and [MediaPipe](https://developers.google.com/mediapipe).

## Using MagicLens

To launch MagicLens, browse to https://simonguest.github.io/magiclens. When the browser first loads, you'll be asked for permissions to access the webcam.

Then, drag blocks on to the workspace to build your program:

#### Screenshot

To run the program, click the run button on the toolbar. Click the stop button to interrupt (e.g., if you have a for loop capturing frames from the webcam.)

## Example Projects

Use the "Load Example Workspace" dropdown to open example projects that demonstrate some of the available models.

**Cat Image:** The default project that runs an object detector model on a static image of a cat. Students can experiment with model accuracy by swapping out various models.

**Object Detector:** Runs an object detector model on the webcam stream. The object detector models have been trained with the [COCO dataset](https://cocodataset.org/#home) and will recognize 80 different objects.

**Post Detector:** Runs a pose detector model on the webcam stream.

**Space Background:** Runs an image segmentation model to detect the background in the frame and replaces it with an image of a space scene.

**No Cellphones:** Runs an object detector model to detect cellphones in the scene. If found, it runs an image segmentation model to paint the person red. (Perfect for detecting cell phone usage in class!)

**Clothes Color:** Runs an image segmenetation model to detect clothing and repaints them with a sparkly red background.

**Fish Tank:** A game that combines a pose detector and image segmentation where you need to "catch" the fish and snails swimming in the tank.