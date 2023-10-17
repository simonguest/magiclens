export let deeplab_v3 = {
  init: function () {
    this.appendDummyInput()
      .appendField("DeepLab-V3")
    this.setInputsInline(false);
    this.setOutput(true, "MODEL");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(100);
  },

  transpile: function (block, generator) {
    let model = `[{name: "DeepLab-V3", path: "./models/image-segmentation/DeepLab-V3/float32/deeplab_v3.tflite"}]`;
    return [model, generator.ORDER_NONE];
  },
};