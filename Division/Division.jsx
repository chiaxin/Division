//	Division (Distribute texture form PSD groups tool) 
//
//	Usage : Convenient output each group(LayerSet) in photoshop
//	Author : Chia Xin Lin
//	
//	Copyright (c) 2015 Chia Xin Lin <nnnight@gmail.com>
//	
//	Create date : 09/17/2014 (First build)
//  Refine date : 07/01/2015 (Script rename and refine it)
//	Version :: 1.0.8
//	Last update :: 09/16/2015
//
//	Test and Debug : 
//		os : Microsoft windows 7 x64
//		Photoshop : Adobe Photoshop CS6 v13.0.1 x64
// ---------------------------------------------------------------------------------------------
// Global variable declare and define :
var IMAGEPIXEL 			= 72					; //Pixel. Default is 72.
var TIFFCOMPRESSENCODING= TIFFEncoding.TIFFLZW	; //TIFFEncoding.TIFFZIP , TIFFEncoding.TIFFLZW
var TIFF_BYTEODER		= ByteOrder.IBM 		; //TIFF format byte order
var COLORPROFILEEMBED 	= false					; //Color-profile embed or not.
var ALPHACHANNELKEEP  	= false					; //Alpha channel keep or not.
var JPEGSAVEQUALITY 	= 12					; //JPEG compression quality.
var JPEG_MATTETYPE		= MatteType.SEMIGRAY	;
var JPEG_FORMAT = FormatOptions.STANDARDBASELINE;
var SAVE_PATHS 			= getSavePathProc()		; //Getting all need to save path(s).
var SAVE_PATH 			= SAVE_PATHS[0]			;
var SAVE_INDEX			= 0						;
var UI_TITLE 			= "Division by ChiaXin."; //Option window title.
var SCRIPT_VER			= "ver 1.0.8"			;
var COMPRESS_DEFAULT 	= true					; //Compression image option.
var RESIZEMODE			= 1						; //Image resize mode, 1:original, 2:half, 3:quad.
var OVERLAPPING			= true					; //Overlapping or not.
var EXTENSION_DEFAULT 	= "tga"					; //Image save extension.
var EXTENSION_STORE		= "tga"					;
var IMMEDIATE 			= false					; //Immediately execute switch. default is false(Launch option window).
var TREAT_ALL 			= true					; //For immediately execute, save images treatment mode.
var ENDING_WAIT			= 240					;
var EXTENSIONCASE		= Extension.LOWERCASE	; //file extension toppercase or lowercase? 
var TGA_PERPIXELS= TargaBitsPerPixels.TWENTYFOUR; //24-bits tga format.
var INTERVAL_SYMBOL		= "_"					; //Indicate the interval symbol.
var VERSION_OPERATE		= ""					; //Version suffix additional
var LAUNCH_LOWRES		= false					;
var LOWRES_SUFFIX		= ".lowres"				;
var GRAY_KEYWORD		= ""					;
var LOWRES_RATIO		= 4						;
var NUMVISIBLELS		= 0						;

// Log data would be pre-reading, If not exists, buliding a new.
var SCRIPT_NAME = "Division.jsx"		; //Local script name.ext.
var LOG_NAME 	= "DivisionLog.txt"		; //Log txt name.
var SCRIPT_FOLDER = $.fileName.replace(SCRIPT_NAME, ""); //Script local folder.

