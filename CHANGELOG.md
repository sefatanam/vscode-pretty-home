## Changelog

### Version 1.0.0 (2024-07-13)
Pretty Home is a VS Code extension designed to enhance the appearance of your recent projects view, making it more organized and visually appealing.

#### Features

- Grid Layout: Displays recent projects in a clean grid layout.
- Concise Information: Provides project titles and URLs for quick reference.
- Styling: Adapts seamlessly to all VS Code themes.
- Improved Readability: Enhances visual hierarchy and readability.

> **Recommended** to set `"workbench.startupEditor": "none"` in `settings.json` globally which mean disable the default vscode welcome page. **But if you don't want to then it's fine**.

#### Known Issues

- Currently, no known issues.


### Version 1.1.0 (2024-07-16)

#### Features
- Pretty Home now configurable to show default in homepage accessible from command pallete
- New command pallete option for put star in github

#### Fix
- Loading icon in tab bar
- Fix typo in no project found

#### Known Issues

- Multiple Pretty Home instance keep opening on focus out from tab and back again.

### Version 1.1.1 (2024-07-26)

#### Fix
- Multiple Pretty Home instance keep opening on focus out from tab and back again.

#### Known Issues

- Load on startup by default

### Version 1.1.2 (2024-07-26)

#### Fix
- Load on startup by default
> Recommended to set `"workbench.startupEditor": "none"` in `settings.json` globally which mean disable the default vscode welcome page.

- Remove redundant `Pretty Home Initialized ✨` notification


#### Known Issue 
- [Pretty home instance open multiple instances on profile switch](https://github.com/sefatanam/vscode-pretty-home/issues/3)


### Version 1.1.3 (2024-07-30)

#### Fix

- [Fix Pretty home instance open multiple instances on profile switch](https://github.com/sefatanam/vscode-pretty-home/issues/3)

#### Known Issue

- State issue to memorize opening tab instance

### Version 1.1.4 (2024-07-30)

- Fix state issue to memorize opening tab instance

### Version 1.1.50 (2024-07-31)

- Update open instance logic, added logger in output channel and performance improvment.

### Version 1.1.51 (2024-08-05)
- Extension download size optimize (100kb~) from 246kb to 155kb