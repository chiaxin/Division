// ---------------------------------------------------------------------------
//
//  common module
//
// ---------------------------------------------------------------------------
//
function basename(name)
{
    // Get base name from file name.
    // Example : basename("D:/temp/images/my_image.tif")
    // It will output "my_image".
    name = win_path(name);
    var base = new String(name).substring(name.lastIndexOf("\\") + 1);
    if (base.lastIndexOf(".") != 1)
        base = base.substring(0, base.lastIndexOf("."));
    return base;
}

function dirname(name)
{
    // Get directory name from file name.
    // Example : dirname("D:/temp/images/my_image.tif")
    // It will output "D:/temp/images".
    name = win_path(name);
    var dir = new String(name).substring(0, name.lastIndexOf("\\"));
    return dir;
}

function extname(name)
{
    // Get extension name from file name.
    // Example : extname("D:/temp/images/my_image.tif")
    // It will output "tif"
    // If no extension found, return undefined.
    return (/[.]/.exec(name)) ? /[^.]+$/.exec(name) : undefined;
}

function win_path(name)
{
    // Replace all forward slash to backward slash.
    return name.replace(/\//g, "\\");
}

function windows_style_path(path)
{
    // Convert Linux style path to windows style path.
    if (new String(path).substring(0, 1) != "/" )
        return path
    var d = new String(path).substring(1, 2);
    d = d.toUpperCase() + ":\\";
    var ws_path = d + new String(path).substring(3, path.length);
    return win_path(ws_path);
}

function get_temp_folder()
{
    // Get temp folder from os environment "TEMP".
    return win_path($.getenv('temp'));
}

function qw(str)
{
    // Make double quote.
    return ("\"" + str + "\"");
}

function join(args)
{
    // Input string array, it will return a string split by space.
    var line = new String();
    for (var a_idx = 0 ; a_idx < args.length ; a_idx++)
    {
        line += args[a_idx] + " ";
    }
    return line;
}

function has_keyword(word, patterns)
{
    // Return true if word is in the patterns, otherwise return false.
    for (var p_idx = 0 ; p_idx < patterns.length ; p_idx++)
    {
        if (word.search(patterns[p_idx]) > 0)
        {
            return true;
        }
    }
    return false;
}

// common.jsx