#! /usr/bin/env bash

#### 2. Script Setup ####
# It's useful to exit the bash script when a command exits with a non-zero status
# as the following commands must be run successfully in sequence for expected results.
set -e # exit entire script when command exits with non-zero status

#### 3. Publish to Expo ####
# Publish `production` release
expo publish --release-channel production --non-interactive

#### 6. Building iOS Standalone App ####
# Start building standalone android build using `production` release channel
expo build:ios --release-channel production --non-interactive

# Download the artifact to current directory as `app.ipa`
curl -o app.ipa "$(expo url:ipa --non-interactive)"

#### 7. Submit standalone iOS app to iTunes Connect ####
# Make sure the following env variables are set
export DELIVER_USERNAME=ios-opolis@springmobility.io

# Use fastlane to upload your current standalone iOS build to itc
fastlane deliver --verbose --ipa "app.ipa" --skip_screenshots --skip_metadata

# ------------------ Android ------------------

##### 4. Building Android Standalone App ####
## Start building standalone android build using `production` release channel
#expo build:android --release-channel production --non-interactive --no-publish
#
## Download the artifact to current directory as `app.apk`
#curl -o app.apk "$(expo url:apk --non-interactive)"

##### 5. Submit and publish standalone Android app to the Google Play Store ####
## Use fastlane to upload your current standalone android build
## Customize this to fit your needs. Take note of env variables.
## Check out https://docs.fastlane.tools for more info.
#fastlane supply --track 'production' --json_key '<path/to/json_key.json>' --package_name "<your-package-name>" --apk "app.apk" --skip_upload_metadata --skip_upload_images --skip_upload_screenshots

