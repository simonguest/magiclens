export let selfiesegmenter = {
  init: function () {
    this.appendDummyInput()
      .appendField("SelfieSegmenter")
    this.setInputsInline(false);
    this.setOutput(true, "MODEL");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(100);
  },

  transpile: function (block, generator) {
    let model = `({name: "SelfieSegmenter", path: "./models/image-segmentation/SelfieSegmentation/float16/selfie_segmenter.tflite"})`;
    return [model, generator.ORDER_NONE];
  },
};