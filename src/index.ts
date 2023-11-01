import { Debug } from "./debug";

import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { CV } from "./cv";

// Initialize Blockly and the workspace
import { blocklyInit, workspace } from "./blocks/initializer";
blocklyInit();

const cv = new CV();

// Setup UI components
const runButton = document.getElementById("run-button");
const stopButton = document.getElementById("stop-button");
stopButton.setAttribute("disabled", "true");
const clearButton = document.getElementById("clear-button");
const downloadButton = document.getElementById("download-button");
const uploadButton = document.getElementById("upload");

// Code execution
async function run() {

  const enableRunButton = () => {
    runButton.removeAttribute("disabled");
    stopButton.setAttribute("disabled", "true");
  }
  const disableRunButton = () => {
    runButton.setAttribute("disabled", "true");
    stopButton.removeAttribute("disabled");
  }
  // Initialize the canvas collection
  cv.clearCanvasCollection();

  // Generate the required code
  let code = javascriptGenerator.workspaceToCode(workspace);

  // Check to see if the user has included a displayFrame block
  if (!code.includes("cv.displayFrame()")) {
    alert("You must include a 'display frame' block in your code");
    return;
  }
  console.log(`${code}`);
  window["cancelRequest"] = false;
  try {
    eval(
      `
          disableRunButton();
          const run = async () => {
              try {
                  ${code}
                  await cv.stopWebcam();
              } catch (err) {
                  // Exception caught in user code - probably user canceled execution
              }
          };
          run().then(async () => {
              await cv.stopWebcam();
              enableRunButton();
          });
      `
    );
  } catch (err) {
    console.error(err);
  }
}

async function init() {
  await cv.init();

  Debug.write("Loading workspace from session storage");
  let jsonStr = sessionStorage.getItem("workspace");
  if (jsonStr) {
    Blockly.serialization.workspaces.load(JSON.parse(jsonStr), workspace);
  } else {
    // Load the sample workspace
    // console.log("Loading starter workspace...");
    // const response = await fetch(`./examples/starter.json`);
    // const json = await response.json();
    // Blockly.serialization.workspaces.load(json, workspace);
  }

  runButton.onclick = async () => {
    Debug.write("run button pressed");
    await run();
  };

  stopButton.onclick = async () => {
    Debug.write("stop button pressed");
    window["cancelRequest"] = true;
  }

  clearButton.onclick = () => {
    Debug.write("clear button pressed");
    if (confirm("Clearing the workspace will lose all unsaved work. Continue?")) {
      sessionStorage.removeItem("workspace");
      location.reload();
    }
  };

  downloadButton.onclick = () => {
    Debug.write("download button pressed");
    let file = new Blob([sessionStorage.getItem("workspace")], {
      type: "text/json",
    });
    let a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "cv-workspace.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  uploadButton.onchange = async (e) => {
    Debug.write("upload workspace from file");
    let file = e.target["files"][0];
    if (!file) {
      return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
      let json = e.target.result;
      Blockly.serialization.workspaces.load(JSON.parse(json.toString()), workspace);
      sessionStorage.setItem("workspace", json.toString());
    };
    reader.readAsText(file);
  };

  const broadcastColumnResize = (e) => {
    // Add some hard limits to the column resizing
    if (e.clientX < 200 || e.clientX > window.innerWidth - 200) return;

    let windowWidth = window.innerWidth;
    let runArea = document.getElementById("run-area");
    runArea.style.width = `${((window.innerWidth - e.clientX) / windowWidth) * 100}%`;


    let blocklyArea = document.getElementById("blockly-area");
    blocklyArea.style.width = `${(e.clientX / windowWidth) * 100}%`;

    let columnResizedEvent = new Event("resize");
    window.dispatchEvent(columnResizedEvent);
  };

  // Column resizer control using pointer events to support mouse and touch
  document.getElementById("column-resizer").onpointerdown = () => {
    document.addEventListener("pointermove", broadcastColumnResize);
    document.onpointerup = () => {
      Debug.write("Windows resize complete");
      document.removeEventListener("pointermove", broadcastColumnResize);
    };
  };
}

init();