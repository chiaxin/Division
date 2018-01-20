// ----------------------------------------------------------------------------
//    Photoshop Script (JavaScript)    
//
//    Division (Distribute image form Photoshop groups utility) 
//
//    Usage : 
//          This script could be save each group(LayerSet) to a image
//          on Adobe Photoshop for CG Texture Artists.
//
//    Author : Chia Xin Lin
//
//    Copyright (c) 2018 Chia Xin Lin <nnnight@gmail.com>
//
//    Create date : Sep, 17, 2014 (First build)
//
//    Version : 1.2.0
//
//    Last update : January, 19, 2018
//
//    Test and Debug Platform : 
//    [ OS ] Microsoft Windows 7 x64
//           Microsoft Windows 10
//    [ Photoshop ] Adobe Photoshop CS6 v13.0.1 x64
// ----------------------------------------------------------------------------
//
var COLOR_PROFILE_EMBED     = false                 ; // The Color-profile embed or not.
var ALPHA_CHANNEL_KEEP      = false                 ; // The Alpha channel keep or not.
var EXTENSION_CASE          = Extension.LOWERCASE   ; // File extension is uppercase or lowercase? 
var SAVE_PATHS              = getSavePathProc()     ; // Get all path(s) need to save.
var SAVE_PATH               = SAVE_PATHS[0]         ; // Default save path.
var UI_TITLE                = "Division by Chiaxin "; // Window title.
var SCRIPT_VER              = "v1.2.0"              ; // Version.
var ENDING_WAIT             = 240                   ; //

// Low Resolution
var LOWRES_SUFFIX           = ".lowres"             ; // Low Resolution name suffix.
var LOWRES_RATIO            = 4                     ; // How many ratio to reduce? 

// TIFF Format
var TIFF_BYTEODER        = ByteOrder.IBM            ; //TIFF format byte order.
var TIFFCOMPRESSENCODING = TIFFEncoding.TIFFLZW     ; //TIFFEncoding.TIFFZIP , TIFFEncoding.TIFFLZW.

// JPEG Format
var JPEG_FORMAT = FormatOptions.STANDARDBASELINE    ; // JPEG format.
var JPEGSAVEQUALITY         = 12                    ; // JPEG compression quality.
var JPEG_MATTETYPE          = MatteType.SEMIGRAY    ; // JPEG matte type.

// TGA Format
var TGA_PERPIXELS = TargaBitsPerPixels.TWENTYFOUR   ; // TGA format (24 bits).

// The log file would be pre-reading, If not exists, it will try to bulid a new file.
var SCRIPT_NAME     = "Division.jsx"                        ; // The local script name.
var LOG_NAME        = "DivisionLog.txt"                     ; // The log txt.
var SCRIPT_FOLDER   = $.fileName.replace(SCRIPT_NAME, "")   ; // The script folder.

// Global variables
var gImagePixel     = 72;       // Document's pixel. The default is 72.
var gCompression    = true;     // Compression image option.
var gGrayKeyword    = "";       // The keyword(s) define gray image.
var gNumVisible     = 0;        //
var gLayNumVisible  = 0;        //
var gVersionAppend  = "";       // Indicate the version string suffix.
var gIntervalSymbol = "_";      // Indicate the interval symbol, underscore or dot.
var gExtension      = "tga";    // Image save extension.
var gResizeMode     = 1;        // Image resize mode, 1:original, 2:half, 3:quad.
var gOverlapping    = true;     // Overlapping file or not.
var gLaunchLowres   = false;    // Do generate low resolution image or not.
var gExtensionStore = "tga";    //
var gProcessBreak   = false;    //
var gDisableOutside = false;    // When save, disable outside layer at first.

