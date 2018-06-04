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
//    Version : 1.5.0
//
//    Last update : 2018-06-03
//
//    Test and Debug Platform : 
//    + OS 
//      + Microsoft Windows 7 x64
//      + Microsoft Windows 10
//    + Photoshop 
//      + Adobe Photoshop CS6
//      + Adobe Photoshop CC 2014
//      + Adobe Photoshop CC 2015
//      + Adobe Photoshop CC 2015.5
//      + Adobe Photoshop CC 2017
// ----------------------------------------------------------------------------
//
const COLOR_PROFILE_EMBED     = false                 ; // The Color-profile embed or not.
const ALPHA_CHANNEL_KEEP      = false                 ; // The Alpha channel keep or not.
const EXTENSION_CASE          = Extension.LOWERCASE   ; // File extension is uppercase or lowercase? 
const UI_TITLE                = "Division by Chiaxin "; // Window title.
const SCRIPT_VER              = "v1.5.0"            ; // Version.
const ENDING_WAIT             = 240                   ; //

// Low Resolution
const LOW_SUFFIX              = ".low"                ; // Low Resolution name suffix.
const LOW_RATIO               = 4                     ; // How many ratio to reduce? 

// TIFF Format
const TIFF_BYTE_ORDER         = ByteOrder.IBM         ; // TIFF format byte order.
const TIFF_COMP_ENCODING      = TIFFEncoding.TIFFLZW  ; // TIFFEncoding.TIFFZIP , TIFFEncoding.TIFFLZW.

// JPEG Format
const JPEG_FORMAT = FormatOptions.STANDARDBASELINE    ; // JPEG format.
const JPEG_SAVE_QUALITY       = 12                    ; // JPEG compression quality.
const JPEG_MATTE_TYPE         = MatteType.SEMIGRAY    ; // JPEG matte type.

// Resample method
const RESAMPLE_METHOD = ResampleMethod.BICUBIC;

// TGA Format
const TGA_PER_PIXELS = TargaBitsPerPixels.TWENTYFOUR  ; // TGA format (24 bits).

// The log file would be pre-reading, If not exists, it will try to build a new file.
const SCRIPT_NAME     = "Division.jsx"                ; // The local script name.
const LOG_NAME        = "DivisionLog.txt"             ; // The log txt.
const SCRIPT_FOLDER   = File($.fileName).path         ; // The script folder.

// Global variables
var gSavePaths      = [];       // Get all path(s) need to save.
var gDefaultSavePath= "";       // Default save path.
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
var gLaunchLow      = false;    // Do generate low resolution image or not.
var gExtensionStore = "tga";    //
var gProcessBreak   = false;    //
var gDisableOutside = false;    // When save, disable outside layer at first.
var gAutoGenerateTx = false;    // Make tx image after texture saved.
var gConvertDds     = false;    // Convert dds after texture saved.
var gRemoveExif     = false;    // Remove exif information after texture saved.