// GUI text-info set up :
var TEXT_PATHS 		= "path(s)",
	TEXT_EXT		= "Extension Options",
	TEXT_COMPRESS	= "Compress",
	TEXT_RESIZE		= "Resize Options",
	TEXT_ORGSIZE	= "Original",
	TEXT_HALFSIZE	= "Half",
	TEXT_QUADSIZE	= "Quad",
	TEXT_LOWRES		= "Low-Res",
	TEXT_DOLOWRES	= "Convert lowres image...",
	TEXT_LOWRESDONE = "Lowres image is done!",
	TEXT_OVERLAPPING= "Overlapping Options",
	TEXT_OVERRIDE	= "Override",
	TEXT_SKIP		= "Skip Exists",
	TEXT_NEWFILE	= "Saving a new image...",
	TEXT_INTERVAL	= "Interval Symbol Options",
	TEXT_IS_UNDERBAR= "Underscore",
	TEXT_IS_DOT		= "Dot",
	TEXT_VERSION	= "Version Append & Grayscale Keywords",
	TEXT_EXECUTE	= "Command",
	TEXT_EXEVIS		= "Visible",
	TEXT_EXEALL		= "All",
	TEXT_CANCEL		= "Cancel",
	TEXT_NOVISIBLE	= "Do \"Visible\" must have one layerset visible at least!",
	TEXT_ADVANCE	= "Advance Options",
	TEXT_IMMEDIATE	= "Immediacy",
	TEXT_STOP 		= "Make Each Images...",
	TEXT_DLGSHOW 	= "Show Dialog Next Time",
	TEXT_SAPATH		= "Path is same as this document.",
	TEXT_NOTLAYER 	= "Error: This document has not any layer set.",
	TEXT_START		= "Start...",
	TEXT_FEXISTS	= "File exists...Skip.",
	TEXT_FOVERRIDE	= "File exists...Overriding.",
	TEXT_GROUPEMPTY = "is empty.",
	TEXT_DORESIZE	= "doing resize...",
	TEXT_COMPLETED  = " Image(s) completed !",
	TEXT_INVAILDNAME= " is invaild, Ignore.",
	TEXT_OVEREIGHT	= "TIFF format only because file is not 8 bits",
	TEXT_ANALYSIS	= "Grayscale Analysis...",
	TEXT_DOGRAYSCALE= "Convert grayscale mode successfully!",
	TEXT_GRAYSKIP	= "Grayscale Skip...",
	TEXT_GRAYINFO	= "image(s) Grayscale Converted.",
	HELP_SAVEPATH	= "Please choice a path of list you want to save.",
	HELP_EXTENSION	= "Image format selections, TIF, TGA or JPG",
	HELP_RESIAZE	= "Resize image after saving, this option can not remember.",
	HELP_OVERLAPPING= "Overlapping file or skip, this option can not remember.",
	HELP_INTERVAL	= "Set interval symbol between main and channel name.",
	HELP_VAGK		= "Version string append, grayscale keywords setting.",
	HELP_COMMAND	= "Visible: Only visible group save, All: Save all";
	HELP_ADVANCE	= "If immediacy is on, no dialog in next launch.";


// Main proc execute here :
Division();

// Main proc beforehand :
function Division()
{
	if(!readingLog()) writtingLog();

	if(!SAVE_PATHS) return false; 

	if(!IMMEDIATE) DivisionMainDlg(); //If IMMEDIATE is false, Launching dialog.
	else DivisionMainProc(TREAT_ALL); //If IMMEDIATE is true, Do it immediately.
}

