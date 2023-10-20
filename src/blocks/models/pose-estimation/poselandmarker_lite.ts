export let poselandmarker_lite = {
  init: function () {
    this.appendDummyInput()
      .appendField("Pose Landmarker (Lite)")
    this.setInputsInline(false);
    this.setOutput(true, "MODEL");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(100);
  },

  transpile: function (block, generator) {
    let model = `[{name: "PoseLandmarker-Lite", path: "./models/pose-estimation/PoseLandmarker/lite/float16/pose_landmarker_lite.task"}]`;
    return [model, generator.ORDER_NONE];
  },
};