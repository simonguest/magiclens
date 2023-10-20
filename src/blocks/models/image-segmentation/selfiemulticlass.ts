export let selfiemulticlass = {
  init: function () {
    this.appendDummyInput()
      .appendField("SelfieMulticlass")
    this.setInputsInline(false);
    this.setOutput(true, "MODEL");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(100);
  },

  transpile: function (block, generator) {
    let model = `({name: "SelfieMulticlass", path: "./models/image-segmentation/SelfieMulticlass/float32/selfie_multiclass_256x256.tflite"})`;
    return [model, generator.ORDER_NONE];
  },
};