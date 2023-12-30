import Blockly from "blockly";

export const emojis = [
  {
    id: "slightly-smiling-face", title: "🙂"
  },
  {
    id: "thinking-face", title: "🤔"
  },
  {
    id: "money-bag", title: "💰"
  },
  {
    id: "fish", title: "🐟"
  },
  {
    id: "dog", title: "🐶"
  },
  {
    id: "cat", title: "🐱"
  },
  {
    id: "unicorn", title: "🦄"
  },
  {
    id: "rainbow", title: "🌈"
  },
  {
    id: "sun", title: "☀️"
  },
  {
    id: "cloud", title: "☁️"
  },
  {
    id: "snowman", title: "☃️"
  },
  {
    id: "star", title: "⭐️"
  },
  {
    id: "heart", title: "❤️"
  },
  {
    id: "alien", title: "👽"
  },
  {
    id: "robot", title: "🤖"
  },
  {
    id: "ghost", title: "👻"
  },
  {
    id: "skull", title: "💀"
  },
  {
    id: "clown", title: "🤡"
  },
  {
    id: "monkey", title: "🐵"
  },
  {
    id: "panda", title: "🐼"
  },
  {
    id: "pig", title: "🐷"
  },
  {
    id: "chicken", title: "🐔"
  },
  {
    id: "penguin", title: "🐧"
  },
  {
    id: "frog", title: "🐸"
  },
  {
    id: "honeybee", title: "🐝"
  },
  {
    id: "ant", title: "🐜"
  },
  {
    id: "lady-beetle", title: "🐞"
  },
  {
    id: "snail", title: "🐌"
  },
  {
    id: "butterfly", title: "🦋"
  },
  {
    id: "spider", title: "🕷"
  },
  {
    id: "scorpion", title: "🦂"
  },
  {
    id: "crab", title: "🦀"
  }
  ]

export const drawEmojiAt = {
  init: function () {
    this.appendValueInput("POSITION")
      .setCheck("Position")
      .appendField("draw emoji")
      .appendField(
        new Blockly.FieldDropdown(emojis.map(l => [l.title, l.id])),
        "EMOJI"
      )
      .appendField("size")
      .appendField(new Blockly.FieldNumber(20, 1, 100), "EMOJI_SIZE")
      .appendField("at");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_DRAW_HUE}");
  },

  transpile: function (block, generator) {
    const position = generator.valueToCode(block, 'POSITION', generator.ORDER_NONE);
    if (position === "") return "";

    let size = block.getFieldValue('EMOJI_SIZE');
    size *= 10; // as we are using a 1024x1024 canvas, we need to scale the emoji size up

    return `cv.drawEmojiAt("${block.getFieldValue('EMOJI')}",${position}, ${size});`;
  }
};