// GUI text info defined
var TEXT_PATHS      = "path(s)",
    TEXT_FORMAT     = "Format",
    TEXT_COMPRESS   = "Compress",
    TEXT_RESIZE     = "Resize",
    TEXT_ORGSIZE    = "Original",
    TEXT_HALFSIZE   = "Half",
    TEXT_QUADSIZE   = "Quarter",
    TEXT_LOWRES     = "With Low",
    TEXT_DOLOWRES   = "Building low-res image...",
    TEXT_LOWRESDONE = "The low-res image is done!",
    TEXT_OVERLAPPING= "Overlapping",
    TEXT_OVERRIDE   = "Override",
    TEXT_IGNOREE    = "Ignore Exists",
    TEXT_NEWFILE    = "Saving a new image...",
    TEXT_INTERVAL   = "Intervals",
    TEXT_UNDERSCORE = "Underscore",
    TEXT_DISOUTSIDE = "Dis Outside",
    TEXT_DOT        = "Dot",
    TEXT_VERSION    = "Suffixes || Gray Keywords",
    TEXT_EXECUTE    = "Executions",
    TEXT_EXEVIS     = "Visible",
    TEXT_EXEALL     = "All Groups",
    TEXT_CANCEL     = "Cancel",
    TEXT_ADVANCE    = "Advance",
    TEXT_PROCTITLE  = "Processing...",
    TEXT_SAPATH     = "Same as this document",
    TEXT_NOTLAYER   = "Error: This document haven't any layer-set.",
    TEXT_START      = "Process start...",
    TEXT_FEXISTS    = "File exists...Skip.",
    TEXT_FOVERRIDE  = "File exists...Overriding.",
    TEXT_GROUPEMPTY = "is empty...Skip",
    TEXT_DORESIZE   = "Image Resize...",
    TEXT_COMPLETED  = " image(s) saved,",
    TEXT_INVAILDNAME= " invaild, Ignore.",
    TEXT_OVEREIGHT  = "TIFF format only, Because file is not 8 bits",
    TEXT_ANALYSIS   = "Grayscale Analysis...",
    TEXT_DOGRAYSCALE= "Gray conversion is done!",
    TEXT_GRAYSKIP   = "Skip Gray",
    TEXT_GRAYINFO   = "image(s) Grayscale.",
    TEXT_PARENTS    = "[ ",
    TEXT_PARENTE    = " ] ",
    TEXT_NOVISIBLE  = "Do \"Visible\" must have one group visible at least!",
    TEXT_ISNOTPSD   = "This document is not a PSD file!",
    HELP_SAVEPATH   = "Please choice a path of list you want to save.",
    HELP_EXTENSION  = "Image format selections, TIF, TGA or JPG",
    HELP_RESIAZE    = "Resize image after saving.",
    HELP_OVERLAPPING= "Overlapping exists file or skip.",
    HELP_INTERVAL   = "Specific interval symbol between main and channel name.",
    HELP_VAGK       = "Append version string, fill grayscale keywords",
    HELP_COMMAND    = "Visible : Only visible group would be save, All-Layers : Save all layers";

// Main process execute
Division();

// Main function
function Division()
{
    // If document is incorrect, terminate process.
    if(!activeDocumentCheck())
    {
        return false;
    }
    
    if(!readingLog()) writeLog();

    if(!SAVE_PATHS) return false; 

    divisionDialog();
}

