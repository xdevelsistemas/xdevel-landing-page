#!/bin/sh

case "$(uname -s)" in
  CYGWIN*|MINGW32*|MSYS*|MINGW*)
      echo "Post build: Without suport to bash script in Windows!"
      exit 0
      ;;
esac

commentFile=xdevel.txt
indexFile=dist/index.html
file404=dist/404.html
tempDirectory=$HOME/xdevel-tmp
tempFile=$tempDirectory/index.html

mkdir -p $tempDirectory
touch $tempFile
cat $commentFile >> $tempFile
cat $indexFile >> $tempFile
cp $tempFile $indexFile
cat $commentFile > $tempFile
cat $file404 >> $tempFile
cp $tempFile $file404

yarn -s rimraf $tempDirectory
