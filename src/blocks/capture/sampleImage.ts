import Blockly from "blockly";

const sampleImages = [{
  id: "dogs_walking_in_park_512x512.png", title: "Dogs walking in park"
},
  {
    id: "cat_sitting_on_chair_512x512.png", title: "Cat sitting on a chair"
  },
  {
    id: "skateboarder_512x512.png", title: "Skateboarder"
  }
]

export const sampleImage = {
  init: function () {
    this.appendDummyInput()
      .appendField("sample image")
      .appendField(
        new Blockly.FieldDropdown(sampleImages.map(l => [l.title, l.id]).sort()),
        "IMAGE"
      )
    this.setInputsInline(false);
    this.setOutput(true, "Image");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_CAPTURE_HUE}");
  },

  transpile: function (block, generator) {
    const image = block.getFieldValue("IMAGE");
    return [`await cv.loadSampleImage("${image}")`, generator.ORDER_NONE];
  },
};