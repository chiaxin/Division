# Division

## Photoshop script

### This is a simple Photoshop script can be save each group out

#### Version : 1.4.0

![](./intro.png)

## How to launch

+ In Photoshop, File -> Scripts -> Browse
+ Find Division.jsx, would be launch script UI

## How to use

+ Build several groups you want to export.
+ Create a "text layer" and key the full path you want to save.(can be multi).
+ If no path or directory is not exists, It will save path be same as PSD file
+ Press "Visible" or "All Groups" button to process.
+ Output name is <PSD_NAME>\<INTERVAL>\<GROUP_NAME>\<SUFFIX>.\<Extension>

## Make tx Function

Make tx is a new feature starts from 1.3.</br>
_txConfig.txt_ is make tx configuration.</br>

+ bin=_maketx program_
+ arguments=_maketx argument_
+ colorspace=_environment color space_
+ colorconfig=_color conifg directory_
+ sRGB=_sRGB color space keywords_
+ Raw=_Raw color space keywords_
+ default=_Default color space_

## Remove EXIF Function

Remove exif information function starts from 1.4.</br>

The remove exif function need 3rd-Party application - "exiftool"</br>
Please download and place exiftool.exe into same as script's folder.</br>

[https://sourceforge.net/projects/exiftool/](https://sourceforge.net/projects/exiftool/)</br>

When you save as TIF format, it will remove exif information automatically by exiftool.</br>

## Limit

+ The Photoshop file need saved before.
+ The group must has a layer(not group) at least, otherwise it would be ignored.
+ If color depth is not 8 bits, Just TIFF format can be export only.

## Photoshop Support

+ Photoshop CS6
+ Photoshop CC 2014
+ Photoshop CC 2015
+ Photoshop CC 2015.5
+ Photoshop CC 2017

## OS Support

Windows