// GUI text info defined
const   TEXT_PATHS      = "path(s)",
        TEXT_FORMAT     = "Format",
        TEXT_COMPRESS   = "Compress",
        TEXT_RESIZE     = "Resize",
        TEXT_ORG_SIZE   = "Original",
        TEXT_HALF_SIZE  = "Half",
        TEXT_QUARTER_SIZE = "Quarter",
        TEXT_WITH_LOW   = "Gen Low",
        TEXT_BUILD_LOW  = "Building lowest resolution...",
        TEXT_LOW_DONE   = "The lowest res image is done!",
        TEXT_OVERLAPPING= "Overlapping",
        TEXT_OVERRIDE   = "Override",
        TEXT_IGNORE_EXISTS = "Ignore Exists",
        TEXT_NEW_FILE   = "Saving a new image...",
        TEXT_INTERVAL   = "Intervals",
        TEXT_UNDERSCORE = "Underscore",
        TEXT_MAKETX     = "TX",
        TEXT_MAKEDDS    = "DDS",
        TEXT_RMEXIF     = "Remove Exif",
        TEXT_EXIF_INFO  = "Exif Information",
        TEXT_DISABLE_OUTSIDE = "Hide Outsd",
        TEXT_DOT        = "Dot",
        TEXT_VERSION    = "Suffixes ----- Grayscale Keywords",
        TEXT_EXECUTE    = "Executions",
        TEXT_EXECUTE_VISIBLE = "Visible",
        TEXT_EXECUTE_ALL = "All Groups",
        TEXT_CANCEL     = "Cancel",
        TEXT_ADVANCE    = "Advance",
        TEXT_PROCESSING = "Processing...",
        TEXT_SAME_AS    = "Same as this document",
        TEXT_NO_LAYER   = "Error: This document haven't any layer-set.",
        TEXT_START      = "Process start...",
        TEXT_FILE_EXISTS = "File exists...Skip.",
        TEXT_DO_OVERRIDE = "File exists...Overriding.",
        TEXT_EMPTY_SKIP = "is empty...Skip",
        TEXT_DO_RESIZE  = "Image Resize...",
        TEXT_COMPLETED  = " image(s) saved",
        TEXT_INVALID_NAME = " invalid, Ignore.",
        TEXT_TIFF_ONLY  = "TIFF format only, Because file is not 8 bits",
        TEXT_ANALYSIS   = "Grayscale Analysis...",
        TEXT_DO_GRAY    = "Gray conversion is done!",
        TEXT_SKIP_GRAY  = "Skip Gray",
        TEXT_GRAY_INFO  = "image(s) Grayscale.",
        TEXT_PARENT_START = "[ ",
        TEXT_PARENT_END = " ] ",
        TEXT_NO_ANY_VISIBLE = "Do \"Visible\" must have one group visible at least!",
        TEXT_IS_NOT_PSD = "This document is not a PSD file!",
        TEXT_NO_DOCUMENTS = "There have no any document!",
        TEXT_PROC_TERM  = "Process has been terminated",
        TEXT_MAKETX_PROC= "Make tx process...",
        TEXT_CONVDDS_PRO= "Convert dds process...",
        TEXT_MAKETX_NF  = "maketx.jsx was not found.",
        TEXT_CONVDDS_NF = "makedds.jsx was not found.",
        TEXT_RMEXIF_PROC= "Remove EXIF process...",
        TEXT_EXIFUT_NF  = "exifutil.jsx was not found.",
        HELP_SAVE_PATH  = "Please choice a path of list you want to save.",
        HELP_EXTENSION  = "Image formats, TIF, TGA or JPG. Make tx is optional.",
        HELP_RESIZE     = "Resize image after saving.",
        HELP_OVERLAPPING= "Overlapping exists file or skip.",
        HELP_INTERVAL   = "Specific interval symbol between main and group name.",
        HELP_SUFFIXES   = "For the output images's suffix words.",
        HELP_GRAYKEYWRD = "If keyword matched, It will convert grayscale after. sperate them by space.",
        HELP_COMMAND    = "Visible : Only visible group would be save, All-Layers : Save all layers.",
        HELP_EXEC_VIS   = "Only visible groups would be save.",
        HELP_EXEC_ALL   = "Save all layers.",
        HELP_MAKE_TX    = "Auto generate arnold tx format image.",
        HELP_CONV_DDS   = "Convert DDS format after."
        HELP_RMEXIF     = "Remove EXIF information."
        HELP_HIDE_OUTSD = "Hide outside layers before.",
        HELP_COMPRESS   = "Compression image format.",
        HELP_GEN_LOW    = "Auto generate a lowest version image additional.";

// Main process execute
division();

// Main function
function division()
{
    // If document is incorrect, terminate process.
    if(!activeDocumentCheck()) {
        return false;
    }
    gSavePaths = getSavePathProc(); // Get all path(s) need to save.
    gDefaultSavePath = gSavePaths[0]; // Default save path.
    
    if(readingLog() === false) writeLog();

    if(!gSavePaths) return false; 

    divisionDialog();
}

