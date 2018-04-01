// ---------------------------------------------------------------------------
//
//  maketx module
//
// ---------------------------------------------------------------------------
//
var MAKETX_config_FILE = "/txConfig.txt";
var GENERATE_TX_TEMP_BAT = "/division_generate_tx.bat";

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

function get_temp_folder()
{
    return win_path($.getenv('temp'));
}

function qw(str)
{
    return ("\"" + str + "\"");
}

function join(args)
{
    var line = new String();
    for (a_idx = 0 ; a_idx < args.length ; a_idx++)
    {
        line += args[a_idx] + " ";
    }
    return line;
}

function has_keyword(word, patterns)
{
    for (p_idx = 0 ; p_idx < patterns.length ; p_idx++)
    {
        if (word.search(patterns[p_idx]) > 0)
        {
            return true;
        }
    }
    return false;
}

function maketx(images)
{
    var maketx_config = "" + (File($.fileName).path) + MAKETX_config_FILE;
    var config = new File(maketx_config);
    if (!config.exists) {
        alert("The maketx config was not found : " + maketx_config);
        return -1;
    }
    var bin = maketx_arguments = colorspace = colorconfig = default_color_profile = "";
    var srgb;
    var raw;
    try {
        config.open("r");
        while(!config.eof)
        {
            contents = config.readln().split("=");
            if (contents.length < 2) continue;
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
                srgb = value.split(" ");
                break;
            case "Raw":
                raw = value.split(" ");
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
    var bat_command = join([qw(bin), maketx_arguments, "--colorengine", "syncolor",
                      "--colorconfig", qw(colorconfig)]);
    var temp_folder = get_temp_folder();
    var bat_file = win_path(temp_folder + GENERATE_TX_TEMP_BAT);
    var bat_fh = new File(bat_file);
    try {
        bat_fh.open('w');
        bat_fh.writeln("@echo off");
        for (img_id = 0 ; img_id < images.length ; img_id++)
        {
            var image = win_path(images[img_id]);
            var image_color_space = default_color_profile;
            if (has_keyword(image, srgb))
                image_color_space = "sRGB";
            else if (has_keyword(image, raw))
                image_color_space = "Raw";
            image_color_space = join(["--colorconvert", image_color_space, qw(colorspace)]);
            var output_path = temp_folder + "\\" + basename(image) + ".tx";
            var make_cmd = join([bat_command, "-o", qw(output_path), image_color_space, qw(image)]);
            var copy_cmd = join(["xcopy /Y", qw(output_path), qw(dirname(image))]);
            bat_fh.writeln(make_cmd);
            bat_fh.writeln(copy_cmd);
        }
        if (!bat_fh.execute())
        {
            alert("Make tx failed.");
        }
    } catch (e) {
        alert(e);
    } finally {
        bat_fn.close();
    }
    return 0;
}

// maketx end