// ---------------------------------------------------------------------------
//
//  maketx module
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

const MAKETX_CONFIG_FILE = "/txConfig.txt";
const GENERATE_TX_TEMP_BAT = "/division_generate_tx.bat";

function maketx(images)
{
    var maketx_config = "" + (File($.fileName).path) + MAKETX_CONFIG_FILE;
    var config = new File(maketx_config);
    if (!config.exists) {
        alert("The maketx config was not found : " + maketx_config);
        return -1;
    }
    var bin = maketx_arguments = colorspace = colorconfig = default_color_profile = "";
    var srgb, raw;
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
    var bat_command = join([qw(bin), 
                            maketx_arguments, 
                            "--colorengine", 
                            "syncolor",
                            "--colorconfig", 
                            qw(colorconfig)
                           ]);
    var temp_folder = get_temp_folder();
    var bat_file = win_path(temp_folder + GENERATE_TX_TEMP_BAT);
    var file_handle = new File(bat_file);
    try {
        file_handle.open('w');
        file_handle.writeln("@echo off");
        for (var idx = 0 ; idx < images.length ; idx++) {
            var image = win_path(images[idx]);
            var image_color_space = default_color_profile;
            if (has_keyword(image, srgb))
                image_color_space = "sRGB";
            else if (has_keyword(image, raw))
                image_color_space = "Raw";
            image_color_space = join(["--colorconvert", 
                                      image_color_space, 
                                      qw(colorspace)
                                     ]);
            var output_path = temp_folder + "\\" + basename(image) + ".tx";
            var make_tx_command = join([bat_command, 
                                        "-o", 
                                        qw(output_path), 
                                        image_color_space, 
                                        qw(image)
                                       ]);
            var copy_img_command = join(["xcopy /Y", 
                                         qw(output_path), 
                                         qw(dirname(image))
                                        ]);
            file_handle.writeln(make_tx_command);
            file_handle.writeln(copy_img_command);
        }
        if (!file_handle.execute()) {
            alert("Make tx process is failed.");
        }
    } catch (e) {
        alert(e);
    } finally {
        bat_fn.close();
    }
    return 0;
}

// maketx.jsx