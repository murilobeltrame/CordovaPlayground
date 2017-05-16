# Cordova Playground

A project to play with Cordova, AngularJS UI and Fastlane automation.

## Install

1. Install **NodeJS** from [here](https://nodejs.org/en/download/current/);
2. Install **Cordova** globally using `npm i -g cordova`;
3. Clone this [repo](https://github.com/murilobeltrame/CordovaPlayground.git);
4. Navigate to your local copy;
5. Run `npm i` to restore all dependency packages;
6. Remember to fix the App Id in `./config.xml`;
7. You`r done!

### Setup Platforms

#### Browser

1. Navigate to your local copy;
2. Run `cordova platforms add browser`;
3. Now you can serve the app with `cordova serve`!

#### Android

##### Signing Android App

1. Follow [this](https://developer.android.com/studio/publish/app-signing.html#signing-manually) instructions to know how to generate the **.keystore** to sign your app by CLI;
2. Edit the Android section in `./build.json` the place your keystore info;
3. Run `cordova build android --release` and the CLI will be able to generate signed App.

#### iOS

### Using Fastlane

*This instructions are for macOS systems only*

1. Install **Homebrew** running `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
2. Install **Fastlane** running `brew cask udpate fastlane`;
3. Look into `./fastlane/Fastfile` to know the predefined lanes;
4. Remember to fix the App Id and Play Store credentials file path in `./fastlane/Appfile`;
5. Make sure you configured the platform referred in the lane you planning to use;
6. Have fun!