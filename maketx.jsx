// ---------------------------------------------------------------------------
//
//  maketx
//
// ---------------------------------------------------------------------------
//
var MAKETX_config_FILE="/txConfig.txt";
var GENERATE_TX_BAT="/division_generate_tx.bat";

function basename(name)
{
    name = win_path(name);
    var base = new String(name).substring(name.lastIndexOf("\\") + 1);
    if (base.lastIndexOf(".") != 1)
        base = base.substring(0, base.lastIndexOf("."));
    return base;
}

function dirname(name)
{
    name = win_path(name);
    var dir = new String(name).substring(0, name.lastIndexOf("\\"));
    return dir;
}

function win_path(name)
{
    return name.replace(/\//g, "\\");
}

function windows_style_path(path)
{
    if (new String(path).substring(0, 1) != "/" )
        return path
    var d = new String(path).substring(1, 2);
    d = d.toUpperCase();
    d += ":\\";
    var ws_path = d + new String(path).substring(3, path.length);
    return win_path(ws_path);
}

function maketx(images)
{
    var maketx_config = "" + (File($.fileName).path) + MAKETX_config_FILE;
    var config = new File(maketx_config);
    if (!config.exists) {
        alert("The maketx config was not found : " + maketx_config);
        return 0;
    }
    var bin = "";
    var maketx_arguments = "";
    var colorspace = "";
    var colorconfig = "";
    var default_color_profile = "";
    var srgb = "";
    var raw = "";
    try {
        config.open("r");
        while(!config.eof)
        {
            contents = config.readln();
            contents = contents.split("=");
            if (contents.length < 2) 
            {
                continue;
            }
            value = contents[1];
            switch(contents[0].replace(" ", ""))
            {
            case "bin":
                bin = value;
                break;
            case "arguments":
                maketx_arguments = value;
                break;
            case "colorspace":
                colorspace = value;            
                break;
            case "colorconfig":
                colorconfig = value;
                break;
            case "sRGB":
                srgb = value;
                break;
            case "Raw":
                raw = value;
                break;
            case "default":
                default_color_profile = value;
                break;
            }
        }
    } catch (e) {
        alert("Failed read tx config");
    } finally {
        config.close();
    }
    if (bin.length == 0 || arguments.length == 0 
        || colorspace == 0 || colorconfig == 0
        || default_color_profile == 0)
    {
        alert("Error maketx arguments.");
        return 0;
    }
    var bat_command = new String("\"" + bin + "\"");
    bat_command += " " + maketx_arguments;
    bat_command += " " + "--colorengine syncolor --colorconfig \"" + colorconfig + "\"";
    var temp_folder = Folder.temp;
    var bat_file = win_path(temp_folder + GENERATE_TX_BAT);
    var bat_fh = new File(bat_file);
    try {
        bat_fh.open('w');
        bat_fh.writeln("@echo off");
        for (i = 0 ; i < images.length ; i++)
        {
            var image = win_path(images[i]);
            var image_color_space = default_color_profile;
            if (image.search(srgb) > 0)
            {
                image_color_space = "sRGB";
            }
            else if (image.search(raw) > 0)
            {
                image_color_space = "Raw";
            }
            image_color_space = "--colorconvert " + image_color_space + " \"" + colorspace + "\"";
            var bn = basename(image);
            bn += ".tx";
            var output_path = temp_folder + "\\" + bn;
            output_path = windows_style_path(output_path);
            var full_command = bat_command + " -o \"" + output_path + "\"";
            full_command += " " + image_color_space + " " + "\"" + image + "\"";
            bat_fh.writeln(full_command);
            var copy_cmd = "xcopy /Y ";
            copy_cmd += "\"" + windows_style_path(output_path) + "\" \"" + win_path(dirname(image)) + "\"";
            bat_fh.writeln(copy_cmd);
        }
        var exec_result = bat_fh.execute();
        if (!exec_result)
        {
            alert("Make tx failed.");
        }
    } catch (e) {
        alert(e);
    } finally {
        bat_fn.close();
    }
    return 1;
}
