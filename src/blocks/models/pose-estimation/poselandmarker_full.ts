export let poselandmarker_full = {
  init: function () {
    this.appendDummyInput()
      .appendField("Pose Landmarker (Full)")
    this.setInputsInline(false);
    this.setOutput(true, "MODEL");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(100);
  },

  transpile: function (block, generator) {
    let model = `[{name: "PoseLandmarker-Lite", path: "./models/pose-estimation/PoseLandmarker/full/float16/pose_landmarker_full.task"}]`;
    return [model, generator.ORDER_NONE];
  },
};