// Main GUI Define:
function DivisionMainDlg()
{
    // Main winodw describe.
    var kGlobalPanelSize  = { width:280, height:46 };
    var kGlobalButtonSize = { width:72 , height:24 };
    var kGlobalEditTextSize = { width:80, height:22 };
    var kGlobalEditTextSize2= { width:150, height:22 };
	var kDialogProperties = 
		{maximizeButton:false, minimizeButton:false, borderless:false, resizeable:false };
    var dlg = new Window("dialog", UI_TITLE+SCRIPT_VER, undefined, kDialogProperties);
	Window.onClose = function() { delete dlg };

    // Panel display all path(s) ready to save.
    dlg.panelSavePaths 					= dlg.add("panel", undefined);
    dlg.panelSavePaths.size 			= kGlobalPanelSize;
    dlg.panelSavePaths.alignChild 		= "left";
    dlg.panelSavePaths.orientation 		= "column";
	// If we not provide any current path, It will assume we want to saving in same path with PSD.
	// And if we provide at least one path, it will drop-down-list UI appear for choice.
    if( SAVE_PATHS.length==1 && SAVE_PATHS[0]==app.activeDocument.path.fsName )
    {
    	dlg.panelSavePaths.stA = dlg.panelSavePaths.add("StaticText", undefined);
    	dlg.panelSavePaths.stA.text = TEXT_SAPATH;
    	SAVE_PATH = SAVE_PATHS[0];
    }
    else
    {
	    dlg.panelSavePaths.ddlA = dlg.panelSavePaths.add("DropDownList", undefined);
	    dlg.panelSavePaths.ddlA.maximumSize = { width:250, height:24 };
	    for(i=0 ; i<SAVE_PATHS.length ; i++)
		{
			dlg.panelSavePaths.ddlA.add("item", SAVE_PATHS[i]);
		}
	    dlg.panelSavePaths.text = i + " " + TEXT_PATHS;
	    dlg.panelSavePaths.ddlA.helpTip = HELP_SAVEPATH;
	    dlg.panelSavePaths.ddlA.selection = 0;
	    dlg.panelSavePaths.ddlA.onChange = function(){ SAVE_PATH = dlg.panelSavePaths.ddlA.selection.text; };
    }

    // Panel output image extension select.
    dlg.panelExtensionOptions = dlg.add("panel", undefined, TEXT_EXT);
    dlg.panelExtensionOptions.size = kGlobalPanelSize;
    dlg.panelExtensionOptions.alignChild = "left";
    dlg.panelExtensionOptions.orientation = "row";
	dlg.panelExtensionOptions.helpTip = HELP_EXTENSION;

	// If document is 8 bits/channel should be 3 format options appear.
	// But if document is 16 or 32 bits/channel, TIFF format constant.
    if(app.activeDocument.bitsPerChannel == BitsPerChannelType.EIGHT)
    {
	    dlg.panelExtensionOptions.rbA = dlg.panelExtensionOptions.add("RadioButton", undefined, "TIF");
	    dlg.panelExtensionOptions.rbB = dlg.panelExtensionOptions.add("RadioButton", undefined, "TGA");
	    dlg.panelExtensionOptions.rbC = dlg.panelExtensionOptions.add("RadioButton", undefined, "JPG");
		switch(EXTENSION_DEFAULT)
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
		dlg.panelExtensionOptions.rbA.onClick = function(){ 
			EXTENSION_DEFAULT = "tif"; EXTENSION_STORE = EXTENSION_DEFAULT; };
		dlg.panelExtensionOptions.rbB.onClick = function(){ 
			EXTENSION_DEFAULT = "tga"; EXTENSION_STORE = EXTENSION_DEFAULT; };
		dlg.panelExtensionOptions.rbC.onClick = function(){ 
			EXTENSION_DEFAULT = "jpg"; EXTENSION_STORE = EXTENSION_DEFAULT; };
		EXTENSION_STORE = EXTENSION_DEFAULT;
	}
	else
	{
		dlg.panelExtensionOptions.stA = dlg.panelExtensionOptions.add("StaticText", undefined, TEXT_OVEREIGHT);
		EXTENSION_STORE = EXTENSION_DEFAULT;
		EXTENSION_DEFAULT = "tif";
	}
    
    // Panel resize image options.
    dlg.panelResizeOptions 				= dlg.add("panel", undefined, TEXT_RESIZE);
    dlg.panelResizeOptions.helpTip		= HELP_RESIAZE;
    dlg.panelResizeOptions.size 		= kGlobalPanelSize;
    dlg.panelResizeOptions.alignChild 	= "left";
    dlg.panelResizeOptions.orientation	= "row";
    dlg.panelResizeOptions.rbA 			= dlg.panelResizeOptions.add("RadioButton", undefined, TEXT_ORGSIZE);
    dlg.panelResizeOptions.rbB 			= dlg.panelResizeOptions.add("RadioButton", undefined, TEXT_HALFSIZE);
    dlg.panelResizeOptions.rbC 			= dlg.panelResizeOptions.add("RadioButton", undefined, TEXT_QUADSIZE);
    dlg.panelResizeOptions.rbA.value 	= true;
	dlg.panelResizeOptions.rbA.onClick 	= function(){ RESIZEMODE = 1; };
	dlg.panelResizeOptions.rbB.onClick 	= function(){ RESIZEMODE = 2; };
	dlg.panelResizeOptions.rbC.onClick 	= function(){ RESIZEMODE = 3; };
	
	// Panel overlapping method options.
    dlg.panelOverlappingOptions 			= dlg.add("panel", undefined, TEXT_OVERLAPPING);
    dlg.panelOverlappingOptions.helpTip		= HELP_OVERLAPPING;
    dlg.panelOverlappingOptions.size 		= kGlobalPanelSize;
    dlg.panelOverlappingOptions.alignChild 	= "left";
    dlg.panelOverlappingOptions.orientation	= "row";
    dlg.panelOverlappingOptions.rbA 		= dlg.panelOverlappingOptions.add("RadioButton", undefined, TEXT_OVERRIDE);
    dlg.panelOverlappingOptions.rbB 		= dlg.panelOverlappingOptions.add("RadioButton", undefined, TEXT_SKIP);
    dlg.panelOverlappingOptions.rbA.value 	= true;
	dlg.panelOverlappingOptions.rbA.onClick = function(){ OVERLAPPING = true; };
	dlg.panelOverlappingOptions.rbB.onClick = function(){ OVERLAPPING = false; };

	// Panel specific interval symbol.
	dlg.panelIntervalOptions				= dlg.add("panel", undefined, TEXT_INTERVAL);
	dlg.panelIntervalOptions.helpTip		= HELP_INTERVAL;
	dlg.panelIntervalOptions.size 			= kGlobalPanelSize;
	dlg.panelIntervalOptions.alignChild		= "center";
	dlg.panelIntervalOptions.orientation	= "row";
	dlg.panelIntervalOptions.rbA = dlg.panelIntervalOptions.add("RadioButton", undefined, TEXT_IS_UNDERBAR);
	dlg.panelIntervalOptions.rbB = dlg.panelIntervalOptions.add("RadioButton", undefined, TEXT_IS_DOT);
	if(INTERVAL_SYMBOL==".")
		dlg.panelIntervalOptions.rbB.value = true;
	else
		dlg.panelIntervalOptions.rbA.value = true;
	dlg.panelIntervalOptions.rbA.onClick = function(){ INTERVAL_SYMBOL = "_"; };
	dlg.panelIntervalOptions.rbB.onClick = function(){ INTERVAL_SYMBOL = "."; };

	// Panel version suffix operation.
	dlg.panelVersionOptions				= dlg.add("panel", undefined, TEXT_VERSION);
	dlg.panelOverlappingOptions.helpTip	= HELP_OVERLAPPING;
	dlg.panelVersionOptions.size 		= kGlobalPanelSize;
	dlg.panelVersionOptions.alignChild	= "center";
	dlg.panelVersionOptions.orientation	= "row";
	dlg.panelVersionOptions.etA = dlg.panelVersionOptions.add("EditText", undefined, VERSION_OPERATE);
	dlg.panelVersionOptions.etA.preferredSize = kGlobalEditTextSize;
	dlg.panelVersionOptions.etB = dlg.panelVersionOptions.add("EditText", undefined, GRAY_KEYWORD);
	dlg.panelVersionOptions.etB.preferredSize = kGlobalEditTextSize2;
	dlg.panelVersionOptions.etA.onChange = function()
	{
		if(rightNaming(dlg.panelVersionOptions.etA.text))
		{
			VERSION_OPERATE = dlg.panelVersionOptions.etA.text;
		}
		else
		{
			dlg.panelVersionOptions.etA.text = "";
		}
	}
	dlg.panelVersionOptions.etB.onChange = function()
	{
		if(rightNaming(dlg.panelVersionOptions.etB.text))
		{
			GRAY_KEYWORD = dlg.panelVersionOptions.etB.text;
		}
		else
		{
			dlg.panelVersionOptions.etA.text = "";
		}
	}

    // Main execution button.
    dlg.panelExecution 				= dlg.add("panel", undefined, TEXT_EXECUTE);
    dlg.panelExecution.helpTip		= HELP_COMMAND;
    dlg.panelExecution.size 		= kGlobalPanelSize;
    dlg.panelExecution.alignChild 	= "center";
    dlg.panelExecution.orientation	= "row";
    dlg.panelExecution.btnA 		= dlg.panelExecution.add("Button", undefined, TEXT_EXEVIS);
	dlg.panelExecution.btnB 		= dlg.panelExecution.add("Button", undefined, TEXT_EXEALL);
    dlg.panelExecution.btnC 		= dlg.panelExecution.add("Button", undefined, TEXT_CANCEL);
    dlg.panelExecution.btnA.size 	= kGlobalButtonSize;
    dlg.panelExecution.btnB.size 	= kGlobalButtonSize;
	
	// Panel advance options.
    dlg.panelAdvanceOptions 			= dlg.add("panel", undefined, TEXT_ADVANCE);
    dlg.panelAdvanceOptions.helpTip		= HELP_ADVANCE;
    dlg.panelAdvanceOptions.size 		= kGlobalPanelSize;
    dlg.panelAdvanceOptions.alignChild 	= "left";
    dlg.panelAdvanceOptions.orientation = "row";
    dlg.panelAdvanceOptions.cbA 		= dlg.panelAdvanceOptions.add("CheckBox", undefined, TEXT_IMMEDIATE);
    dlg.panelAdvanceOptions.cbA.value 	= IMMEDIATE;
    dlg.panelAdvanceOptions.cbB 		= dlg.panelAdvanceOptions.add("CheckBox", undefined, TEXT_COMPRESS);
    dlg.panelAdvanceOptions.cbB.value	= COMPRESS_DEFAULT;
    dlg.panelAdvanceOptions.cbC 		= dlg.panelAdvanceOptions.add("CheckBox", undefined, TEXT_LOWRES);
    dlg.panelAdvanceOptions.cbC.value	= LAUNCH_LOWRES;
    dlg.panelAdvanceOptions.cbA.onClick= function(){ IMMEDIATE = !IMMEDIATE; };
    dlg.panelAdvanceOptions.cbB.onClick= function(){ COMPRESS_DEFAULT = !COMPRESS_DEFAULT; };
	dlg.panelAdvanceOptions.cbC.onClick= function(){ LAUNCH_LOWRES = !LAUNCH_LOWRES; }; 

    // Execute button onClick - Visible layer-set(s) only.
    dlg.panelExecution.btnA.onClick = function () {
		writtingLog();
		dlg.close(0);
		delete dlg;
        DivisionMainProc(false);
    };

	// Execute button onClick - All layer-set(s).
    dlg.panelExecution.btnB.onClick = function () {
		writtingLog();
		dlg.close(0);
		delete dlg;
        DivisionMainProc(true);
    };

    // Canel button onClick.
    dlg.panelExecution.btnC.onClick = function () {
    	dlg.close(0);
    	delete dlg;
		writtingLog();
    }

    dlg.show();
}

