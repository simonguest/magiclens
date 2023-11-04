import Blockly from "blockly";

const sampleImages = [{
  id: "dogs_walking_in_park.png", title: "Dogs walking in park"
},
  {
    id: "cat_sitting_on_chair.png", title: "Cat sitting on a chair"
  },
  {
    id: "skateboarder.png", title: "Skateboarder"
  },
  {
    id: "space_background.png", title: "Space background"
  },
  {
    id: "tropical_fish.png", title: "Tropical fish"
  },
  {
    id: "red_material.png", title: "Red material"
  }
]

export let sampleImage = {
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
    let image = block.getFieldValue("IMAGE");
    return [`await cv.loadSampleImage("${image}")`, generator.ORDER_NONE];
  },
};