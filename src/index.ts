import { Debug } from "./debug";

import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { CV } from "./cv";

import { blocklyInit, workspace } from "./blocks/initializer";

blocklyInit();

const cv = new CV(512, 512);

// Setup UI components
const runButton = document.getElementById("run-button");
const stopButton = document.getElementById("stop-button");
stopButton.setAttribute("disabled", "true");
const clearButton = document.getElementById("clear-button");
const exportButton = document.getElementById("export-button");
const exampleDropdown = document.getElementById("example-dropdown") as HTMLSelectElement;
const uploadButton = document.getElementById("upload");

// Code execution
async function run() {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const enableRunButton = () => {
    runButton.removeAttribute("disabled");
    stopButton.setAttribute("disabled", "true");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const disableRunButton = () => {
    runButton.setAttribute("disabled", "true");
    stopButton.removeAttribute("disabled");
  }
  // Initialize the canvas collection
  cv.clearCanvasCollection();

  // Generate the required code
  const code = javascriptGenerator.workspaceToCode(workspace);

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
                  console.error(err);
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
  const jsonStr = sessionStorage.getItem("workspace");
  if (jsonStr) {
    Blockly.serialization.workspaces.load(JSON.parse(jsonStr), workspace);
  } else {
    // Load the sample workspace
    Debug.write("Loading starter workspace...");
    const response = await fetch(`./examples/starter.json`);
    const json = await response.json();
    Blockly.serialization.workspaces.load(json, workspace);
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
    // stop the current project, if running
    window["cancelRequest"] = true;
    if (confirm("Clearing the workspace will lose all unsaved work. Continue?")) {
      sessionStorage.removeItem("workspace");
      location.reload();
    }
  };

  exportButton.onclick = () => {
    Debug.write("download button pressed");
    const file = new Blob([sessionStorage.getItem("workspace")], {
      type: "text/json",
    });
    const a = document.createElement("a"),
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

  exampleDropdown.onchange = async (e) => {
    Debug.write("Example workspace dropdown changed");
    // stop the current project, if running
    window["cancelRequest"] = true;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const file = e.target.value;
    if (file) {
      if (confirm("Loading this example workspace will lose all unsaved work. Continue?")) {
        const response = await fetch(`./examples/${file}`);
        const json = await response.json();
        Blockly.serialization.workspaces.load(json, workspace);
      }
    }
    exampleDropdown.value = "";
  }

  uploadButton.onchange = async (e) => {
    Debug.write("upload workspace from file");
    // stop the current project, if running
    window["cancelRequest"] = true;
    const file = e.target["files"][0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      const json = e.target.result;
      Blockly.serialization.workspaces.load(JSON.parse(json.toString()), workspace);
      sessionStorage.setItem("workspace", json.toString());
    };
    reader.readAsText(file);
  };

  const broadcastColumnResize = (e: PointerEvent) => {
    // Add some hard limits to the column resizing
    if (e.clientX < 200 || e.clientX > window.innerWidth - 200) return;

    const windowWidth = window.innerWidth;
    const runArea = document.getElementById("run-area");
    runArea.style.width = `${((window.innerWidth - e.clientX) / windowWidth) * 100}%`;


    const blocklyArea = document.getElementById("blockly-area");
    blocklyArea.style.width = `${(e.clientX / windowWidth) * 100}%`;

    const columnResizedEvent = new Event("resize");
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

init().then();