// Main function:
function DivisionMainProc(outputMode)
{	
    var defaultRulerUnits = app.preferences.rulerUnits; //Get now ruler units.
    app.preferences.rulerUnits = Units.PIXELS; // Set ruler to "Pixel"
    var curDoc = app.activeDocument; //Get current document.
	IMAGEPIXEL = curDoc.resolution; //Get resolution pixel.
	//Get header name from this document.
    var primaryName = curDoc.name.replace(("."+curDoc.name.split(".").pop()), ""); 
	// Resize height and width calculation.
    switch(RESIZEMODE)
    {
	case 1:
		var resizeHeight = curDoc.height;
		var resizeWidth	 = curDoc.width;
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
		var resizeWidth	 = curDoc.width;
    }
	var saveOption = getSaveOptions(EXTENSION_DEFAULT);
	var visibleLayerSets = getLayerSetsVisibilities(curDoc);
	// If do visible layer-sets only with zero visibility, warning and quit.
	if(!NUMVISIBLELS && !outputMode)
	{
		alert(TEXT_NOVISIBLE, UI_TITLE+SCRIPT_VER);
		return false;
	}
	//
	var rate_multi = 1;
	if(RESIZEMODE!=1) rate_multi += 1;
	if(GRAY_KEYWORD!="" && curDoc.mode!=DocumentMode.GRAYSCALE)
		rate_multi += 1;
	if(LAUNCH_LOWRES) rate_multi += 1;
	// If output mode is true ( all output ) rate max is number of layer-sets.
	// else is number of visible layer-sets.
	if(outputMode)
		var rate = new ProgressRate(curDoc.layerSets.length * rate_multi);
	else
		var rate = new ProgressRate(NUMVISIBLELS * rate_multi);
	rate.show();

	var numberOfSuccess = 0;
	var numberOfGrayscale = 0;
	// Loop saving each layerSet(s)
	for(i=0 ; i<curDoc.layerSets.length ; i++)
    {
    	var channel_name = curDoc.layerSets[i].name + VERSION_OPERATE;
		if(!rightNaming(channel_name))
		{
			rate.setInfo(channel_name + " " + TEXT_INVAILDNAME);
			rate.plus(rate_multi);
			continue;
		}
		else if(!visibleLayerSets[i] && !outputMode) // layerSet is invisible and output mode is visible only. 
		{				
			continue;
		}
		else if(!curDoc.layerSets[i].artLayers.length)
		{
			rate.setInfo("<<" + curDoc.layerSets[i].name + ">>" + TEXT_GROUPEMPTY);
			rate.plus(rate_multi);
			continue;
		}
    	
		// Switch off all layerSets visiable without currect layerSet index(i)
        for(j=0 ; j<curDoc.layerSets.length; j++)
        {
            curDoc.layerSets[j].visible = (j == i);
        }

		// Prepare file path
		rate.setInfo("<<" + channel_name + ">>");
        var fileBuff = new File(
			SAVE_PATH + "/" + primaryName + INTERVAL_SYMBOL + channel_name + "." + EXTENSION_DEFAULT
		);
		
		//If OVERLAPPING is off and file exists.skip this.
		//Otherwise override it, create new one if not exists.
		if(fileBuff.exists && OVERLAPPING==false) 
		{							
			rate.setInfo(TEXT_FEXISTS);
			rate.plus(rate_multi);
			continue;
		}
		else if(fileBuff.exists)
		{
			rate.setInfo(TEXT_FOVERRIDE);
		}
		else
		{
			rate.setInfo(TEXT_NEWFILE);
		}

		// Try to save image if any unexception error occur, quit this process.
		try{
			curDoc.saveAs(fileBuff, saveOption, true, EXTENSIONCASE);	//Saving image.
			rate.plus(1);
		}catch(e){
			alert(e, UI_TITLE+SCRIPT_VER);
			delete fileBuff, rate;
			return false;
		}
		numberOfSuccess++; //Success number plus one.
		
		var openType = getOpenOptions(EXTENSION_DEFAULT);
        if(RESIZEMODE!=1) //If resize value is 2 or 3 (half and Quad)
        {
			rate.setInfo("<<" + channel_name + ">> " + TEXT_DORESIZE);
			try{
				var workDoc = app.open(fileBuff, openType);	//Open new document.
				app.activeDocument = workDoc; 				//Setting work document active.
				while(workDoc.height.value != resizeHeight) //Resize image(Half or Quad).
				{
					workDoc.resizeImage(resizeWidth, resizeHeight, IMAGEPIXEL);	
				}
				workDoc.close(SaveOptions.SAVECHANGES); //Close with save.     
				app.activeDocument = curDoc; 			//Re-focus oringin document.
			}catch(e){
				alert(e);
			}
            rate.plus(1);
        }

        if(GRAY_KEYWORD!="" && curDoc.mode!=DocumentMode.GRAYSCALE)
        {
        	rate.setInfo(channel_name + " -> " + TEXT_ANALYSIS);
        	if(isIncludedGrayscale(curDoc.layerSets[i].name))
        	{
        		var workDoc = app.open(fileBuff, openType);
        		app.activeDocument = workDoc;
        		try{
        			workDoc.changeMode(ChangeMode.GRAYSCALE);
        			workDoc.close(SaveOptions.SAVECHANGES);
        			numberOfGrayscale++;
        		}catch(e){
        			alert(e, UI_TITLE+SCRIPT_VER);
        		}
        		app.activeDocument = curDoc;
        		rate.setInfo(TEXT_DOGRAYSCALE);
        	}
        	else
        	{
        		rate.setInfo(TEXT_GRAYSKIP);
        	}
        	rate.plus(1);
        }

        // Make lowres image.
        if(LAUNCH_LOWRES)
        {
        	rate.setInfo(channel_name + " -> " + TEXT_DOLOWRES);
        	lowFile = new File(
				SAVE_PATH + "/" + primaryName + INTERVAL_SYMBOL + channel_name + 
				LOWRES_SUFFIX + "." + EXTENSION_DEFAULT
			);
			var lowresWidth = Math.floor(resizeWidth/LOWRES_RATIO);
			var lowresHeight= Math.floor(resizeHeight/LOWRES_RATIO);
        	var workDoc = app.open(fileBuff, openType);
        	app.activeDocument = workDoc;
        	try{
        		workDoc.resizeImage(lowresWidth, lowresHeight, IMAGEPIXEL);
            	workDoc.saveAs(lowFile, saveOption, false, EXTENSIONCASE);
        		workDoc.close(SaveOptions.DONOTSAVECHANGES);
        	}catch(e){
        		alert(e, UI_TITLE+SCRIPT_VER);
        	}
        	rate.setInfo(channel_name + " -> " + TEXT_LOWRESDONE);
        	app.activeDocment = curDoc;
        	delete lowFile;
        	rate.plus(1);
        }
        delete fileBuff;
    }
	// Recover original layerSet visible status.
    setLayerSetsVisibilities(curDoc, visibleLayerSets);
    // Tell user how many images save successfully, then close rate window.
	if(!rate.isClosed)
	{
		var result_report = numberOfSuccess + TEXT_COMPLETED;
		if(GRAY_KEYWORD!="" && curDoc.mode!=DocumentMode.GRAYSCALE) 
			result_report += (", " + numberOfGrayscale + TEXT_GRAYINFO);
		rate.setInfo(result_report);
		$.sleep(ENDING_WAIT);
		IMMEDIATE = rate.isImmediate();
		writtingLog();
		rate.close();
	}
	delete rate;
    app.preferences.rulerUnits = defaultRulerUnits;
}

