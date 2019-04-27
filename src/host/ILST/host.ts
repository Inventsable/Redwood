console.log('Host script is online')
// var doc = app.activeDocument;
// var exist = ;
// var app.selection.length > 0 = app.selection.length > 0;

// thanks @parziphal
// https://forums.adobe.com/message/8665657#8665657
function mkdir(path) {
  var folder = new Folder(path);
  if (!folder.exists) {
    var parts = path.split('/');
    parts.pop();
    mkdir(parts.join('/'));
    folder.create();
  }
}


function thisDoc() {
  return app.activeDocument.fullName;
}
function saveDoc(dest) {
  if (app.documents.length > 0) {
    var aiDoc = new File(dest);
    var saveOptions = new IllustratorSaveOptions();
    if (app.selection.length > 0)
      app.activeDocument.exportSelectionAsAi(aiDoc);
    else
      app.activeDocument.saveAs(aiDoc, saveOptions);
  }
}
function openDoc(path) {
  app.open(new File(path));
}
function setOptionsForSVGExport() {
  var options = new ExportOptionsWebOptimizedSVG();
  options.artboardRange = 1;
  options.coordinatePrecision = 2;
  options.fontType = SVGFontType.OUTLINEFONT;
  options.svgId = SVGIdType.SVGIDREGULAR;
  options.cssProperties = SVGCSSPropertyLocation.STYLEELEMENTS;
  return options;
}
function exportSVG(path) {
  var thisFile = new File(path);
  var type = ExportType.WOSVG;
  app.activeDocument.exportFile(thisFile, type, setOptionsForSVGExport());
}
function exporter(dest) {
  if (/\.svg$/gm.test(dest)) {
    exportSVG(dest);
  }
  else if (/\.(png|jpeg|psd|eps|gif|tiff)$/gm.test(dest)) {
    exportAs(dest);
  }
  else {
    alert('Unsupported file format');
  }
}
function setOptionsForPNG24Export() {
  var options = new ExportOptionsWebOptimizedSVG();
  return options;
}
function runScript(path) {
  try {
    $.evalFile(path);
  } catch (e) {
    JSXEvent(e.name + "," + e.line + "," + e + "," + e.message, "console");
  }
}
function exportAs(path) {
  var thisFile = new File(path);
  if (/\.png$/gm.test(path)) {
    if (app.selection.length > 0)
      app.activeDocument.exportSelectionAsPNG(thisFile);
    else
      app.activeDocument.exportFile(thisFile, ExportType.PNG24);
  }
  else if (/\.psd$/gm.test(path)) {
    app.activeDocument.exportFile(thisFile, ExportType.PHOTOSHOP);
  }
  else {
    var ext = /\.(\w*)$/gm;
    var result = path.match(ext);
    result = result[0];
    try {
      // app.activeDocument.exportFile(thisFile, ExportType[result])
      alert('Export as ' + result);
    }
    catch (e) {
      alert(e);
    }
  }
}