// Main GUI:
function divisionDialog()
{
    // Main window
    var kGlobalPanelSize  = { width:280, height:46 };
    var kGlobalButtonSize = { width:72 , height:24 };
    var kGlobalEditTextSize = { width:80, height:22 };
    var kGlobalEditTextSize2= { width:150, height:22 };
    var kDialogProperties = {
        maximizeButton:false, minimizeButton:false, borderless:false, resizeable:false
    };
    var dlg = new Window("dialog", UI_TITLE + " " + SCRIPT_VER, undefined, kDialogProperties);
    Window.onClose = function() { delete dlg };

    // Panel display all path(s) ready to save.
    dlg.panelSavePaths = dlg.add("panel", undefined);
    dlg.panelSavePaths.size = kGlobalPanelSize;
    dlg.panelSavePaths.alignChild = "left";
    dlg.panelSavePaths.orientation = "column";
    // If we not provide any path(s), It will assume we want to save to same path with document.
    // And if we provide multi path, it will show drop-down-list UI for choose.
    if( SAVE_PATHS.length == 1 && SAVE_PATHS[0] == app.activeDocument.path.fsName ) {
        dlg.panelSavePaths.stA = dlg.panelSavePaths.add("StaticText", undefined);
        dlg.panelSavePaths.stA.text = TEXT_SAPATH;
        SAVE_PATH = SAVE_PATHS[0];
    } else {
        dlg.panelSavePaths.ddlA = dlg.panelSavePaths.add("DropDownList", undefined);
        dlg.panelSavePaths.ddlA.maximumSize = { width:250, height:24 };
        for( i = 0 ; i < SAVE_PATHS.length ; i++ ) {
            dlg.panelSavePaths.ddlA.add( "item", SAVE_PATHS[i] );
        }
        dlg.panelSavePaths.text = i + " " + TEXT_PATHS;
        dlg.panelSavePaths.ddlA.helpTip = HELP_SAVEPATH;
        dlg.panelSavePaths.ddlA.selection = 0;
        dlg.panelSavePaths.ddlA.onChange = function() {
            SAVE_PATH = dlg.panelSavePaths.ddlA.selection.text;
        };
    }

    // Panel output image extension select.
    dlg.panelExtensionOptions = dlg.add("panel", undefined, TEXT_FORMAT);
    dlg.panelExtensionOptions.size = kGlobalPanelSize;
    dlg.panelExtensionOptions.alignChild = "left";
    dlg.panelExtensionOptions.orientation = "row";
    dlg.panelExtensionOptions.helpTip = HELP_EXTENSION;

    // If document is 8 bits/channel should be show 3 formats (tga, tif, jpeg).
    // else if document is 16 or 32 bits/channel, show TIFF format only.
    // (because tga and jpeg is not supported).
    if(app.activeDocument.bitsPerChannel == BitsPerChannelType.EIGHT) {
        dlg.panelExtensionOptions.rbA = dlg.panelExtensionOptions.add("RadioButton", undefined, "TIF");
        dlg.panelExtensionOptions.rbB = dlg.panelExtensionOptions.add("RadioButton", undefined, "TGA");
        dlg.panelExtensionOptions.rbC = dlg.panelExtensionOptions.add("RadioButton", undefined, "JPG");
        switch(gExtension)
        {
        case "tif":
            dlg.panelExtensionOptions.rbA.value = true;
            break;
        case "tga":
            dlg.panelExtensionOptions.rbB.value = true;
            break;
        case "jpg":
            dlg.panelExtensionOptions.rbC.value = true;
            break;
        default:
            dlg.panelExtensionOptions.rbA.value = true;
        }
        dlg.panelExtensionOptions.rbA.onClick = function() {
            gExtension = "tif"; gExtensionStore = gExtension; 
        };
        dlg.panelExtensionOptions.rbB.onClick = function() {
            gExtension = "tga"; gExtensionStore = gExtension; 
        };
        dlg.panelExtensionOptions.rbC.onClick = function() {
            gExtension = "jpg"; gExtensionStore = gExtension;
        };
        gExtensionStore = gExtension;
    } else {
        dlg.panelExtensionOptions.stA = dlg.panelExtensionOptions.add("StaticText", undefined, TEXT_OVEREIGHT);
        gExtensionStore = gExtension;
        gExtension = "tif";
    }

    // Panel resize image options.
    dlg.panelResizeOptions              = dlg.add("panel", undefined, TEXT_RESIZE);
    dlg.panelResizeOptions.helpTip      = HELP_RESIAZE;
    dlg.panelResizeOptions.size         = kGlobalPanelSize;
    dlg.panelResizeOptions.alignChild   = "left";
    dlg.panelResizeOptions.orientation  = "row";
    dlg.panelResizeOptions.rbA          = dlg.panelResizeOptions.add("RadioButton", undefined, TEXT_ORGSIZE);
    dlg.panelResizeOptions.rbB          = dlg.panelResizeOptions.add("RadioButton", undefined, TEXT_HALFSIZE);
    dlg.panelResizeOptions.rbC          = dlg.panelResizeOptions.add("RadioButton", undefined, TEXT_QUADSIZE);
    switch(gResizeMode)
    {
    case 1:
        dlg.panelResizeOptions.rbA.value = true;
        break;
    case 2:
        dlg.panelResizeOptions.rbB.value = true;
        break;
    case 3:
        dlg.panelResizeOptions.rbC.value = true;
        break;
    }
    dlg.panelResizeOptions.rbA.onClick  = function(){ gResizeMode = 1; };
    dlg.panelResizeOptions.rbB.onClick  = function(){ gResizeMode = 2; };
    dlg.panelResizeOptions.rbC.onClick  = function(){ gResizeMode = 3; };

    // Panel overlapping method options.
    dlg.panelOverlappingOptions             = dlg.add("panel", undefined, TEXT_OVERLAPPING);
    dlg.panelOverlappingOptions.helpTip     = HELP_OVERLAPPING;
    dlg.panelOverlappingOptions.size        = kGlobalPanelSize;
    dlg.panelOverlappingOptions.alignChild  = "left";
    dlg.panelOverlappingOptions.orientation = "row";
    dlg.panelOverlappingOptions.rbA         = dlg.panelOverlappingOptions.add("RadioButton", undefined, TEXT_OVERRIDE);
    dlg.panelOverlappingOptions.rbB         = dlg.panelOverlappingOptions.add("RadioButton", undefined, TEXT_IGNOREE);
    dlg.panelOverlappingOptions.rbA.value   = true;
    dlg.panelOverlappingOptions.rbA.onClick = function(){ gOverlapping = true; };
    dlg.panelOverlappingOptions.rbB.onClick = function(){ gOverlapping = false; };

    // Panel specific interval symbol.
    dlg.panelIntervalOptions            = dlg.add("panel", undefined, TEXT_INTERVAL);
    dlg.panelIntervalOptions.helpTip    = HELP_INTERVAL;
    dlg.panelIntervalOptions.size       = kGlobalPanelSize;
    dlg.panelIntervalOptions.alignChild = "center";
    dlg.panelIntervalOptions.orientation= "row";
    dlg.panelIntervalOptions.rbA = dlg.panelIntervalOptions.add("RadioButton", undefined, TEXT_UNDERSCORE);
    dlg.panelIntervalOptions.rbB = dlg.panelIntervalOptions.add("RadioButton", undefined, TEXT_DOT);
    if(gIntervalSymbol==".") {
        dlg.panelIntervalOptions.rbB.value = true;
    } else {
        dlg.panelIntervalOptions.rbA.value = true;
    }
    dlg.panelIntervalOptions.rbA.onClick = function(){ gIntervalSymbol = "_"; };
    dlg.panelIntervalOptions.rbB.onClick = function(){ gIntervalSymbol = "."; };

    // Panel version suffix operation.
    dlg.panelVersionOptions             = dlg.add("panel", undefined, TEXT_VERSION);
    dlg.panelOverlappingOptions.helpTip = HELP_OVERLAPPING;
    dlg.panelVersionOptions.size        = kGlobalPanelSize;
    dlg.panelVersionOptions.alignChild  = "center";
    dlg.panelVersionOptions.orientation = "row";
    dlg.panelVersionOptions.etA = dlg.panelVersionOptions.add("EditText", undefined, gVersionAppend);
    dlg.panelVersionOptions.etA.preferredSize = kGlobalEditTextSize;
    dlg.panelVersionOptions.etB = dlg.panelVersionOptions.add("EditText", undefined, gGrayKeyword);
    dlg.panelVersionOptions.etB.preferredSize = kGlobalEditTextSize2;
    dlg.panelVersionOptions.etA.onChange = function() {
        if(isValidName(dlg.panelVersionOptions.etA.text)) {
            gVersionAppend = dlg.panelVersionOptions.etA.text;
        } else {
            dlg.panelVersionOptions.etA.text = "";
        }
    };
    dlg.panelVersionOptions.etB.onChange = function() {
        if(isValdName(dlg.panelVersionOptions.etB.text)) {
            gGrayKeyword = dlg.panelVersionOptions.etB.text;
        } else {
            dlg.panelVersionOptions.etA.text = "";
        }
    };

    // Main execution button.
    dlg.panelExecution              = dlg.add("panel", undefined, TEXT_EXECUTE);
    dlg.panelExecution.helpTip      = HELP_COMMAND;
    dlg.panelExecution.size         = kGlobalPanelSize;
    dlg.panelExecution.alignChild   = "center";
    dlg.panelExecution.orientation  = "row";
    dlg.panelExecution.btnA         = dlg.panelExecution.add("Button", undefined, TEXT_EXEVIS);
    dlg.panelExecution.btnB         = dlg.panelExecution.add("Button", undefined, TEXT_EXEALL);
    dlg.panelExecution.btnC         = dlg.panelExecution.add("Button", undefined, TEXT_CANCEL);
    dlg.panelExecution.btnA.size    = kGlobalButtonSize;
    dlg.panelExecution.btnB.size    = kGlobalButtonSize;

    // Panel advance options.
    dlg.panelAdvanceOptions             = dlg.add("panel", undefined, TEXT_ADVANCE);
    dlg.panelAdvanceOptions.size        = kGlobalPanelSize;
    dlg.panelAdvanceOptions.alignChild  = "left";
    dlg.panelAdvanceOptions.orientation = "row";
    dlg.panelAdvanceOptions.cbA         = dlg.panelAdvanceOptions.add("CheckBox", undefined, TEXT_DISOUTSIDE);
    dlg.panelAdvanceOptions.cbA.value   = gDisableOutside;
    dlg.panelAdvanceOptions.cbB         = dlg.panelAdvanceOptions.add("CheckBox", undefined, TEXT_COMPRESS);
    dlg.panelAdvanceOptions.cbB.value   = gCompression;
    dlg.panelAdvanceOptions.cbC         = dlg.panelAdvanceOptions.add("CheckBox", undefined, TEXT_LOWRES);
    dlg.panelAdvanceOptions.cbC.value   = gLaunchLowres;
    dlg.panelAdvanceOptions.cbA.onClick = function(){ gDisableOutside = !gDisableOutside; };
    dlg.panelAdvanceOptions.cbB.onClick = function(){ gCompression = !gCompression; };
    dlg.panelAdvanceOptions.cbC.onClick = function(){ gLaunchLowres = !gLaunchLowres; }; 

    // Execute button onClick - Visible layer-set(s) only.
    dlg.panelExecution.btnA.onClick = function () {
        writeLog();
        dlg.close(0);
        delete dlg;
        divisionMainProc(false);
    };

    // Execute button onClick - All layer-set(s).
    dlg.panelExecution.btnB.onClick = function () {
        writeLog();
        dlg.close(0);
        delete dlg;
        divisionMainProc(true);
    };

    // Cancel button onClick.
    dlg.panelExecution.btnC.onClick = function () {
        dlg.close(0);
        delete dlg;
        writeLog();
    }

    dlg.show();
}

