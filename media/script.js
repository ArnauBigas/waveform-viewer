var toggler = document.getElementsByClassName("caret");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].parentElement.addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.querySelector(".caret").classList.toggle("caret-down");
  });
} 

var hierarchy = document.getElementById('module-hierarchy');

for (const item of hierarchy.getElementsByClassName('hierarchy_element')) {
  item.onclick = function(event) {  
    if (event.ctrlKey || event.metaKey) {
      toggleSelect(item);
    } else {
      singleSelect(item);
    }
  
  };
}

// prevent unneeded selection of list elements on clicks
hierarchy.onmousedown = function() {
  return false;
};

function toggleSelect(item) {
  item.classList.toggle('selected');
}

function singleSelect(item) {
  let selected = hierarchy.querySelectorAll('.selected');
  for(let elem of selected) {
    elem.classList.remove('selected');
  }
  item.classList.add('selected');
}

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