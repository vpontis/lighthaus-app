#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n com.opolislabs.lighthaus/host.exp.exponent.MainActivity