// Main function:
function divisionMainProc(outputMode)
{
    var defaultRulerUnits = app.preferences.rulerUnits; // Get now ruler units.
    app.preferences.rulerUnits = Units.PIXELS; // Set ruler to "Pixel".
    var curDoc = app.activeDocument; // Get current document.

    gImagePixel = curDoc.resolution; // Get resolution pixel.

    //Get header name from this document.
    var primaryName = curDoc.name.replace(("."+curDoc.name.split(".").pop()), "");

    // Resize height and width calculation.
    switch(gResizeMode)
    {
    case 1:
        var resizeHeight = curDoc.height;
        var resizeWidth  = curDoc.width;
        break;
    case 2:
        var resizeHeight = Math.floor(curDoc.height/2); //Scale half.
        var resizeWidth  = Math.floor(curDoc.width /2);
        break;
    case 3:
        var resizeHeight = Math.floor(curDoc.height/4); //Scale quad.
        var resizeWidth  = Math.floor(curDoc.width /4);
        break;
    default:
        var resizeHeight = curDoc.height;
        var resizeWidth  = curDoc.width
    }
    var saveOption = getSaveOptions(gExtension);
    var visibleLayerSets = getLayerSetVisible(curDoc);
    var visibleLayers = getLayerVisible(curDoc);

    // If do visible layer-sets only with zero visibility, warning and quit.
    if( !gNumVisible && !outputMode ) {
        alert( TEXT_NOVISIBLE, UI_TITLE + SCRIPT_VER );
        return false;
    }

    var rate_multi = 1;
    if( gResizeMode != 1 ) rate_multi += 1;
    if( gGrayKeyword != "" && curDoc.mode != DocumentMode.GRAYSCALE ) rate_multi += 1;
    if( gLaunchLowres ) rate_multi += 1;

    // If output mode is true ( all output ) rate max is number of layer-sets.
    // else it will be number of visible layer-sets.
    if( outputMode ) {
        var rate = new progressRateBar( curDoc.layerSets.length * rate_multi );
    } else {
        var rate = new progressRateBar( gNumVisible * rate_multi );
    }

    rate.show();
    var numberOfSuccess = 0;
    var numberOfGrayscale = 0;

    if (gDisableOutside)
    {
        for ( i = 0 ; i < curDoc.layers.length ; i++ ) {
            curDoc.layers[i].visible = false;
        }
    }

    // Loop saving each layerSet(s)
    for( i = 0 ; i < curDoc.layerSets.length ; i++ ) {
        var channel_name = curDoc.layerSets[i].name + gVersionAppend;
        if( !isValidName( channel_name ) ) {
            rate.setInfo( channel_name + " " + TEXT_INVAILDNAME );
            rate.plus( rate_multi );
            continue;
        } else if( !visibleLayerSets[i] && !outputMode ) {
            continue;
        } else if( !curDoc.layerSets[i].artLayers.length ) {
            rate.setInfo( TEXT_PARENTS + curDoc.layerSets[i].name + TEXT_PARENTE + TEXT_GROUPEMPTY );
            rate.plus(rate_multi);
            continue;
        }

        // Switch off all layerSets visible without current layerSet index(i)
        for( j = 0 ; j < curDoc.layerSets.length ; j++ ) {
            curDoc.layerSets[j].visible = ( j == i );
        }

        // Prepare file path
        rate.setInfo( TEXT_PARENTS + channel_name + TEXT_PARENTE );
        var fileBuff = new File(
            SAVE_PATH + "/" + primaryName + gIntervalSymbol + channel_name + "." + gExtension
        );

        //If gOverlapping is off and file exists.skip it.
        //Otherwise override it, create new one if not exists.
        if( fileBuff.exists && gOverlapping == false ) {
            rate.setInfo(TEXT_FEXISTS);
            rate.plus(rate_multi);
            continue;
        } else if( fileBuff.exists ) {
            rate.setInfo( TEXT_FOVERRIDE );
        } else {
            rate.setInfo( TEXT_NEWFILE );
        }

        // Try to save image if any unexception error occur, quit this process.
        try {
            curDoc.saveAs(fileBuff, saveOption, true, EXTENSION_CASE);    //Saving image.
            rate.plus(1);
        } catch(e) {
            alert( e, UI_TITLE + " " + SCRIPT_VER );
            delete fileBuff, rate;
            return false;
        }
        numberOfSuccess++; //Success number plus one.

        var openType = getOpenOptions(gExtension);

        //If resize value is 2 or 3 (half and Quad)
        if( gResizeMode != 1 ) {
            rate.setInfo( TEXT_PARENTS + channel_name + TEXT_PARENTE + TEXT_DORESIZE );
            try {
                var workDoc = app.open( fileBuff, openType ); //Open new document.
                app.activeDocument = workDoc; //Setting work document active.
                //Resize image(Half or Quad).
                while( workDoc.height.value != resizeHeight )
                {
                    workDoc.resizeImage( resizeWidth, resizeHeight, gImagePixel );
                }
                workDoc.close(SaveOptions.SAVECHANGES); // Close with save.
                app.activeDocument = curDoc;            // Focus previous document.
            } catch(e) {
                alert(e);
            }
            rate.plus(1);
        }

        if( gGrayKeyword != "" && curDoc.mode != DocumentMode.GRAYSCALE )
        {
            rate.setInfo( channel_name + " -> " + TEXT_ANALYSIS );
            if( isIncludedGrayscale( curDoc.layerSets[i].name ) ) {
                var workDoc = app.open( fileBuff, openType );
                app.activeDocument = workDoc;
                try {
                    workDoc.changeMode(ChangeMode.GRAYSCALE);
                    workDoc.close(SaveOptions.SAVECHANGES);
                    numberOfGrayscale++;
                } catch(e) {
                    alert(e, UI_TITLE+SCRIPT_VER);
                }
                app.activeDocument = curDoc;
                rate.setInfo(TEXT_DOGRAYSCALE);
            } else {
                rate.setInfo( TEXT_GRAYSKIP );
            }
            rate.plus(1);
        }

        // Generate low resolution image after save.
        if( gLaunchLowres )
        {
            rate.setInfo(channel_name + " -> " + TEXT_DOLOWRES);
            lowresFile = new File(
                SAVE_PATH + "/" + primaryName + gIntervalSymbol + channel_name + 
                LOWRES_SUFFIX + "." + gExtension
            );
            var lowresWidth = Math.floor( resizeWidth / LOWRES_RATIO );
            var lowresHeight= Math.floor( resizeHeight/ LOWRES_RATIO );
            var workDoc = app.open( fileBuff, openType );
            app.activeDocument = workDoc;
            try {
                workDoc.resizeImage( lowresWidth, lowresHeight, gImagePixel );
                workDoc.saveAs( lowresFile, saveOption, false, EXTENSION_CASE );
                workDoc.close( SaveOptions.DONOTSAVECHANGES );
            } catch(e) {
                alert(e, UI_TITLE + " " + SCRIPT_VER );
            }
            rate.setInfo( channel_name + " -> " + TEXT_LOWRESDONE );
            app.activeDocment = curDoc;
            delete lowresFile;
            rate.plus(1);
        }
        delete fileBuff;

        if( gProcessBreak ) {
            alert( "Process has been terminated", UI_TITLE );
            break;
        }
    }
    // Recover original layerSet visible status.
    setLayerSetVisible( curDoc, visibleLayerSets );

    if (gDisableOutside)
    {
        setLayerVisible(curDoc, visibleLayers);
    }

    // Tell user how many images save successfully, then close rate window.
    if( !gProcessBreak )
    {
        var result_report = numberOfSuccess + TEXT_COMPLETED;
        if( gGrayKeyword != "" && curDoc.mode!=DocumentMode.GRAYSCALE ) {
            result_report += (", " + numberOfGrayscale + TEXT_GRAYINFO);
        }
        rate.setInfo( result_report );
        $.sleep(ENDING_WAIT);
        writeLog();
        rate.close();
    }
    delete rate;
    app.preferences.rulerUnits = defaultRulerUnits;
}

