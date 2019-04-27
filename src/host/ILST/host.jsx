console.log('Host script is online');
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
function addText(contents) {
    var err = 0;
    if (app.selection.length) {
        for (var i = 0; i < app.activeDocument.textFrames.length; i++) {
            var textItem = app.activeDocument.textFrames[i];
            if (textItem.selected) {
                err++;
                textItem.contents = contents;
            }
        }
    }
    if (err < 1) {
        var newText = app.activeDocument.textFrames.add();
        newText.contents = contents;
    }
}
function addImage(path) {
    var file = new File(path);
    var imagePlace = app.activeDocument.activeLayer.placedItems.add();
    imagePlace.file = file;
}
function addSVG(path, name) {
    var file = new File(path);
    var groupItem = app.activeDocument.groupItems.createFromFile(file);
    groupItem.name = name;
    // Spawns with empty Group child object
    for (var i = 0; i < groupItem.groupItems.length; i++) {
        var item = groupItem.groupItems[i];
        if (!item.pageItems.length) {
            item.remove();
        }
    }
    console.log(groupItem);
}
function thisDoc() {
    if (app.documents.length > 0)
        return app.activeDocument.fullName;
    else
        return false;
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
function quickExportSVG(path) {
    if (!/\/|\\$/.test(path))
        path += '\/';
    var name = app.activeDocument.name.replace(/\.[\w]*/, '.svg');
    var thisFile = new File(path + name);
    var type = ExportType.WOSVG;
    app.activeDocument.exportFile(thisFile, type, setOptionsForSVGExport());
}
function quickExportImage(dest) {
    if (/\.(png|jpeg|psd|eps|gif|tiff)$/gm.test(dest)) {
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
    }
    catch (e) {
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
