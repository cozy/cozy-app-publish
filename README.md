# Cozy App Publish
![https://npmjs.org/package/cozy-app-publish](https://img.shields.io/npm/v/cozy-app-publish.svg)
![https://github.com/cozy/cozy-app-publish/LICENSE](https://img.shields.io/npm/l/cozy-app-publish.svg)
![https://travis-ci.org/cozy/cozy-app-publish](https://img.shields.io/travis/cozy/cozy-app-publish.svg)
![https://npmjs.org/package/cozy-app-publish](https://img.shields.io/npm/dm/cozy-app-publish.svg)

### What's cozy-app-publish?

`cozy-app-publish` is a command line tool that publish a Cozy application to the Cozy registry according to some options.

#### Requirements

 - Node.js version 8 or higher;

### Install

```
yarn add --dev cozy-app-publish
```

### Registry documentation

You can find more information about the registry and how to prepare an application to be published in the [official registry documentation](https://github.com/cozy/cozy-stack/blob/master/docs/registry.md).

### Usage via Travis CI (recommended)

First of all, don't forget to build the application:
```
# build the application (in the ./build folder here)
yarn build
```

Then, just publish it using the Travis CI workflow:
```
# publish it, REGISTRY_TOKEN should be
# encrypted and provided via Travis CI environment
# BUILD_COMMIT is your last build commit hash (git rev-parse build)
yarn cozy-app-publish \
--token $REGISTRY_TOKEN \
--build-commit $BUILD_COMMIT
```

### Manual usage (not recommended)

First of all, don't forget to build the application:
```
# build the application (in the ./build folder here)
yarn build
```

Then, just publish it using:
```
yarn cozy-app-publish \
--token $REGISTRY_TOKEN \
--build-url https://github.com/cozy/cozy-collect/archive/042cef26d9d33ea604fe4364eaab569980b500c9.tar.gz \
--manual-version 1.0.2-dev.042cef26d9d33ea604fe4364eaab569980b500c9
```

### Options

##### `--token <editor-token>` (required)

The registry editor token. This token must match the editor name and is provided by Cozy Cloud (with the name) in order to use the registry.

##### `--build-dir <relative-path>`

The path to the build folder, relative to the current directory. Since the 'standard' Cozy application builds in the `build/` folder, `build` is the default value. This folder is mainly used to read the application manifest during publishing.

##### `--build-url <url>`

For now, the registry a build archive (.tar.gz file) from an external link to be used in the cozy-stack. In the travis script, this url is computed using the Github trick to get archives from a commit url (but it's overwritten if provided by this option). For the manual script, we have to provide it.

##### `--build-commit <commit-hash>`

Using the `travis` mode, the archive tarball URL is computed using github and the build commit hash. If you are not on your build branch to publish, you can specify the correct build commit hash using this parameter.

##### `--manual-version <version>` (required for manual usage only)

In the manual mode, we don't have a way to compute the version like in the Travis mode for example. So we have to provide it using this option.

##### `--registry-url <url>`

The url of the registry, by default it will be https://staging-apps-registry.cozycloud.cc.

##### `--space <space-name>`

Use this options to provide a specific space name of the registry to publish the application in. By default it will be published in the default space.

##### `--verbose`

To print more logs when using tool (useful for debug).
