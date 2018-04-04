// ---------------------------------------------------------------------------
//
//  common module
//
// ---------------------------------------------------------------------------
//
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

function extname(name)
{
    return (/[.]/.exec(name)) ? /[^.]+$/.exec(name) : undefined;
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
    for (var a_idx = 0 ; a_idx < args.length ; a_idx++)
    {
        line += args[a_idx] + " ";
    }
    return line;
}

function has_keyword(word, patterns)
{
    for (var p_idx = 0 ; p_idx < patterns.length ; p_idx++)
    {
        if (word.search(patterns[p_idx]) > 0)
        {
            return true;
        }
    }
    return false;
}
