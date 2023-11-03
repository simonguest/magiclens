export let detectObjects = {
  init: function () {
    this.appendValueInput("IMAGE")
      .setCheck("Image")
      .appendField("detect objects in image ");
    this.appendValueInput("MODEL")
      .setCheck("ObjectDetectionModel")
      .appendField("using model");
    this.setInputsInline(false);
    this.setOutput(true, "Objects");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_MODELS_HUE}");
  },

  transpile: function (block, generator) {
    let image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    let model = generator.valueToCode(block, 'MODEL', generator.ORDER_NONE);

    if (image === "") return "";
    if (model === "") return "";

    return [`await cv.detectObjects(${image}, ${model})`, generator.ORDER_NONE];
  }
};