function getSavePathProc()
{
	if(!beforehandCheck()) return false;

    // Get this document all artLayers
	var docLayers = app.activeDocument.artLayers;
    var path = null;
    var workPaths = [];
	var pathIsDuplicated = false;

	// Loop for search text-layers
    for(i=0 ; i<docLayers.length ; i++)
    {
    	// Reset pathIsDuplicated nnotation
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
	
	// Check Active-Document legal.
	function beforehandCheck()
	{
		try{
			var curDoc = app.activeDocument;
		}catch(e){
			alert(e, UI_TITLE+SCRIPT_VER);
			return false;
		}
		try{
			var docPath = curDoc.path;
		}catch(e){
			alert(e, UI_TITLE+SCRIPT_VER);
			return false;
		}
		if(curDoc.layerSets.length == 0)
		{
			alert(TEXT_NOTLAYER, UI_TITLE+SCRIPT_VER);
			return false;
		}
		return true;
	}
}

function readingLog()
{
	var log	= new File(SCRIPT_FOLDER+LOG_NAME);
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
		case "immediate":
			if(value=="true" || value=="1")
				IMMEDIATE = true;
			else
				IMMEDIATE = false;
			break;
		case "images_extension":
			if(value=="tif" || value=="tga" || value=="jpg")
				EXTENSION_DEFAULT = value;
			else 
				EXTENSION_DEFAULT = "tga";
			break;
		case "images_compression":
			if(value=="false" || value=="0")
				COMPRESS_DEFAULT = false;
			else
				COMPRESS_DEFAULT = true;
			break;
		case "extra_lowres":
			if(value=="true" || value=="1")
				LAUNCH_LOWRES = true;
			else
				LAUNCH_LOWRES = false;
		case "treat_all":
			if(value=="false" || value=="0")
				TREAT_ALL = false;
			else 
				TREAT_ALL = true;
			break;
		case "interval_symbol":
			if(value=="_" || value==".")
				INTERVAL_SYMBOL = value;
			else
				INTERVAL_SYMBOL = "_";
			break;
		case "version_operate":
			if(rightNaming(value))
				VERSION_OPERATE = value;
			else
				VERSION_OPERATE = "";
			break;
		case "grayscale_keywords":
			if(rightNaming(value))
				GRAY_KEYWORD = value;
			else
				GRAY_KEYWORD = "";
			break;
		}
	}
	log.close(); delete log;
	return true;
}

