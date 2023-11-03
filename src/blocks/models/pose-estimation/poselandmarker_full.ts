export let poselandmarker_full = {
  init: function () {
    this.appendDummyInput()
      .appendField("Pose Landmarker (Full)")
    this.setInputsInline(false);
    this.setOutput(true, "PoseEstimationModel");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_MODELS_HUE}");
  },

  transpile: function (block, generator) {
    let model = `({name: "PoseLandmarker-Lite", path: "./models/pose-estimation/PoseLandmarker/full/float16/pose_landmarker_full.task"})`;
    return [model, generator.ORDER_NONE];
  },
};