// Main GUI:
function divisionDialog()
{
    // Main window
    var kGlobalPanelSize  = { width:280, height:46 };
    var kGlobalButtonSize = { width:72, height:24 };
    var kGlobalEditTextSize = { width:80, height:22 };
    var kGlobalEditTextSize2= { width:150, height:22 };
    var kDialogProperties = {
        maximizeButton:false, minimizeButton:false, borderless:false, resizeable:false
    };
    var dlg = new Window(
        "dialog", UI_TITLE + " " + SCRIPT_VER, undefined, kDialogProperties
    );
    Window.onClose = function() { delete dlg };

    // Panel display all path(s) ready to save.
    dlg.panelSavePaths = dlg.add("panel", undefined);
    dlg.panelSavePaths.size = kGlobalPanelSize;
    dlg.panelSavePaths.alignChild = "left";
    dlg.panelSavePaths.orientation = "column";
    // If we not provide any path(s), It will assume we want to save to same path with document.
    // And if we provide multi path, it will show drop-down-list UI for choose.
    if (gSavePaths.length == 1 && gSavePaths[0] == app.activeDocument.path.fsName) {
        dlg.panelSavePaths.stA = dlg.panelSavePaths.add("StaticText", undefined);
        dlg.panelSavePaths.stA.text = TEXT_SAME_AS;
        gDefaultSavePath = gSavePaths[0];
    } else {
        dlg.panelSavePaths.ddlA = dlg.panelSavePaths.add("DropDownList", undefined);
        dlg.panelSavePaths.ddlA.maximumSize = { width:250, height:24 };
        for(var i = 0 ; i < gSavePaths.length ; i++) {
            dlg.panelSavePaths.ddlA.add("item", gSavePaths[i]);
        }
        dlg.panelSavePaths.text = i + " " + TEXT_PATHS;
        dlg.panelSavePaths.ddlA.helpTip = HELP_SAVE_PATH;
        dlg.panelSavePaths.ddlA.selection = 0;
        dlg.panelSavePaths.ddlA.onChange = function() {
            gDefaultSavePath = dlg.panelSavePaths.ddlA.selection.text;
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
        dlg.panelExtensionOptions.rbA = dlg.panelExtensionOptions.add(
            "RadioButton", undefined, "TIF"
        );
        dlg.panelExtensionOptions.rbB = dlg.panelExtensionOptions.add(
            "RadioButton", undefined, "TGA"
        );
        dlg.panelExtensionOptions.rbC = dlg.panelExtensionOptions.add(
            "RadioButton", undefined, "JPG"
        );
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
            // Enable remove exif infomation function.
            dlg.panelExifInformation.cbA.enabled = true
        };
        dlg.panelExtensionOptions.rbB.onClick = function() {
            gExtension = "tga"; gExtensionStore = gExtension;
            // Disable remove exif infomation function.
            dlg.panelExifInformation.cbA.enabled = false;
        };
        dlg.panelExtensionOptions.rbC.onClick = function() {
            gExtension = "jpg"; gExtensionStore = gExtension;
            // Disable remove exif infomation function.
            dlg.panelExifInformation.cbA.enabled = false;
        };
        gExtensionStore = gExtension;
    } else {
        dlg.panelExtensionOptions.stA = dlg.panelExtensionOptions.add(
            "StaticText", undefined, TEXT_TIFF_ONLY
        );
        gExtensionStore = gExtension;
        gExtension = "tif";
    }
    dlg.panelExtensionOptions.cbA = dlg.panelExtensionOptions.add(
        "CheckBox", undefined, TEXT_MAKETX
    );
    dlg.panelExtensionOptions.cbA.value = gAutoGenerateTx;
    dlg.panelExtensionOptions.cbA.helpTip = HELP_MAKE_TX;
    dlg.panelExtensionOptions.cbA.onClick = function() {
        gAutoGenerateTx = !gAutoGenerateTx;
    };
    dlg.panelExtensionOptions.cbB = dlg.panelExtensionOptions.add(
        "CheckBox", undefined, TEXT_MAKEDDS
    );
    dlg.panelExtensionOptions.cbB.value = gConvertDds;
    dlg.panelExtensionOptions.cbB.helpTip = HELP_CONV_DDS;
    dlg.panelExtensionOptions.cbB.onClick = function() {
        gConvertDds = !gConvertDds;
    };

    //
    dlg.panelExifInformation = dlg.add("panel", undefined, TEXT_EXIF_INFO);
    dlg.panelExifInformation.size = kGlobalPanelSize;
    dlg.panelExifInformation.alignChild = "left";
    dlg.panelExifInformation.orientation = "row";
    dlg.panelExifInformation.cbA = dlg.panelExifInformation.add(
        "CheckBox", undefined, TEXT_RMEXIF
    );
    dlg.panelExifInformation.cbA.value = gRemoveExif;
    dlg.panelExifInformation.cbA.helpTip = HELP_RMEXIF;
    dlg.panelExifInformation.cbA.onClick = function() {
        gRemoveExif = !gRemoveExif;
    };
    // Disable remove exif function if format is not tif
    if (gExtension != "tif") {
        dlg.panelExifInformation.cbA.enabled = false;
    }

    // Panel resize image options.
    dlg.panelResizeOptions = dlg.add("panel", undefined, TEXT_RESIZE);
    dlg.panelResizeOptions.helpTip = HELP_RESIZE;
    dlg.panelResizeOptions.size = kGlobalPanelSize;
    dlg.panelResizeOptions.alignChild = "left";
    dlg.panelResizeOptions.orientation = "row";
    dlg.panelResizeOptions.rbA = dlg.panelResizeOptions.add(
        "RadioButton", undefined, TEXT_ORG_SIZE
    );
    dlg.panelResizeOptions.rbB = dlg.panelResizeOptions.add(
        "RadioButton", undefined, TEXT_HALF_SIZE
    );
    dlg.panelResizeOptions.rbC = dlg.panelResizeOptions.add(
        "RadioButton", undefined, TEXT_QUARTER_SIZE
    );
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
    dlg.panelResizeOptions.rbA.onClick = function(){ gResizeMode = 1; };
    dlg.panelResizeOptions.rbB.onClick = function(){ gResizeMode = 2; };
    dlg.panelResizeOptions.rbC.onClick = function(){ gResizeMode = 3; };

    // Panel overlapping method options.
    dlg.panelOverlappingOptions = dlg.add("panel", undefined, TEXT_OVERLAPPING);
    dlg.panelOverlappingOptions.helpTip = HELP_OVERLAPPING;
    dlg.panelOverlappingOptions.size = kGlobalPanelSize;
    dlg.panelOverlappingOptions.alignChild = "left";
    dlg.panelOverlappingOptions.orientation = "row";
    dlg.panelOverlappingOptions.rbA = dlg.panelOverlappingOptions.add(
        "RadioButton", undefined, TEXT_OVERRIDE
    );
    dlg.panelOverlappingOptions.rbB = dlg.panelOverlappingOptions.add(
        "RadioButton", undefined, TEXT_IGNORE_EXISTS
    );
    dlg.panelOverlappingOptions.rbA.value = true;
    dlg.panelOverlappingOptions.rbA.onClick = function(){ gOverlapping = true; };
    dlg.panelOverlappingOptions.rbB.onClick = function(){ gOverlapping = false; };

    // Panel specific interval symbol.
    dlg.panelIntervalOptions = dlg.add("panel", undefined, TEXT_INTERVAL);
    dlg.panelIntervalOptions.helpTip = HELP_INTERVAL;
    dlg.panelIntervalOptions.size = kGlobalPanelSize;
    dlg.panelIntervalOptions.alignChild = "center";
    dlg.panelIntervalOptions.orientation= "row";
    dlg.panelIntervalOptions.rbA = dlg.panelIntervalOptions.add(
        "RadioButton", undefined, TEXT_UNDERSCORE
    );
    dlg.panelIntervalOptions.rbB = dlg.panelIntervalOptions.add(
        "RadioButton", undefined, TEXT_DOT
    );
    if(gIntervalSymbol == ".") {
        dlg.panelIntervalOptions.rbB.value = true;
    } else {
        dlg.panelIntervalOptions.rbA.value = true;
    }
    dlg.panelIntervalOptions.rbA.onClick = function(){ gIntervalSymbol = "_"; };
    dlg.panelIntervalOptions.rbB.onClick = function(){ gIntervalSymbol = "."; };

    // Panel version suffix operation.
    dlg.panelVersionOptions = dlg.add("panel", undefined, TEXT_VERSION);
    dlg.panelOverlappingOptions.helpTip = HELP_OVERLAPPING;
    dlg.panelVersionOptions.size = kGlobalPanelSize;
    dlg.panelVersionOptions.alignChild = "center";
    dlg.panelVersionOptions.orientation = "row";
    dlg.panelVersionOptions.etA = dlg.panelVersionOptions.add(
        "EditText", undefined, gVersionAppend
    );
    dlg.panelVersionOptions.etA.preferredSize = kGlobalEditTextSize;
    dlg.panelVersionOptions.etA.helpTip = HELP_SUFFIXES;
    dlg.panelVersionOptions.etB = dlg.panelVersionOptions.add(
        "EditText", undefined, gGrayKeyword
    );
    dlg.panelVersionOptions.etB.preferredSize = kGlobalEditTextSize2;
    dlg.panelVersionOptions.etB.helpTip = HELP_GRAYKEYWRD;
    dlg.panelVersionOptions.etA.onChange = function() {
        if(isValidName(dlg.panelVersionOptions.etA.text)) {
            gVersionAppend = dlg.panelVersionOptions.etA.text;
        } else {
            dlg.panelVersionOptions.etA.text = "";
        }
    };
    dlg.panelVersionOptions.etB.onChange = function() {
        if(isValidName(dlg.panelVersionOptions.etB.text)) {
            gGrayKeyword = dlg.panelVersionOptions.etB.text;
        } else {
            dlg.panelVersionOptions.etA.text = "";
        }
    };

    // Main execution button.
    dlg.panelExecution = dlg.add("panel", undefined, TEXT_EXECUTE);
    dlg.panelExecution.size = kGlobalPanelSize;
    dlg.panelExecution.alignChild = "center";
    dlg.panelExecution.orientation = "row";
    dlg.panelExecution.btnA = dlg.panelExecution.add(
        "Button", undefined, TEXT_EXECUTE_VISIBLE
    );
    dlg.panelExecution.btnA.helpTip = HELP_EXEC_VIS;
    dlg.panelExecution.btnB = dlg.panelExecution.add(
        "Button", undefined, TEXT_EXECUTE_ALL
    );
    dlg.panelExecution.btnB.helpTip = HELP_EXEC_ALL;
    dlg.panelExecution.btnC = dlg.panelExecution.add(
        "Button", undefined, TEXT_CANCEL
    );
    dlg.panelExecution.btnA.size = kGlobalButtonSize;
    dlg.panelExecution.btnB.size = kGlobalButtonSize;

    // Panel advance options.
    dlg.panelAdvanceOptions = dlg.add("panel", undefined, TEXT_ADVANCE);
    dlg.panelAdvanceOptions.size = kGlobalPanelSize;
    dlg.panelAdvanceOptions.alignChild = "left";
    dlg.panelAdvanceOptions.orientation = "row";
    dlg.panelAdvanceOptions.cbA = dlg.panelAdvanceOptions.add(
        "CheckBox", undefined, TEXT_DISABLE_OUTSIDE
    );
    dlg.panelAdvanceOptions.cbA.helpTip = HELP_HIDE_OUTSD;
    dlg.panelAdvanceOptions.cbA.value = gDisableOutside;
    dlg.panelAdvanceOptions.cbB = dlg.panelAdvanceOptions.add(
        "CheckBox", undefined, TEXT_COMPRESS
    );
    dlg.panelAdvanceOptions.cbB.helpTip = HELP_COMPRESS;
    dlg.panelAdvanceOptions.cbB.value = gCompression;
    dlg.panelAdvanceOptions.cbC = dlg.panelAdvanceOptions.add(
        "CheckBox", undefined, TEXT_WITH_LOW
    );
    dlg.panelAdvanceOptions.cbC.helpTip = HELP_GEN_LOW;
    dlg.panelAdvanceOptions.cbC.value = gLaunchLow;
    dlg.panelAdvanceOptions.cbA.onClick = function(){ gDisableOutside = !gDisableOutside; };
    dlg.panelAdvanceOptions.cbB.onClick = function(){ gCompression = !gCompression; };
    dlg.panelAdvanceOptions.cbC.onClick = function(){ gLaunchLow = !gLaunchLow; }; 

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
function divisionMainProc(is_output_all)
{
    // Get now ruler units.
    var default_ruler_units = app.preferences.rulerUnits; 
    // Set ruler to "Pixel".
    app.preferences.rulerUnits = Units.PIXELS; 
    // Get current document.
    var curr_doc = app.activeDocument;
    // Get resolution pixel.
    gImagePixel = curr_doc.resolution;

    //Get main name from this document.
    var main_str = curr_doc.name.replace(("."+curr_doc.name.split(".").pop()), "");

    // Resize height and width calculation.
    switch(gResizeMode)
    {
    case 1:
        var resize_height = curr_doc.height;
        var resize_width  = curr_doc.width;
        break;
    case 2:
        var resize_height = Math.floor(curr_doc.height/2);
        var resize_width  = Math.floor(curr_doc.width /2);
        break;
    case 3:
        var resize_height = Math.floor(curr_doc.height/4);
        var resize_width  = Math.floor(curr_doc.width /4);
        break;
    default:
        var resize_height = curr_doc.height;
        var resize_width  = curr_doc.width
    }

    // Get Photoshop save options.
    var save_option = getSaveOptions(gExtension);
    // Get visible layerSets.
    var visible_layer_sets = getLayerSetVisible(curr_doc);
    // Get visible layers.
    var visible_layers = getLayerVisible(curr_doc);

    // If do visible layerSets only and they are invisible, warning and quit.
    if(gNumVisible === 0 && is_output_all === false) {
        alert(TEXT_NO_ANY_VISIBLE, UI_TITLE + SCRIPT_VER);
        return false;
    }

    // Define rate number.
    var rate_multi = 1;
    if (gResizeMode != 1) rate_multi++;
    if (gGrayKeyword != "" && curr_doc.mode != DocumentMode.GRAYSCALE) rate_multi++;
    if (gLaunchLow) rate_multi++;

    // In output all, rate max is number of layer-sets,
    // Else it will be number of visible layer-sets.
    if (is_output_all === true) {
        var rate = new progressRateBar(curr_doc.layerSets.length * rate_multi);
    } else {
        var rate = new progressRateBar(gNumVisible * rate_multi);
    }

    // Show rate.
    rate.show();
    var number_of_success = 0;
    var number_of_grayscale = 0;

    // If disable outside is on, hide all outside layers.
    if (gDisableOutside)
    {
        for (var i = 0 ; i < curr_doc.layers.length ; i++) {
            curr_doc.layers[i].visible = false;
        }
    }
    
    // Store saved images for maketx and remove exif.
    var saved_images = new Array();

    // Loop for each layerSets.
    for (var i = 0 ; i < curr_doc.layerSets.length ; i++) {
        // The secondary name is layerSet's name with suffix.
        var secondary_str = curr_doc.layerSets[i].name + gVersionAppend;
        if (isValidName(secondary_str) === false) {
            // This secondary name is invalid, ignore.
            rate.setInfo(secondary_str + " " + TEXT_INVALID_NAME);
            rate.plus(rate_multi);
            continue;
        } else if (visible_layer_sets[i] === false && is_output_all === false) {
            // This layerSet is invisible, and is not output all, ignore.
            continue;
        } else if (curr_doc.layerSets[i].artLayers.length === 0) {
            // This layerSet have no any layers, ignore.
            rate.setInfo(
                TEXT_PARENT_START + curr_doc.layerSets[i].name + TEXT_PARENT_END + TEXT_EMPTY_SKIP 
            );
            rate.plus(rate_multi);
            continue;
        }

        // Turn off all layerSets visible without current layerSet index(i).
        for(var j = 0 ; j < curr_doc.layerSets.length ; j++) {
            curr_doc.layerSets[j].visible = ( j == i );
        }

        // Prepare file path
        rate.setInfo(TEXT_PARENT_START + secondary_str + TEXT_PARENT_END);
        var full_export_name = gDefaultSavePath + "/" + main_str + gIntervalSymbol 
                             + secondary_str + "." + gExtension;
        var img_file_fh = new File(full_export_name);

        //If gOverlapping is off and file exists.skip it.
        //Otherwise override it, create new one if not exists.
        if(img_file_fh.exists && gOverlapping == false) {
            rate.setInfo(TEXT_FILE_EXISTS);
            rate.plus(rate_multi);
            continue;
        } else if(img_file_fh.exists) {
            rate.setInfo( TEXT_DO_OVERRIDE );
        } else {
            rate.setInfo(TEXT_NEW_FILE);
        }

        // Try to save image if any unexception error occur, quit this process.
        try {
            curr_doc.saveAs(img_file_fh, save_option, true, EXTENSION_CASE);
            saved_images.push(full_export_name);
            rate.plus(1);
        } catch(e) {
            alert(e, UI_TITLE + " " + SCRIPT_VER);
            delete img_file_fh, rate;
            return false;
        }
        number_of_success++; // When success the number plus one.

        var openType = getOpenOptions(gExtension);

        // Resize image if mode number is 2 or 3 (half and Quad).
        if(gResizeMode != 1) {
            rate.setInfo(TEXT_PARENT_START + secondary_str + TEXT_PARENT_END + TEXT_DO_RESIZE);
            try {
                var work_doc = app.open(img_file_fh, openType); //Open new document.
                app.activeDocument = work_doc; //Setting work document active.
                while(work_doc.height.value != resize_height)
                {
                    work_doc.resizeImage(resize_width, resize_height, gImagePixel, RESAMPLE_METHOD);
                }
                work_doc.close(SaveOptions.SAVECHANGES); // Close with save changes.
                app.activeDocument = curr_doc; // Focus previous document.
            } catch(e) {
                alert(e);
            }
            rate.plus(1);
        }

        // Convert to grayscale.
        if(gGrayKeyword != "" && curr_doc.mode != DocumentMode.GRAYSCALE)
        {
            rate.setInfo(secondary_str + " -> " + TEXT_ANALYSIS);
            if(isIncludedGrayscale(curr_doc.layerSets[i].name)) {
                var work_doc = app.open(img_file_fh, openType);
                app.activeDocument = work_doc;
                try {
                    work_doc.changeMode(ChangeMode.GRAYSCALE);
                    work_doc.close(SaveOptions.SAVECHANGES);
                    number_of_grayscale++;
                } catch(e) {
                    alert(e, UI_TITLE+SCRIPT_VER);
                }
                app.activeDocument = curr_doc;
                rate.setInfo(TEXT_DO_GRAY);
            } else {
                rate.setInfo(TEXT_SKIP_GRAY);
            }
            rate.plus(1);
        }

        // Generate low resolution image after saved.
        if(gLaunchLow)
        {
            rate.setInfo(secondary_str + " -> " + TEXT_BUILD_LOW);
            var low_res_file_name = gDefaultSavePath + "/" + main_str + gIntervalSymbol + secondary_str
                + LOW_SUFFIX + "." + gExtension;
            var low_res_file = new File(low_res_file_name);
            var low_res_width = Math.floor(resize_width / LOW_RATIO);
            var low_res_height= Math.floor(resize_height/ LOW_RATIO);
            var work_doc = app.open(img_file_fh, openType);
            app.activeDocument = work_doc;
            try {
                work_doc.resizeImage(low_res_width, low_res_height, gImagePixel);
                work_doc.saveAs(low_res_file, save_option, false, EXTENSION_CASE);
                work_doc.close(SaveOptions.DONOTSAVECHANGES);
                saved_images.push(low_res_file_name);
            } catch(e) {
                alert(e, UI_TITLE + " " + SCRIPT_VER);
            }
            rate.setInfo(secondary_str + " -> " + TEXT_LOW_DONE);
            app.activeDocument = curr_doc;
            delete low_res_file;
            rate.plus(1);
        }
        delete img_file_fh;

        if(gProcessBreak) {
            alert(TEXT_PROC_TERM, UI_TITLE);
            break;
        }
    }
    // Recover original layerSet visible status.
    setLayerSetVisible(curr_doc, visible_layer_sets);
   
    // Recover outside layer visible status if disable outside is launch.
    if (gDisableOutside)
    {
        setLayerVisible(curr_doc, visible_layers);
    }

    // Maketx
    if (gAutoGenerateTx)
    {
        var maketx_module = "" + File($.fileName).path + "/maketx.jsx";
        var maketx_file = new File(maketx_module);
        if (maketx_file.exists) {
            $.evalFile(maketx_file);
            maketx(saved_images);
            rate.setInfo(TEXT_MAKETX_PROC);
        } else {
            rate.setInfo(TEXT_MAKETX_NF);
        }
    }

    // Make DDS
    if (gConvertDds)
    {
        var makedds_module = "" + File($.fileName).path + "/makedds.jsx";
        var makedds_file = new File(makedds_module);
        if (makedds_file.exists) {
            $.evalFile(makedds_file);
            makedds(saved_images);
            rate.setInfo(TEXT_CONVDDS_PRO);
        } else {
            rate.setInfo(TEXT_CONVDDS_NF);
        }
    }

    // Remove EXIF
    if (gRemoveExif && gExtension == "tif")
    {
        var rmexif_module = "" + File($.fileName).path + "/exifutils.jsx";
        var rmexif_file = new File(rmexif_module);
        if (rmexif_file.exists) {
            $.evalFile(rmexif_file);
            remove_all_exif(saved_images);
            rate.setInfo(TEXT_RMEXIF_PROC);
        } else {
            rate.setInfo(TEXT_EXIFUT_NF);
        }
    }

    // Tell user how many images is saved, then close rate window.
    if(!gProcessBreak)
    {
        var result_report = number_of_success + TEXT_COMPLETED;
        if(gGrayKeyword != "" && curr_doc.mode != DocumentMode.GRAYSCALE) {
            result_report += (", " + number_of_grayscale + TEXT_GRAY_INFO);
        } else {
            result_report += ".";
        }
        rate.setInfo(result_report);
        $.sleep(ENDING_WAIT);
        writeLog();
        rate.close();
    }
    delete rate;
    app.preferences.rulerUnits = default_ruler_units;
}

// Check Active-Document legal.
function activeDocumentCheck()
{
    if (app.documents.length === 0)
    {
        alert(TEXT_NO_DOCUMENTS, UI_TITLE+SCRIPT_VER);
        return false;
    }
    try {
        var curr_doc = app.activeDocument;
    } catch(e) {
        alert(e, UI_TITLE+SCRIPT_VER);
        return false;
    }
    if (curr_doc.name.split(".").pop().toLowerCase() != "psd")
    {
        alert(TEXT_IS_NOT_PSD, UI_TITLE+SCRIPT_VER);
        return false;
    } 
    try {
        var docPath = curr_doc.path;
    } catch(e) {
        alert(e, UI_TITLE+SCRIPT_VER);
        return false;
    }
    if (curr_doc.layerSets.length === 0)
    {
        alert(TEXT_NO_LAYER, UI_TITLE+SCRIPT_VER);
        return false;
    }
    return true;
}

function getSavePathProc()
{
    // Get this document all artLayers
    var docLayers = app.activeDocument.artLayers;
    var path = null;
    var work_paths = [];
    var path_is_duplicated = false;

    // Loop for search text-layers
    for (var i = 0 ; i < docLayers.length ; i++)
    {
        // Reset path_is_duplicated notation
        path_is_duplicated = false;
        if(docLayers[i].kind == LayerKind.TEXT)
        {
            // Check previous others if duplicated
            for (var j = work_paths.length-1 ; j >= 0 ; j--)
            {
                if(docLayers[i].textItem.contents == work_paths[j])
                {
                    path_is_duplicated = true;
                    break;
                }
            }
            if(path_is_duplicated) // If duplicated then skip.
                continue;
            var path = new Folder(docLayers[i].textItem.contents);
            if(path.exists)
            {
                work_paths.push(docLayers[i].textItem.contents);
            }
        }
    }
    delete path;
    // If not any paths to work, let only path is same as PSD.
    if(work_paths.length === 0)
    {
        work_paths.push(app.activeDocument.path.fsName);
    }
    return work_paths;
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
        case "with_low_res":
            if (value=="true" || value=="1")
                gLaunchLow = true;
            else
                gLaunchLow = false;
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
                gResizeMode = 3;
            break;
        case "disable_outside":
            if (value == "true" || value == "1")
                gDisableOutside = true;
            else
                gDisableOutside = false;
            break;
        case "maketx":
            if (value == "true" || value == "1")
                gAutoGenerateTx = true;
            else
                gAutoGenerateTx = false;
            break;
        case "makedds":
            if (value == "true" || value == "1")
                gConvertDds = true;
            else
                gConvertDds = false;
            break;
        case "remove_exif":
            if (value == "true" || value == "1")
                gRemoveExif = true;
            else
                gRemoveExif = false;
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
    var stat = true;
    try {
        log.open('w');
        if(gExtensionStore != gExtension)
            log.writeln("images_extension = " + gExtensionStore);
        else
            log.writeln("images_extension = " + gExtension);
        log.writeln("with_low_res = " + gLaunchLow);
        log.writeln("images_compression = " + gCompression);
        log.writeln("interval_symbol = " + gIntervalSymbol);
        log.writeln("version_operate = " + gVersionAppend);
        log.writeln("grayscale_keywords = " + gGrayKeyword);
        log.writeln("resize_mode = " + gResizeMode);
        log.writeln("disable_outside = " + gDisableOutside);
        log.writeln("maketx = " + gAutoGenerateTx);
        log.writeln("makedds = " + gConvertDds);
        log.writeln("remove_exif = " + gRemoveExif);
    } catch(e) {
        alert(e, UI_TITLE + SCRIPT_VER);
        stat = false;
    } finally {
        log.close();
        delete log;
    }
    return stat;
}

function getLayerSetVisible(work_doc)
{
    gNumVisible = 0;
    var visible_layer_sets = [];
    for (var i = 0 ; i < work_doc.layerSets.length ; i++) 
    {
        visible_layer_sets.push(work_doc.layerSets[i].visible);
        if(visible_layer_sets[i]) 
        {
            gNumVisible++;
        }
    }
    return visible_layer_sets;
}

function getLayerVisible(work_doc)
{
    gLayNumVisible = 0;
    var visible_layers = [];
    for (var i = 0 ; i < work_doc.layers.length ; i++)
    {
        visible_layers.push(work_doc.layers[i].visible);
        if (visible_layers[i]) gLayNumVisible++;
    }
    return visible_layers;
}

function setLayerSetVisible(work_doc, visible)
{
    for (var i = 0 ; i < work_doc.layerSets.length ; i++)
    {
        work_doc.layerSets[i].visible = visible[i];
    }
}

function setLayerVisible(work_doc, visible)
{
    for (var i = 0 ; i < work_doc.layers.length ; i++)
    {
        work_doc.layers[i].visible = visible[i];
    }
}

function getSaveOptions(extension)
{
    switch(extension)
    {
    case "tif":
        var saveOptions = TiffSaveOptions;
        saveOptions.alphaChannels = ALPHA_CHANNEL_KEEP;
        saveOptions.byteOrder = TIFF_BYTE_ORDER;
        saveOptions.embedColorProfile= COLOR_PROFILE_EMBED;
        saveOptions.layers = false;
        if(gCompression)
            saveOptions.imageCompression = TIFF_COMP_ENCODING;
        else
            saveOptions.imageCompression = TIFFEncoding.NONE;
        break;
    case "tga":
        var saveOptions = TargaSaveOptions;
        saveOptions.alphaChannels  = ALPHA_CHANNEL_KEEP;
        saveOptions.embedColorProfile = COLOR_PROFILE_EMBED;
        saveOptions.resolution = TGA_PER_PIXELS;
        saveOptions.rleCOMPRESS_DEFAULT = gCompression;
        break;
    case "jpg":
        var saveOptions = JPEGSaveOptions;
        saveOptions.alphaChannels = ALPHA_CHANNEL_KEEP;
        saveOptions.embedColorProfile= COLOR_PROFILE_EMBED;
        saveOptions.matte = JPEG_MATTE_TYPE;
        saveOptions.quality = JPEG_SAVE_QUALITY;
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
    var invalidWords = new RegExp("[\\/:\"\*\?<>|]+");
    return (!invalidWords.test(name));
}

function isIncludedGrayscale(channel)
{
    var keywords = gGrayKeyword.split(" ");
    for(var keyword_index in keywords)
    {
        if(channel == keywords[keyword_index])
            return true;
    }
    return false;
}

function progressRateBar(max)
{
    var properties = { 
        maximizeButton : false, 
        minimizeButton : false, 
        borderless : false, 
        resizeable : false
    };
    
    this.pr = new Window("window", TEXT_PROCESSING, undefined, properties);
    this.pr.active = true;
    this.pr.orientation = "column";
    this.pr.plane = this.pr.add("panel");
    this.pr.plane.size = { width:280, height:120 };
    this.pr.plane.alignChild = "column";
    this.pr.plane.info = this.pr.plane.add("staticText", undefined, TEXT_START);
    this.pr.plane.info.minimumSize = { width:240, height:28 };
    this.pr.plane.rate = this.pr.plane.add("Progressbar", undefined);
    this.pr.plane.rate.size = { width:240, height:16 };
    this.pr.plane.rate.maxvalue = max;

    // Events
    this.pr.onClose = function() { 
        gProcessBreak = true;
    };

    // Methods
    this.setInfo = function(text) {
        this.pr.plane.info.text = text;
        app.refresh();
    }
    this.plus = function(step) {
        this.pr.plane.rate.value += step;
    }
    this.show = function() {
        this.pr.show();
    }
    this.close = function() {
        this.pr.close(0);
        delete this.pr;
    }
}

// Division.jsx