function writtingLog()
{
	var log	= new File(SCRIPT_FOLDER+LOG_NAME);
	try{
		log.open('w');
		log.writeln("immediate = " + IMMEDIATE);
		if(EXTENSION_STORE != EXTENSION_DEFAULT)
			log.writeln("images_extension = " + EXTENSION_STORE);
		else
			log.writeln("images_extension = " + EXTENSION_DEFAULT);
		log.writeln("extra_lowres = " + LAUNCH_LOWRES);
		log.writeln("images_compression = " + COMPRESS_DEFAULT);
		log.writeln("treat_all = " + TREAT_ALL);
		log.writeln("interval_symbol = " + INTERVAL_SYMBOL);
		log.writeln("version_operate = " + VERSION_OPERATE);
		log.writeln("grayscale_keywords = " + GRAY_KEYWORD);
		log.close();
	}catch(e){
		alert(e, UI_TITLE+SCRIPT_VER);
		return false;
	}
	delete log;
	return true;
}

function getLayerSetsVisibilities(workDoc)
{
	NUMVISIBLELS = 0;
	var visibleLayerSets = [];
    for(i=0 ; i<workDoc.layerSets.length ; i++)
    {
        visibleLayerSets.push(workDoc.layerSets[i].visible);
        if(visibleLayerSets[i]) NUMVISIBLELS++;
    }
    return visibleLayerSets;
}

