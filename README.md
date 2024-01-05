# MagicLens

MagicLens is a prototype that demonstrates how students (grades 7-12) can use block-based programming to learn computer vision. Students can build programs using a variety of models that include object detection, pose detection, and image segmentation.

Students can learn about computer vision by presenting various objects via their webcam, experimenting with the impacts of running models on the CPU vs GPU, and by using image pre-processing filters.

Designed to run on minimal hardware, MagicLens is fully browser-based and requires no installation. It uses WebGL to run models on the GPU and works (albeit with a slower framerate) on many low-end laptops and Chromebooks.

MagicLens is made possible thanks to Google's [Blockly](https://github.com/google/blockly) and [MediaPipe](https://developers.google.com/mediapipe).

## Using MagicLens

To launch MagicLens, browse to https://simonguest.github.io/magiclens. When the browser first loads, you'll be asked for permissions to access the webcam.

Then, drag blocks on to the workspace to build your program:

![Screenshot 2024-01-01 at 21 59 20](https://github.com/simonguest/magiclens/assets/769225/452291b3-7996-40f5-9c2c-4aef0608ee2d)

To run the program, click the run button on the toolbar. Click the stop button to interrupt (e.g., if you have a for loop capturing frames from the webcam.)

## Example Projects

Use the "Load Example Workspace" dropdown to open example projects that demonstrate some of the available models.

**Cat Image:** The default project that runs an object detector model on a static image of a cat. Students can experiment with model accuracy by swapping out various models.

**Object Detector:** Runs an object detector model on the webcam stream. The object detector models have been trained with the [COCO dataset](https://cocodataset.org/#home) and will recognize 80 different objects.

![Screenshot 2024-01-01 at 22 00 56](https://github.com/simonguest/magiclens/assets/769225/0a8276f7-7013-4e96-918e-cef0668b54c0)

**Pose Detector:** Runs a pose detector model on the webcam stream.

![Screenshot 2024-01-01 at 22 01 33](https://github.com/simonguest/magiclens/assets/769225/9da31dcf-a2e2-4085-a7ad-0eee118ba9e3)

**Space Background:** Runs an image segmentation model to detect the background in the frame and replaces it with an image of a space scene.

![Screenshot 2024-01-01 at 22 02 07](https://github.com/simonguest/magiclens/assets/769225/88488a73-bfe9-41c1-b9ae-c3be3346681b)

**No Cellphones:** Runs an object detector model to detect cellphones in the scene. If found, it runs an image segmentation model to paint the person red. (Perfect for detecting cell phone usage in class!)

![Screenshot 2024-01-01 at 22 02 51](https://github.com/simonguest/magiclens/assets/769225/10cbedbb-f1d7-46f9-b204-3c96ae2bbd62)

**Clothes Color:** Runs an image segmentation model to detect clothing and repaints them with a sparkly red background.

![Screenshot 2024-01-01 at 22 03 09](https://github.com/simonguest/magiclens/assets/769225/be1ff341-67cd-4902-8d4d-c360881e7f61)

**Fish Tank:** A game that combines a pose detector and image segmentation where you need to "catch" the fish and snails swimming in the tank.

![Screenshot 2024-01-01 at 22 03 33](https://github.com/simonguest/magiclens/assets/769225/69de01c5-05fe-4687-b7f1-21515fc64997)
