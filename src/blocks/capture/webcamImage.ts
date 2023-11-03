export let webcamImage = {
  init: function () {
    this.appendDummyInput()
      .appendField("capture webcam image")
    this.setInputsInline(false);
    this.setOutput(true, "Image");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_CAPTURE_HUE}");
  },

  transpile: function (block, generator) {
    return [`await cv.captureWebcamImage()`, generator.ORDER_NONE];
  },
};