function setLayerSetsVisibilities(workDoc, visible)
{
    for(i=0 ; i<workDoc.layerSets.length ; i++)
    {
        workDoc.layerSets[i].visible = visible[i];
    }
}

function getSaveOptions(extension)
{
    switch(extension)
    {
	case "tif":
		var saveOptions = TiffSaveOptions;
		saveOptions.alphaChannels = ALPHACHANNELKEEP;
		saveOptions.byteOrder = TIFF_BYTEODER;
		saveOptions.embedColorProfile= COLORPROFILEEMBED;
		saveOptions.layers = false;
		if(COMPRESS_DEFAULT)
			saveOptions.imageCompression = TIFFCOMPRESSENCODING;
		else
			saveOptions.imageCompression = TIFFEncoding.NONE;
		break;
	case "tga":
		var saveOptions = TargaSaveOptions;
		saveOptions.alphaChannels  = ALPHACHANNELKEEP;
		saveOptions.embedColorProfile = COLORPROFILEEMBED;
		saveOptions.resolution = TGA_PERPIXELS;
		saveOptions.rleCOMPRESS_DEFAULT = COMPRESS_DEFAULT;
		break;
	case "jpg":
		var saveOptions = JPEGSaveOptions;
		saveOptions.alphaChannels = ALPHACHANNELKEEP;
		saveOptions.embedColorProfile= COLORPROFILEEMBED;
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

function rightNaming(name)
{
	var invaildWords = new RegExp("[\\/:\"\*\?<>|]+");
	return (!invaildWords.test(name));
}

function isIncludedGrayscale(channel)
{
	var keywords = GRAY_KEYWORD.split(" ");
	for( keyword_index in keywords)
	{
		if(channel == keywords[keyword_index])
			return true;
	}
	return false;
}

function ProgressRate(max)
{
	this.isClosed = false;
	var properties = {maximizeButton:false, minimizeButton:false, borderless:false, resizeable:false};
	this.pr = new Window("window", TEXT_STOP, undefined, properties);
	this.pr.orientation = "column";
	this.pr.plane = this.pr.add("panel");
    this.pr.plane.size = {width:280, height:120};
	this.pr.plane.alignChild = "column";
	this.pr.plane.info = this.pr.plane.add("staticText", undefined, TEXT_START);
	this.pr.plane.info.minimumSize = {width:240, height:28};
	this.pr.plane.rate = this.pr.plane.add("Progressbar", undefined);
	this.pr.plane.rate.size = {width:240, height:16};
	this.pr.plane.checkds = this.pr.plane.add("CheckBox", undefined, TEXT_DLGSHOW);
	this.pr.plane.rate.maxvalue = max;
	this.pr.plane.checkds.value = IMMEDIATE;
	
	// Event
	this.pr.plane.rate.onClose = function(){ this.isClosed = true; };
	
	// If 'No dialog next time' is checked, 
	// return true, otherwise return false.	
	this.isImmediate = function()
	{
		return this.pr.plane.checkds.value;
	}
	// Method
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
