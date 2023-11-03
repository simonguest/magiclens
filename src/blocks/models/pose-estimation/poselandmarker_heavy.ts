export let poselandmarker_heavy = {
  init: function () {
    this.appendDummyInput()
      .appendField("Pose Landmarker (Heavy)")
    this.setInputsInline(false);
    this.setOutput(true, "PoseEstimationModel");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_MODELS_HUE}");
  },

  transpile: function (block, generator) {
    let model = `({name: "PoseLandmarker-Lite", path: "./models/pose-estimation/PoseLandmarker/heavy/float16/pose_landmarker_heavy.task"})`;
    return [model, generator.ORDER_NONE];
  },
};