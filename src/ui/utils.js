const blessed = require('blessed');

function makeRow(gutter = 0, ...els) {
  els.forEach((v, idx) => {
    v.left = idx ? els[idx - 1].left + els[idx - 1].width + gutter : 0;
  })
}

module.exports = {}