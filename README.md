# Division

## Extension Photoshop script can be save each group out

#### Version : 1.4.1

![Division](./intro.png)

## How to use

1. In Photoshop, File -> Scripts -> Browse
2. Choice Division.jsx in folder, it would be launch interface

## The Photoshop Groups

Build several groups you want to export.</br>
The final output name is \<psd-name>\<interval-char>\<group-name>\<suffix>.\<extension></br>

For example, we have four groups called "Refl", "Gls", "Bump" and "Color".

![groups](./docs/groups.png)

## The Save Path

You can specific path use "text" layer.</br>
The text layer regradness visible or level.</br>
It help script known what path you want to save.</br>
If no path found, It will be same as psd directory.</br>

![save-path](./docs/savepath.png)

## Save Formats

Division have three format can be output - tif, tga and jpg.</br>

## Make tx Function

Make tx is a new feature starts from 1.3.</br>
If set, Division will do maketx application after saved.</br>

_txConfig.txt_ is make tx configuration.</br>

+ bin=_maketx program_
+ arguments=_maketx argument_
+ colorspace=_environment color space_
+ colorconfig=_color conifg directory_
+ sRGB=_sRGB color space keywords_
+ Raw=_Raw color space keywords_
+ default=_Default color space_

## Remove EXIF Function

Remove exif information function starts from 1.4.

If set, it will remove exif information automatically by exiftool.</br>
The remove exif function need 3rd-Party application - "exiftool"</br>
Please download and place exiftool.exe into same as script's folder.</br>

[https://sourceforge.net/projects/exiftool/](https://sourceforge.net/projects/exiftool/)</br>

## Resize

Resize options can resize image after saved.</br>
You can select half or quarter.</br>

## Overlapping

If override is set, it will override every exists,</br>
else if ignore exists is set, it will skip any exists.</br>

## Intervals

You can choice the "_" or "." between \<psd-name> and \<group-name></br>
For example, you have a psd called myImages.psd and 2 groups called dif, bmp,</br>
If you select "Underscore", it will output two images called ***myImages_dif*** and ***myImages_bmp***.</br>
Or you select "Dot", it will output two images called ***myImages.dif*** and ***myImages.bmp***.

## Suffixes

You can specifc the suffix.</br>
For example, you fill suffix word ***".v1"***, It will output images called ***myImages.dif.v1***.</br>
And if you want no any suffix, just blank it.

## Grayscale Keywords

You can specific the keyword for auto convert image to grayscale, Sperate words by space.</br>
For example, you want the ***Bump***, ***Gls***, ***Refl*** group to grayscale,</br>
Fill ***Bump Gls Refl***, It will convert them after saved.

## Advance Options

+ Hide Outsd (Hide outside) if set, it will hide all layer in the world before saving.
+ Compress if set, it will make compression to image.
+ Gen low (Generate low resolution) if set, it will generate a quarter image and suffix ***.low***.

## Execute

+ Visible : Only visible groups would be save.
+ All Groups : All groups would be save.
+ Cancel : Quit.

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
