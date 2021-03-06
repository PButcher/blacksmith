// Load Blacksmith modules
var tree = require('./lib/treeView');
var openFile = require('./lib/openFile');
var fileManager = require('./lib/fileManager');
var paneManager = require('./lib/paneManager');
var annotator = require('./lib/annotator');

// exports
exports.tree = tree.TreeView;
exports.file = openFile.File;
exports.fileManager = fileManager.FileManager;
exports.paneManager = paneManager.PaneManager;
exports.annotator = annotator.Annotator;
