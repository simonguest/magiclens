export let captureWebcamImage = {
  init: function () {
    this.appendDummyInput()
      .appendField("capture webcam image")
    this.setInputsInline(false);
    this.setOutput(true, "IMAGE");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(295);
    this.setTooltip("A sample image");
  },

  transpile: function (block, generator) {
    return [`await cv.captureWebcamImage()`, generator.ORDER_NONE];
  },
};