// Check Active-Document legal.
function activeDocumentCheck()
{
    try {
        var curDoc = app.activeDocument;
    } catch(e) {
        alert(e, UI_TITLE+SCRIPT_VER);
        return false;
    }
    if (curDoc.name.split(".").pop().toLowerCase() != "psd")
    {
        alert(TEXT_ISNOTPSD, UI_TITLE+SCRIPT_VER);
        return false;
    } 
    try {
        var docPath = curDoc.path;
    } catch(e) {
        alert(e, UI_TITLE+SCRIPT_VER);
        return false;
    }
    if (curDoc.layerSets.length == 0)
    {
        alert(TEXT_NOTLAYER, UI_TITLE+SCRIPT_VER);
        return false;
    }
    return true;
}

function getSavePathProc()
{
    // Get this document all artLayers
    var docLayers = app.activeDocument.artLayers;
    var path = null;
    var workPaths = [];
    var pathIsDuplicated = false;

    // Loop for search text-layers
    for(i=0 ; i<docLayers.length ; i++)
    {
        // Reset pathIsDuplicated notation
        pathIsDuplicated = false;
        if(docLayers[i].kind == LayerKind.TEXT)
        {
            // Check previous others if duplicated
            for(j=workPaths.length-1 ; j>=0 ; j--)
            {
                if(docLayers[i].textItem.contents == workPaths[j])
                {
                    pathIsDuplicated = true;
                    break;
                }
            }
            if(pathIsDuplicated) // If duplicated then skip.
                continue;
            var path = new Folder(docLayers[i].textItem.contents);
            if(path.exists)
            {
                workPaths.push(docLayers[i].textItem.contents);
            }
        }
    }
    delete path;
    // If not any paths to work, let only path is same as PSD.
    if(workPaths.length == 0)
    {
        workPaths.push(app.activeDocument.path.fsName);
    }
    return workPaths;
}

