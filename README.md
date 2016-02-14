#Division

This simple Photoshop script can be save each folder out to images separably.

using JaveScript

file extension can be tga, tif and jpeg

Version 1.0.8

#How to launch

In Photoshop, File -> Scripts -> Browse

find Division.jsx, would be launch GUI

#How to use

Please place a text present path you want to save

If not or path directory is not exists

It would save path be same as PSD file

Else if multi, need to choice path in scroll options

And highlight options, such as format, compression..etc

Press visible or AllLayers to execute process

Image Name = [PSD_NAME][INTERVAL][GROUP_NAME][VERSION].[FORMAT]

Example :

    We have a psd file called "test", and it has 3 group inside : color, bump, refl

    and interval is underscore, format is tga, version is "_v01", Monochrome's field "bump"

    Now it would be save 3 images : TEST_color_v01.tga, TEST_bump_v01.tga, TEST_refl_v01.tga

    Then, TEST_bump_v01.tga would be grayscale(because "bump" was matched)

Limited :

* PSD file need saved.
* Layer-Set(group) need at least one layer inside, otherwise would be ignore.
* If color-depth is not 8bit, Just choice format TIFF only
* Those options would be store after execute, except resize & overlapping

#Photoshop Support

Photoshop CS4, CS5, CS6

#OS Support

Windows
