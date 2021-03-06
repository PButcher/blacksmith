// + fileManager
// Manages the displaying of files
function FileManager() {
  this.files = [];
}

// + open
// Open a file from the file system
//    filepath   : path to file
FileManager.prototype.open = function(filepath) {
  if(!this.fileAlreadyOpen(filepath)) {
    return this.storeFile(filepath);
  }
}

// + fileAlreadyOpen
// Is file at this filepath already open?
//    filepath    : filepath of file
FileManager.prototype.fileAlreadyOpen = function(filepath) {
  var numberOfFiles = this.getNumberOfFiles();
  for(var i = 0; i < numberOfFiles; i++) {
    if(this.getFilepath(i) == filepath) {
      return true;
    }
  }
  return false;
}

// + close
// Close a file
//    fid     : File ID
FileManager.prototype.close = function(fid) {
  this.removeFile(fid);
  return fid;
}

// + storeFile
// Store file to file array
//    filepath   : Path to file
FileManager.prototype.storeFile = function(filepath) {
  this.files.push(new blacksmith.file(filepath));
  return this.getNumberOfFiles() - 1;
}

// + removeFile
// Remove file from file array
//    fid     : File ID
FileManager.prototype.removeFile = function(fid) {
  this.files[fid] = 0;
}

// + getNumberOfFiles
// Get the number of files in the file array
FileManager.prototype.getNumberOfFiles = function() {
  return this.files.length;
}

// + getFile
// Return specified file from file array
//    fid     : File ID
FileManager.prototype.getFile = function(fid) {
  return this.files[fid];
}

// + getFilename
// Return filename of specified file
//    fid     : File ID
FileManager.prototype.getFilename = function(fid) {
  return this.files[fid].fileName;
}

// + getFilepath
// Return filepath of specified file
//    fid     : File ID
FileManager.prototype.getFilepath = function(fid) {
  return this.files[fid].filePath;
}

// + getFiletype
// Return filetype of specified file
//    fid     : File ID
FileManager.prototype.getFiletype = function(fid) {
  return this.files[fid].fileType;
}

// + getAllFiles
// Return file array
FileManager.prototype.getAllFiles = function() {
  return this.files;
}

// exports
exports.FileManager = FileManager;
