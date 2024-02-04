export const facelandmarker_fp16 = {
  init: function () {
    this.appendDummyInput()
      .appendField("Face Landmarker (fp16)")
    this.setInputsInline(false);
    this.setOutput(true, "FaceEstimationModel");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_MODELS_HUE}");
  },

  transpile: function (block, generator) {
    const model = `({name: "FaceLandmarker-fp16", path: "./models/face-landmark-detection/FaceLandmarker/float16/face_landmarker.task"})`;
    return [model, generator.ORDER_NONE];
  },
};