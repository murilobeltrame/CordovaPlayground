#!/usr/bin/env node

(function() {

    'use strict';

    var _program = function(ctx) {

        console.log('Configuration Crashlytics para projeto Android.');
        if (ctx.opts.platforms.indexOf('android') < 0) {
            console.error('There`s no Android project configured.');
            return;
        }
        var fs = ctx.requireCordovaModule('fs'),
            path = ctx.requireCordovaModule('path'),
            deferral = ctx.requireCordovaModule('q').defer();
        var replace = require('replace-in-file'),
            glob = require('glob');

        //Localizando o arquivo AndroidManifest.xml
        var _manifestPath = path.resolve(ctx.opts.projectRoot, 'platforms', 'android', 'AndroidManifest.xml');
        var _manifestContent = fs.readFileSync(_manifestPath, { encoding: 'utf8' });
        var _hasManifestFabricMetaConfiguration = /android:name=\"io.fabric.ApiKey\"/g.test(_manifestContent);
        if (_hasManifestFabricMetaConfiguration) {
            console.warn('AndroidManifest.xml already has Fabric meta data configured.');
        } else {
            console.warn('Missing AndroidManifest.xml meta data for Fabric. Configuring...');
            replace.sync({
                files: _manifestPath,
                from: /<\/application>/g,
                to: '<meta-data\nandroid:name="io.fabric.ApiKey"\nandroid:value="79444ddc2645f3411376cb50c4062dd2cc2a3721" />\n</application>'
            });
            console.warn('Fabric configuration done in ' + _manifestPath);
        }
        var _hasManifestInternetConfiguration = /android:name=\"android.permission.INTERNET\"/g.test(_manifestContent);
        if (_hasManifestInternetConfiguration) {
            console.warn('AndroidManifest.xml already has user internet access configured.');
        } else {
            console.warn('Missing AndroidManifest.xml user permission for Internet access. Configuring...');
            replace.sync({
                files: _manifestPath,
                from: /<\/manifest>/g,
                to: '<uses-permission android:name="android.permission.INTERNET" />\n</manifest>'
            });
            console.warn('Internet configuration done in ' + _manifestPath);
        }

        //Localizando o arquivo build.gradle
        var _buildPath = path.resolve(ctx.opts.projectRoot, 'platforms', 'android', 'build.gradle');
        var _templateContent = fs.readFileSync('hooks/build_gradle_crashlytics_android_configuration.tmpl', { encoding: 'utf8' });
        fs.writeFileSync(_buildPath, _templateContent);
        console.info('Configuration done in ' + _buildPath + '. File replaced.');

        //Localizando o MainActivity.java
        var _mainActivityPath = glob.sync(path.resolve(ctx.opts.projectRoot, 'platforms', 'android', 'src') + '/**/MainActivity.java')[0];
        var _mainActivityContent = fs.readFileSync(_mainActivityPath, { encoding: 'utf8' });
        var _hasMainActivityConfigurtion = /import com.crashlytics.android.Crashlytics/g.test(_mainActivityContent);
        if (_hasMainActivityConfigurtion) {
            console.warn('MainActivity.java already configured to use Fabric Crashlytics.');
        } else {
            console.warn('Missing MainActivity.java Fabric Crashlytics settings. Configuring...');
            replace.sync({
                files: _mainActivityPath,
                from: /\import org.apache.cordova.\*;/g,
                to: 'import org.apache.cordova.*;\nimport com.crashlytics.android.Crashlytics;\nimport io.fabric.sdk.android.Fabric;'
            });
            replace.sync({
                files: _mainActivityPath,
                from: /super.onCreate\(savedInstanceState\);/g,
                to: 'super.onCreate(savedInstanceState);\nFabric.with(this, new Crashlytics());'
            });
            console.warn('Configuration done in ' + _mainActivityPath);
        }

        deferral.resolve();

        return deferral.promise;
    };

    module.exports = _program;

}());