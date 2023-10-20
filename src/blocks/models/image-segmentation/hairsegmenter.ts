export let hairsegmenter = {
  init: function () {
    this.appendDummyInput()
      .appendField("HairSegmenter")
    this.setInputsInline(false);
    this.setOutput(true, "MODEL");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(100);
  },

  transpile: function (block, generator) {
    let model = `({name: "HairSegmenter", path: "./models/image-segmentation/HairSegmenter/float32/hair_segmenter.tflite"})`;
    return [model, generator.ORDER_NONE];
  },
};