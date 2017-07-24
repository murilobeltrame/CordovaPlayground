#!/usr/bin/env node

(function() {

    'use strict';

    var _program = function(ctx) {
        console.log('Configuration Crashlytics para projeto iOS.');
        if (ctx.opts.platforms.indexOf('ios') < 0) {
            console.error('There`s no iOS project configured.');
            return;
        }
        var fs = ctx.requireCordovaModule('fs'),
            path = ctx.requireCordovaModule('path'),
            deferral = ctx.requireCordovaModule('q').defer();
        var replace = require('replace-in-file'),
            glob = require('glob');

        //configurando scripts no projeto
        var _appPBXProjectPath = glob.sync(path.resolve(ctx.opts.projectRoot, 'platforms', 'ios') + '/*.xcodeproj/*.pbxproj');
        var _appPBXProjectContent = fs.readFileSync(_appPBXProjectPath, { encoding: 'utf8' });
        var _hasPBXProjectConfiguration = /shellScript = ".\/Fabric.framework\/run/g.test(_appPBXProjectContent);
        if (_hasPBXProjectConfiguration) {
            console.warn('XCodeProject already configured to use Fabric Crashlytics.');
        } else {
            console.warn('Missing XCodeProject Fabric Crashlytics settings. Configuring...');
            replace.sync({
                files: _appPBXProjectPath,
                from: /\/* End PBXShellScriptBuildPhase section *\//g,
                to: 'E758967D1F2515030089C9E6 /* ShellScript */ = {\nisa = PBXShellScriptBuildPhase;\nbuildActionMask = 2147483647;\nfiles = (\n);\ninputPaths = (\n);\noutputPaths = (\n);\nrunOnlyForDeploymentPostprocessing = 0;\nshellPath = /bin/sh;\nshellScript = "./Fabric.framework/run 79444ddc2645f3411376cb50c4062dd2cc2a3721 14a241a73a95dc995694698fbad4d4360d5d43a71d88bc95bab8011e61705df5";\n};\n /* End PBXShellScriptBuildPhase section */ '
            });
            console.warn('Configuration done in ' + _appPBXProjectPath);
        }
        //adicionando plataformas
        //Configurando Libs no Produto
        var _cordovaLibPBXProjectPath = path.resolve(ctx.opts.projectRoot, 'platforms', 'ios', 'CordovaLib', 'CordovaLib.xcodeproj', 'project.pbxproj');
        var _cordovaLibPBXProjectContent = fs.readFileSync(_cordovaLibPBXProjectPath, { encoding: 'utf8' });
        var _hasCordovaLibPBXProjectConfiguration = /FRAMEWORK_SEARCH_PATHS = "..\/\*\*";/g.test(_cordovaLibPBXProjectContent);
        if (_hasCordovaLibPBXProjectConfiguration) {
            console.warn('CordovaLibProject already configured to use Fabric Crashlytics.');
        } else {
            console.warn('Missing CordovaLibProject Fabric Crashlytics settings. Configuring...');
            replace.sync({
                files: _cordovaLibPBXProjectPath,
                from: /FRAMEWORK_SEARCH_PATHS = "";/g,
                to: 'FRAMEWORK_SEARCH_PATHS = "../**";'
            });
            console.warn('Configuration done in ' + _cordovaLibPBXProjectPath);
        }
        //atualizando o CDVAppDelegate.m
        var _appDelegatePath = glob.sync(path.resolve(ctx.opts.projectRoot, 'platforms', 'ios', 'CordovaLib', 'Classes', 'Public') + '/**/CDVAppDelegate.m')[0];
        var _appDelegateContent = fs.readFileSync(_appDelegatePath, { encoding: 'utf8' });
        var _hasAppDelegateConfiguration = /#import <Fabric\/Fabric.h>/g.test(_appDelegateContent);
        if (_hasAppDelegateConfiguration) {
            console.warn('AppDelegate.m already configured to use Fabric Crashlytics.');
        } else {
            console.warn('Missing AppDelegate.m Fabric Crashlytics settings. Configuring...');
            replace.sync({
                files: _appDelegatePath,
                from: /#import "CDVAppDelegate.h"/g,
                to: '#import "CDVAppDelegate.h"\n#import <Fabric/Fabric.h>\n#import <Crashlytics/Crashlytics.h>'
            });
            replace.sync({
                files: _appDelegatePath,
                from: /[self.window makeKeyAndVisible];/g,
                to: '[self.window makeKeyAndVisible];\n[Fabric with:@[[Crashlytics class]]];'
            });
            console.warn('Configuration done in ' + _appDelegatePath);
        }
    };

    module.exports = _program;

}());