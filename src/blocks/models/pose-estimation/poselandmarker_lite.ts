export const poselandmarker_lite = {
  init: function () {
    this.appendDummyInput()
      .appendField("Pose Landmarker (Lite)")
    this.setInputsInline(false);
    this.setOutput(true, "PoseEstimationModel");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_MODELS_HUE}");
  },

  transpile: function (block, generator) {
    const model = `({name: "PoseLandmarker-Lite", path: "./models/pose-estimation/PoseLandmarker/lite/float16/pose_landmarker_lite.task"})`;
    return [model, generator.ORDER_NONE];
  },
};