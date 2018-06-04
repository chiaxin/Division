// ---------------------------------------------------------------------------
//
//  makedds module
//
// ---------------------------------------------------------------------------

// Loading common script.
const common_file = new File("" + File($.fileName).path + "/common.jsx");
if (common_file.exists) {
    $.evalFile(common_file);
}
else {
    alert("common.jsx is not eixsts.");
}

const MAKEDDS_CONFIG_FILE = "/ddsConfig.txt";
const GENERATE_DDS_TEMP_BAT = "/division_generate_dds.bat";

function makedds(images)
{
    var makedds_config = "" + (File($.fileName).path) + MAKEDDS_CONFIG_FILE;
    var config = new File(makedds_config);
    if (!config.exists) {
        alert("The makedds config was not found : " + makedds_config);
        return -1;
    }
    var bin = "texconv.exe",
        args= "-ft DDS",
        default_format = "-f BC7_UNORM_SRGB -srgbi",
        normal_map_format = "-f BC5_UNORM",
        alpha = "-aw 0.0";
    try {
        config.open("r");
        while (!config.eof)
        {
            contents = config.readln().split("=");
            if (contents.length < 2) continue;
            value = contents[1];
            switch(contents[0].replace(" ", ""))
            {
            case "bin":
                bin = windows_style_path(
                    "" + (File($.fileName).path) + "/" + value
                );
                break;
            case "arguments":
                args = value;
                break;
            case "default_format":
                default_format = value;
                break;
            case "normal_map_format":
                normal_map_format = value;
                break;
            case "normal_map_keyword":
                normal_map_keyword = value.split(" ");
                break;
            case "alpha":
                alpha = value;
                break;
            }
        }
    } catch (e) {
        alert("Failed to read dds config file.");
    } finally {
        config.close();
    }
    var bat_command = join([qw(bin), args]);
    var temp_folder = get_temp_folder();
    var bat_file = win_path(temp_folder + GENERATE_DDS_TEMP_BAT);
    var bat_fh = new File(bat_file);
    try {
        bat_fh.open('w');
        bat_fh.writeln("@echo off");
        for (var img_id = 0 ; img_id < images.length ; img_id++) {
            var image = win_path(images[img_id]);
            var output_path = dirname(image);
            var base_name = basename(image);
            var cmd = "";
            if (has_keyword(base_name, normal_map_keyword)) {
                cmd = join([bat_command, 
                            "-o",
                            qw(output_path),
                            normal_map_format,
                            image
                           ]);
            } else {
                cmd = join([bat_command, 
                            "-o",
                            qw(output_path),
                            default_format,
                            image
                           ]);
            }
            bat_fh.writeln(cmd);
        }
        if (!bat_fh.execute()) {
            alert("Convert dds process is failed.");
        }
    } catch (e) {
        alert(e);
    } finally {
        bat_fn.close();
    }
    return 0;
}

// makedds.jsx