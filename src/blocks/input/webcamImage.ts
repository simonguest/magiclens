export let webcamImage = {
  init: function () {
    this.appendDummyInput()
      .appendField("Image from WebCam")
    this.setInputsInline(false);
    this.setOutput(true, "IMAGE");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(295);
    this.setTooltip("A sample image");
  },

  transpile: function (block, generator) {
    return [`await cv.webcamImage()`, generator.ORDER_NONE];
  },
};