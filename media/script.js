// eslint-disable-next-line no-undef
const vscode = acquireVsCodeApi();

// *** Showing/collapsing of menu items in hierarchy views ****

var toggler = document.getElementsByClassName("caret");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].parentElement.addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.querySelector(".caret").classList.toggle("caret-down");
  });
} 

// *** Selection of menu items in hierarchy views ****

var moduleHierarchy = document.getElementById('module-hierarchy');
const moduleList = moduleHierarchy.getElementsByClassName('hierarchy_element');

for (const item of moduleList) {
  item.onclick = function(event) {  
    // Mark as selected
    if (event.ctrlKey || event.metaKey) {
      toggleSelect(item);
    } else {
      singleSelect(item);
    }
  
    // Request the list of signals of this module
    vscode.postMessage({
      command: "getModuleSignals",
      module: item.getAttribute("data-hierarchical-path")
    });
  };
}

// prevent unneeded selection of list elements on clicks
moduleHierarchy.onmousedown = function() {
  return false;
};

function toggleSelect(item) {
  item.classList.toggle('selected');
}

function singleSelect(item) {
  let selected = moduleHierarchy.querySelectorAll('.selected');
  for(let elem of selected) {
    elem.classList.remove('selected');
  }
  item.classList.add('selected');
}

// *** Display of signal list ****

window.addEventListener("message", event => {
    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        case "setSignalList": {
          console.log("setSignalList");
            const signalList = document.getElementById("signal-list");

            const oldSignals = signalList.firstElementChild;
            if (oldSignals !== null) {
                signalList.removeChild(oldSignals);
            }

            let list = document.createElement("ul");
            for (const signal of message.signals) {
              const elem = document.createElement("li");
              elem.innerText = signal;
              list.appendChild(elem);
            }

            signalList.appendChild(list);
            break;
        }
    }
});

// *** Resizing of split planes in UI layout ****

document.addEventListener('DOMContentLoaded', function () {
  const resizable = function (resizer) {
      const direction = resizer.getAttribute('data-direction') || 'horizontal';
      const prevSibling = resizer.previousElementSibling;
      const nextSibling = resizer.nextElementSibling;

      // The current position of mouse
      let x = 0;
      let y = 0;
      let prevSiblingHeight = 0;
      let prevSiblingWidth = 0;

      // Handle the mousedown event
      // that's triggered when user drags the resizer
      const mouseDownHandler = function (e) {
          // Get the current mouse position
          x = e.clientX;
          y = e.clientY;
          const rect = prevSibling.getBoundingClientRect();
          prevSiblingHeight = rect.height;
          prevSiblingWidth = rect.width;

          // Attach the listeners to document
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler);
      };

      const mouseMoveHandler = function (e) {
          // How far the mouse has been moved
          const dx = e.clientX - x;
          const dy = e.clientY - y;

          switch (direction) {
              case 'vertical': {
                  const h =
                      ((prevSiblingHeight + dy) * 100) /
                      resizer.parentNode.getBoundingClientRect().height;
                  prevSibling.style.height = h + '%';
                  break;
              }
              case 'horizontal':
              default: {
                  const w =
                      ((prevSiblingWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
                  prevSibling.style.width = w + '%';
                  break;
              }
          }

          const cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
          resizer.style.cursor = cursor;
          document.body.style.cursor = cursor;

          prevSibling.style.userSelect = 'none';
          prevSibling.style.pointerEvents = 'none';

          nextSibling.style.userSelect = 'none';
          nextSibling.style.pointerEvents = 'none';
      };

      const mouseUpHandler = function () {
          resizer.style.removeProperty('cursor');
          document.body.style.removeProperty('cursor');

          prevSibling.style.removeProperty('user-select');
          prevSibling.style.removeProperty('pointer-events');

          nextSibling.style.removeProperty('user-select');
          nextSibling.style.removeProperty('pointer-events');

          // Remove the handlers of mousemove and mouseup
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
      };

      // Attach the handler
      resizer.addEventListener('mousedown', mouseDownHandler);
  };

  // Query all resizers
  document.querySelectorAll('.resizer').forEach(function (ele) {
      resizable(ele);
  });
});