function readingLog()
{
    var log = new File(SCRIPT_FOLDER+LOG_NAME);
    if(!log.exists) return false;
    var contents = "";
    var value = "";
    log.open("r");
    while(!log.eof){
        contents = log.readln();
        contents = contents.split("=");
        value = contents[1].replace(" ","");
        switch(contents[0].replace(" ",""))
        {
        case "images_extension":
            if (value=="tif" || value=="tga" || value=="jpg")
                gExtension = value;
            else 
                gExtension = "tga";
            break;
        case "images_compression":
            if (value=="false" || value=="0")
                gCompression = false;
            else
                gCompression = true;
            break;
        case "extra_lowres":
            if (value=="true" || value=="1")
                gLaunchLowres = true;
            else
                gLaunchLowres = false;
        case "interval_symbol":
            if (value=="_" || value==".")
                gIntervalSymbol = value;
            else
                gIntervalSymbol = "_";
            break;
        case "version_operate":
            if (isValidName(value))
                gVersionAppend = value;
            else
                gVersionAppend = "";
            break;
        case "grayscale_keywords":
            if (isValidName(value))
                gGrayKeyword = value;
            else
                gGrayKeyword = "";
            break;
        case "resize_mode":
            if (value == "1")
                gResizeMode = 1;
            else if (value == "2")
                gResizeMode = 2;
            else if (value == "3")
                gResizeMode = 3
            break;
        case "disable_outside":
            if (value == "true" || value == "1")
                gDisableOutside = true
            else
                gDisableOutside = false;
            break;
        }
    }
    log.close(); 
    delete log;
    return true;
}

