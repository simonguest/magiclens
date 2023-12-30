import Blockly from "blockly";

const categories = [
  {
    id: "0", title: "background"
  },
  {
    id: "1", title: "hair"
  },
  {
    id: "2", title: "body"
  },
  {
    id: "3", title: "face"
  },
  {
    id: "4", title: "clothes"
  },
  {
    id: "5", title: "accessories"
  }
  ]

export const selfiemulticlass = {
  init: function () {
    this.appendDummyInput()
      .appendField("Multi-class Selfie")
      .appendField(
        new Blockly.FieldDropdown(categories.map(l => [l.title, l.id])),
        "CATEGORY"
      )
    this.setInputsInline(false);
    this.setOutput(true, "ImageSegmentationModel");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_MODELS_HUE}");
  },

  transpile: function (block, generator) {

    const model = `({name: "SelfieMulticlass", path: "./models/image-segmentation/SelfieMulticlass/float32/selfie_multiclass_256x256.tflite", category: ${block.getFieldValue("CATEGORY")}})`;
    return [model, generator.ORDER_NONE];
  },
};