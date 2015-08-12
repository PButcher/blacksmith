// Testing?
var testing = true;

// Load JQuery
window.$ = window.jQuery = require('./vendor/jquery/dist/jquery.min.js');

// Load Blacksmith
var blacksmith = require('./js/blacksmith.js');

// Blacksmith views
var views = [
  'entry',
  'main'
];

// File manager
var fm = new blacksmith.fileManager();

// Pane manager
var pm = new blacksmith.paneManager();

$(window).resize(function() {
  resizeTabs();
});

// jQuery magic happens here
$('document').ready(function() {

  // Set program entry point
  if(testing) {
    view('main');
  } else {
    view('entry');
  }

  // Set up views
  setupEntry();
  setupMain();
});

// + view
// View transitioner
//    view    : View to transition to
function view(view) {
  views.forEach(function(el, i, arr) {
    $('#view-' + el).hide();
  });
  $('#view-' + view).show();
}

// + setupEntry
// Set up entry view
function setupEntry() {

  // Sign in
  $('#sign-in').click(function() {

    // Do login
    view('main');
  });

  // Populate footer
  $('footer').html('Built with io.js ' + process.version +
    ' & Electron ' + process.versions['electron']);
}

// + setupMain
// Set up main view
function setupMain() {
  setupMenu();
  setupTreeView();
  setupTreeViewListeners();

  // Add initial pane
  pm.registerPane();
  pm.renderPane();
}

// + setupMenu
// Set up menu items
function setupMenu() {

  // Pane toggle
  $('#btn-toggle-pane').click(function() {
    pm.togglePane();
    resizeTabs();
    console.log("Button: Toggle panes");
  });

  // Sign out
  $('#btn-sign-out').click(function() {

    // Do something
    console.log("Button: Sign out");
  });
}

// + setupTreeView
// Generates and renders tree view
function setupTreeView() {
  var tree = new blacksmith.tree();
  tree.anchor = '#tree-view';
  tree.ommit = ['.git', '.sass-cache', 'node_modules', 'vendor'];
  tree.render();
}

// + setupTreeViewListeners
// Any interaction events with the tree-view
function setupTreeViewListeners() {

  // When a file in treeView is clicked
  $('.bs-file').click(function() {
    openFile($(this).attr('data-path'));
    resizeTabs();
  });
}

// + resizeTabs
// Resize pane tabs so they do not overflow
function resizeTabs() {

  // Get values for tab scaling BEFORE change
  var defaultTabWidth = 150;
  var numberOfTabs = pm.getNumberOfTabs(0);
  var paneWidth = $('.code-pane').width();
  var w = Math.floor(100 / numberOfTabs);
  var tabs = $('#code-pane-0 .code-tab');
  var tabText = $('#code-pane-0 .code-tab span');
  tabText.css("width", "auto");
  var tabsWidth;
  var tabTextWidth;

  // If the tabs won't all fit...
  if((numberOfTabs * defaultTabWidth) >= paneWidth) {
    w = w.toString() + "%";
    tabs.css("width", w);

    // Update values for tab scaling AFTER change
    tabs = $('#code-pane-0 .code-tab');
    tabText = $('#code-pane-0 .code-tab span');
    tabsWidth = tabs.outerWidth();
    tabTextWidth = tabsWidth - 55;
    tabText.css("width", tabTextWidth);
  } else {
    tabs.css("width", defaultTabWidth);
  }
}

// + openFile
// Tries to open the specified file
function openFile(filepath) {

  // Open file
  var fid = fm.open(filepath);
  var file = fm.getFile(fid);

  // If the file exists
  if(fid != undefined) {

    // Create a new tab if this file has not already been opened
    pm.registerTab(fid, file);
    pm.renderTab(fid, file);

    // Add event listeners to tab
    addTabEventListeners(fid);

    // Mark this tab as active
    tabActive(fid);

    // Log opened file
    console.log("Opened: " + fm.getFilename(fid));

  // Switch to this file if it is already open
  } else {
    fm.files.forEach(function(el, i, arr) {
      if(fm.getFilepath(i) == filepath) tabActive(i);
    });
  }
}

// + closeFile
// Tries to close the specified file
function closeFile(fid) {

  // Close file
  fm.close(fid);

  // Remove tab
  pm.unregisterTab(fid)
  pm.removeTab(fid);

  // If this tab is active, switch to next active tab
  if(pm.getTabInFocus().fid == fid) {
    fm.getAllFiles().forEach(function(el, i, arr) {
      if(fm.getFile(i) != 0) tabActive(i);
    });
  }

  // If the last open file was closed
  if(pm.getNumberOfTabs() == 0) {
    clearStatusBar();
    clearTitle();
  }
}

// + highlightLine
// Highlight a line of a code block
function highlightLine(fid, line) {
  $('#body-' + fid + ' pre').attr('data-line', line);
  Prism.highlightAll();
}

// + addTabEventListeners
// Add event listeners to tab components
//    fid     : file id
function addTabEventListeners(fid) {

  // When the tab close icon is clicked
  $('#tab-' + fid + ' i').click(function() {
    closeFile(fid);
    resizeTabs();
  });

  // When the tab itself is clicked
  $('#tab-' + fid).click(function() {
    resizeTabs();
    tabActive(fid);
  });
}

// + tabSelected
// Things to do when a tab is active
//    fid       : file id
function tabActive(fid) {

  // Set active tab
  pm.setActiveTab(fid);

  // Update title bar
  updateTitle(fm.getFilename(fid));

  // Build string for status bar
  var statusString = fm.getFilename(fid) +
    ' - ' +
    fm.getFilepath(fid) +
    ' [' +
    fm.getFiletype(fid) +
    ']';

  // Update status bar string
  updateStatusBar(statusString);
}

// + updateStatusBar
// Updates status bar
//    text     : text to add to status bar
function updateStatusBar(text) {
  $('#status-bar').html(text);
}

// + clearStatusBar
// Clear status bar
function clearStatusBar() {
  $('#status-bar').html('');
}

// + updateTitle
// Updates window title
//    text     : text to add to title
function updateTitle(text) {
  $('title').html("Blacksmith - " + text);
}

// + clearTitle
// Clear title
function clearTitle() {
  $('title').html("Blacksmith");
}
