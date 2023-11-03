export let detectPose = {
  init: function () {
    this.appendValueInput("IMAGE")
      .setCheck("Image")
      .appendField("detect pose in image");
    this.appendValueInput("MODEL")
      .setCheck("PoseEstimationModel")
      .appendField("using model");
    this.setInputsInline(false);
    this.setOutput(true, "Pose");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_MODELS_HUE}");
  },

  transpile: function (block, generator) {
    let image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    let model = generator.valueToCode(block, 'MODEL', generator.ORDER_NONE);

    if (image === "") return "";
    if (model === "") return "";

    return [`await cv.detectPose(${image}, ${model})`, generator.ORDER_NONE];
  }
};