function writeLog()
{
    var log = new File(SCRIPT_FOLDER + LOG_NAME);
    try {
        log.open('w');
        if(gExtensionStore != gExtension)
            log.writeln("images_extension = " + gExtensionStore);
        else
            log.writeln("images_extension = " + gExtension);
        log.writeln("extra_lowres = " + gLaunchLowres);
        log.writeln("images_compression = " + gCompression);
        log.writeln("interval_symbol = " + gIntervalSymbol);
        log.writeln("version_operate = " + gVersionAppend);
        log.writeln("grayscale_keywords = " + gGrayKeyword);
        log.writeln("resize_mode = " + gResizeMode);
        log.writeln("disable_outside = " + gDisableOutside);
        log.close();
    } catch(e) {
        alert(e, UI_TITLE + SCRIPT_VER);
        return false;
    }
    delete log;
    return true;
}

function getLayerSetVisible(workDoc)
{
    gNumVisible = 0;
    var visibleLayerSets = [];
    for ( i = 0 ; i < workDoc.layerSets.length ; i++ ) {
        visibleLayerSets.push(workDoc.layerSets[i].visible);
        if(visibleLayerSets[i]) gNumVisible++;
    }
    return visibleLayerSets;
}

function getLayerVisible(workDoc)
{
    gLayNumVisible = 0;
    var visibleLayers = [];
    for ( i=0 ; i < workDoc.layers.length ; i++ ) {
        visibleLayers.push(workDoc.layers[i].visible);
        if (visibleLayers[i]) gLayNumVisible++;
    }
    return visibleLayers;
}

