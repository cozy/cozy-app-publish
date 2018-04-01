/* eslint-env jest */
const fs = require('fs-extra')
const path = require('path')

const publishLib = require('../lib/publish')

const rootPath = process.cwd()
const testFolder = '.tmp_test'
const testPath = path.join(rootPath, testFolder)
const mockAppDir = path.join(__dirname, 'mockApp')

jest.mock('../lib/publish', () => jest.fn((options, finishCallback) => {
  finishCallback()
}))

const commons = {
  token: 'registryTokenForTest123',
  slug: 'mock-app',
  commitHash: 'f4a98378271c17e91faa9e70a2718c34c04cfc27',
  editor: 'cozy',
  branchName: 'build'
}

// simulate TRAVIS CI environment variables
jest.doMock('../utils/getTravisVariables', () =>
  jest.fn()
  .mockImplementationOnce(() => ({
    TRAVIS_PULL_REQUEST: 'false',
    TRAVIS_BRANCH: 'build',
    TRAVIS_BUILD_DIR: '.',
    TRAVIS_TAG: null,
    TRAVIS_COMMIT: commons.commitHash,
    TRAVIS_REPO_SLUG: commons.slug,
    // encrypted variables
    REGISTRY_TOKEN: commons.token
  }))
  .mockImplementationOnce(() => ({
    TRAVIS_PULL_REQUEST: 'false',
    TRAVIS_BRANCH: 'build',
    TRAVIS_BUILD_DIR: '.',
    TRAVIS_TAG: '2.1.8',
    TRAVIS_COMMIT: commons.commitHash,
    TRAVIS_REPO_SLUG: commons.slug,
    // encrypted variables
    REGISTRY_TOKEN: commons.token
  }))
  .mockImplementationOnce(() => ({
    TRAVIS_PULL_REQUEST: 'false',
    TRAVIS_BRANCH: 'build',
    TRAVIS_BUILD_DIR: '.',
    TRAVIS_TAG: null,
    TRAVIS_COMMIT: commons.commitHash,
    TRAVIS_REPO_SLUG: commons.slug,
    // encrypted variables
    REGISTRY_TOKEN: commons.token
  }))
  .mockImplementationOnce(() => ({
    TRAVIS_PULL_REQUEST: 'false',
    TRAVIS_BRANCH: 'master',
    TRAVIS_BUILD_DIR: '.',
    TRAVIS_TAG: null,
    TRAVIS_COMMIT: commons.commitHash,
    TRAVIS_REPO_SLUG: commons.slug,
    // encrypted variables
    REGISTRY_TOKEN: commons.token
  }))
  .mockImplementationOnce(() => ({
    TRAVIS_PULL_REQUEST: 'true',
    TRAVIS_BRANCH: 'build',
    TRAVIS_BUILD_DIR: '.',
    TRAVIS_TAG: null,
    TRAVIS_COMMIT: commons.commitHash,
    TRAVIS_REPO_SLUG: commons.slug,
    // encrypted variables
    REGISTRY_TOKEN: commons.token
  }))
  .mockImplementationOnce(() => ({
    TRAVIS_PULL_REQUEST: 'false',
    TRAVIS_BRANCH: 'build',
    TRAVIS_BUILD_DIR: '.',
    TRAVIS_TAG: null,
    TRAVIS_COMMIT: commons.commitHash,
    TRAVIS_REPO_SLUG: commons.slug,
    // encrypted variables
    REGISTRY_TOKEN: commons.token
  }))
  .mockImplementationOnce(() => ({
    TRAVIS_PULL_REQUEST: 'false',
    TRAVIS_BRANCH: 'build',
    TRAVIS_BUILD_DIR: '.',
    TRAVIS_TAG: null,
    TRAVIS_COMMIT: commons.commitHash,
    TRAVIS_REPO_SLUG: commons.slug,
    // encrypted variables
    REGISTRY_TOKEN: ''
  }))
)

const travisScript = require('../lib/travis')

function getOptions (editor, branchName) {
  const options = {
    registryEditor: editor,
    branchName: branchName || 'build',
    spaceName: 'mock_space',
    travis: true
  }
  return options
}

describe('Travis publishing script', () => {
  beforeAll(() => {
    // create the app test folder
    fs.ensureDirSync(testPath)
    process.chdir(testPath)
    // copy the app mock content
    fs.copySync(mockAppDir, testPath, { overwrite: true })
  })

  afterAll(() => {
    // get out of the test folder
    process.chdir('..')
    // remove the test folder
    fs.removeSync(testPath)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should work correctly if Travis environment variable provided (no TRAVIS_TAG)', (done) => {
    travisScript(getOptions(commons.editor), (error) => {
      // we use done callback to avoid process.exit which will kill the jest process
      expect(error).toBeUndefined()
      expect(publishLib).toHaveBeenCalledTimes(1)
      expect(publishLib.mock.calls[0][0]).toMatchSnapshot()
      done()
    })
  })

  it('should work correctly with TRAVIS_TAG', (done) => {
    travisScript(getOptions(commons.editor), (error) => {
      // we use done callback to avoid process.exit which will kill the jest process
      expect(error).toBeUndefined()
      expect(publishLib).toHaveBeenCalledTimes(1)
      expect(publishLib.mock.calls[0][0]).toMatchSnapshot()
      done()
    })
  })

  it('should work correctly if no space name provided', (done) => {
    const options = getOptions(commons.editor)
    delete options.spaceName
    travisScript(options, (error) => {
      // we use done callback to avoid process.exit which will kill the jest process
      expect(error).toBeUndefined()
      expect(publishLib).toHaveBeenCalledTimes(1)
      expect(publishLib.mock.calls[0][0]).toMatchSnapshot()
      done()
    })
  })

  it('should handle correctly and not publish if it is the wrong branch', (done) => {
    travisScript(getOptions(commons.editor), (error) => {
      // we use done callback to avoid process.exit which will kill the jest process
      expect(error).toBeUndefined()
      expect(publishLib).toHaveBeenCalledTimes(0)
      done()
    })
  })

  it('should handle correctly and not publish if it is a pull request', (done) => {
    travisScript(getOptions(commons.editor), (error) => {
      // we use done callback to avoid process.exit which will kill the jest process
      expect(error).toBeUndefined()
      expect(publishLib).toHaveBeenCalledTimes(0)
      done()
    })
  })

  it('should throw an error if the editor is missing', () => {
    expect(() => travisScript(
      getOptions(null), jest.fn())
    ).toThrowErrorMatchingSnapshot()
  })

  it('should throw an error if the token is missing', () => {
    expect(() => travisScript(
      getOptions(commons.editor), jest.fn())
    ).toThrowErrorMatchingSnapshot()
  })
})
