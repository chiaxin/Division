// ---------------------------------------------------------------------------
//
//  Exifutils module
//
// ---------------------------------------------------------------------------
//
var common_module = "" + File($.fileName).path + "/common.jsx";
var common_file = new File(common_module);
if (common_file.exists)
{
    $.evalFile(common_file);
}
else
{
    alert("common.jsx is not eixsts.");
}

var RM_EXIF_BAT_FILE = "_rm_exif.bat";
var EXIFTOOL = "" + (File($.fileName).path) + "/exiftool.exe";
var RM_EXIF_ARGS = "-all= -P -overwrite_original";

function remove_all_exif(images)
{
    var temp_folder = get_temp_folder();
    var exec_name = win_path(temp_folder + "/" + RM_EXIF_BAT_FILE);
    var full_cmd = join([qw(windows_style_path(EXIFTOOL)), RM_EXIF_ARGS]);
    var rm_exif_bat = new File(exec_name);
    try {
        rm_exif_bat.open('w');
        rm_exif_bat.writeln("@echo off");
        for (var idx = 0 ; idx < images.length ; idx++)
        {
            if ((File(images[idx]).exists))
            {
                full_cmd += qw(win_path(images[idx])) + " ";
            }
        }
        rm_exif_bat.writeln(full_cmd);
        if (!rm_exif_bat.execute())
        {
            alert("Remove exif failed.");
        }
    } catch (e) {
        alert("Remove exif failed.");
    } finally {
        rm_exif_bat.close();
    }
    return true;
}

// exifutils.jsx