function setLayerSetVisible(workDoc, visible)
{
    for ( i = 0 ; i < workDoc.layerSets.length ; i++)
    {
        workDoc.layerSets[i].visible = visible[i];
    }
}

function setLayerVisible(workDoc, visible)
{
    for (i=0 ; i<workDoc.layers.length ; i++)
    {
        workDoc.layers[i].visible = visible[i];
    }
}

function getSaveOptions(extension)
{
    switch(extension)
    {
    case "tif":
        var saveOptions = TiffSaveOptions;
        saveOptions.alphaChannels = ALPHA_CHANNEL_KEEP;
        saveOptions.byteOrder = TIFF_BYTEODER;
        saveOptions.embedColorProfile= COLOR_PROFILE_EMBED;
        saveOptions.layers = false;
        if(gCompression)
            saveOptions.imageCompression = TIFFCOMPRESSENCODING;
        else
            saveOptions.imageCompression = TIFFEncoding.NONE;
        break;
    case "tga":
        var saveOptions = TargaSaveOptions;
        saveOptions.alphaChannels  = ALPHA_CHANNEL_KEEP;
        saveOptions.embedColorProfile = COLOR_PROFILE_EMBED;
        saveOptions.resolution = TGA_PERPIXELS;
        saveOptions.rleCOMPRESS_DEFAULT = gCompression;
        break;
    case "jpg":
        var saveOptions = JPEGSaveOptions;
        saveOptions.alphaChannels = ALPHA_CHANNEL_KEEP;
        saveOptions.embedColorProfile= COLOR_PROFILE_EMBED;
        saveOptions.matte = JPEG_MATTETYPE;
        saveOptions.quality = JPEGSAVEQUALITY;
        saveOptions.scans = JPEG_FORMAT;
        break;
    }
    return saveOptions;
}

function getOpenOptions(extension)
{
    switch(extension)
    {
    case "tif":
        var openType = OpenDocumentType.TIFF;
        break;
    case "tga":
        var openType = OpenDocumentType.TARGA;
        break;
    case "jpg":
        var openType = OpenDocumentType.JPEG;
        break;
    default:
        var openType = OpenDocumentType.TARGA;
    }
    return openType;
}

function isValidName(name)
{
    var invaildWords = new RegExp("[\\/:\"\*\?<>|]+");
    return (!invaildWords.test(name));
}

function isIncludedGrayscale(channel)
{
    var keywords = gGrayKeyword.split(" ");
    for( keyword_index in keywords)
    {
        if(channel == keywords[keyword_index])
            return true;
    }
    return false;
}

function progressRateBar(max)
{
    var properties = { maximizeButton:false, minimizeButton:false, borderless:false, resizeable:false };
    this.pr = new Window("window", TEXT_PROCTITLE, undefined, properties);
    this.pr.active = true;
    this.pr.orientation = "column";
    this.pr.plane = this.pr.add("panel");
    this.pr.plane.size = { width:280, height:120 };
    this.pr.plane.alignChild = "column";
    this.pr.plane.info = this.pr.plane.add("staticText", undefined, TEXT_START);
    this.pr.plane.info.minimumSize = {width:240, height:28};
    this.pr.plane.rate = this.pr.plane.add("Progressbar", undefined);
    this.pr.plane.rate.size = {width:240, height:16};
    this.pr.plane.rate.maxvalue = max;

    this.pr.onClose = function(){ 
        gProcessBreak = true;
    };

    // Methods
    this.setInfo = function(text)
    {
        this.pr.plane.info.text = text;
        app.refresh();
    }
    this.plus = function(step)
    {
        this.pr.plane.rate.value += step;
    }
    this.show = function()
    {
        this.pr.show();
    }
    this.close = function()
    {
        this.pr.close(0);
        delete this.pr;
    }
}
