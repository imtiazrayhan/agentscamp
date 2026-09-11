---
title: "How to Update Claude Code (and Fix Update Errors)"
seoTitle: "How to Update Claude Code: claude update vs npm, Fix Errors"
description: "Update Claude Code for every install method: claude update vs npm install -g, auto-update channels, pinning a version, and fixes for common update errors."
author: "Imtiaz Rayhan"
date: "2026-09-11"
color: "green"
topics: ["workflow-prompting"]
audience: ["developers", "founders"]
tags: ["claude-code", "update", "installation", "npm", "troubleshooting"]
summary: "Run claude update on a native install, which also updates itself in the background, and npm install -g @anthropic-ai/claude-code@latest on an npm install; never npm update -g. Homebrew, WinGet and Linux packages don't auto-update, so upgrade them with their package manager. claude doctor reports install health and update status."
keyTakeaways:
  - "Native installs update in the background and apply the update on the next startup; claude update applies it immediately."
  - "On npm, update with npm install -g @anthropic-ai/claude-code@latest. npm update -g respects the original semver range and can leave you on a stale version."
  - "Homebrew, WinGet, apt, dnf and apk installs don't auto-update by default; upgrade them through the package manager."
  - "Choose the latest or stable channel with autoUpdatesChannel, set a floor with minimumVersion, and stop background updates with DISABLE_AUTOUPDATER."
  - "Most update errors are duplicate installs or PATH problems: which -a claude finds them, and claude doctor reports install health and update status."
howtoSteps:
  - name: "Find your install type"
    text: "Run claude --version and claude doctor, then which -a claude (where.exe claude on Windows). A binary in ~/.local/bin is the native installer; anything else came from npm or a package manager."
  - name: "Run the matching update command"
    text: "Native: claude update. npm: npm install -g @anthropic-ai/claude-code@latest. Homebrew: brew upgrade claude-code. WinGet: winget upgrade Anthropic.ClaudeCode. apt, dnf or apk: upgrade the claude-code package."
  - name: "Choose a release channel"
    text: "Leave autoUpdatesChannel on latest to get new features immediately, or switch to stable, about a week behind, in /config or settings.json."
  - name: "Decide on automatic updates"
    text: "Native installs update themselves. Set DISABLE_AUTOUPDATER to 1 to stop the background check, or set CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE to 1 to have Claude Code run Homebrew or WinGet upgrades for you."
  - name: "Remove duplicate installs"
    text: "If which -a claude lists more than one path, uninstall the extras and delete any legacy ~/.claude/local directory, so the claude you update is the one that runs."
  - name: "Verify the update"
    text: "Open a new terminal, run claude --version to confirm the new version, and run claude doctor to confirm install health and update status."
faq:
  - q: "Should I use claude update or npm install -g @anthropic-ai/claude-code@latest?"
    a: "Use the one that matches how you installed. claude update is the native installer's command, and it also works on an npm install. npm install -g @anthropic-ai/claude-code@latest is the documented npm update. Never use npm update -g, which can leave you on a stale version."
  - q: "What does the claude doctor command do?"
    a: "claude doctor is a read-only health check that runs without starting a session. It reports installation health, update status, settings-file validation and warnings, so it is the first thing to run when an update misbehaves."
  - q: "Does Claude Code update automatically?"
    a: "Native installs do, and so do npm global installs when npm's global directory is writable. They check for and download updates in the background, and the update takes effect the next time you start Claude Code. Homebrew, WinGet, apt, dnf and apk installs don't auto-update by default."
  - q: "How do I turn off Claude Code auto-updates?"
    a: "Set DISABLE_AUTOUPDATER to 1 in the env block of settings.json. That stops the background check but still lets you run claude update by hand. To block every update path, including manual ones, set DISABLE_UPDATES to 1 instead."
  - q: "Why is Claude Code still on the old version after updating?"
    a: "Usually a second install sits earlier on your PATH, so run which -a claude (where.exe claude on Windows) and remove the extras. A native update also takes effect only on the next startup, and a custom launcher at ~/.local/bin/claude decides which installed version actually runs."
  - q: "How do I install a specific version of Claude Code?"
    a: "Pass the version to the native installer by piping it into bash -s followed by the version number, or bash -s stable for the stable channel. If you want to stay on that version, turn off the background updater afterwards with DISABLE_AUTOUPDATER."
sources:
  - title: "Set up Claude Code"
    url: "https://code.claude.com/docs/en/setup"
    publisher: "Anthropic"
  - title: "Troubleshoot Claude Code installation"
    url: "https://code.claude.com/docs/en/troubleshoot-install"
    publisher: "Anthropic"
  - title: "Claude Code changelog"
    url: "https://code.claude.com/docs/en/changelog"
    publisher: "Anthropic"
related: ["guide:installing-claude-code", "guide:claude-code-troubleshooting", "tool:claude-code", "guide:claude-code-tips", "guide:claude-code-settings-permissions", "guide:claude-code-slash-commands"]
---

Update [Claude Code](/tools/claude-code) with `claude update` if you used the native installer, which also updates itself in the background. If you installed with npm, run `npm install -g @anthropic-ai/claude-code@latest`, and never `npm update -g`. Homebrew, WinGet and Linux package installs don't auto-update, so upgrade them with their own package manager.

## Update commands by install method

| Install method | Update command | Auto-updates? |
|---|---|---|
| Native installer | `claude update` | Yes, by default |
| npm global | `npm install -g @anthropic-ai/claude-code@latest` | Yes, if npm's global directory is writable |
| Homebrew, `claude-code` cask | `brew upgrade claude-code` | No (opt-in) |
| Homebrew, `claude-code@latest` cask | `brew upgrade claude-code@latest` | No (opt-in) |
| WinGet | `winget upgrade Anthropic.ClaudeCode` | No (opt-in) |
| apt | `sudo apt update && sudo apt upgrade claude-code` | No |
| dnf | `sudo dnf upgrade claude-code` | No |
| apk | `apk update && apk upgrade claude-code` | No |

The native installer covers macOS, Linux, WSL and Windows. "Opt-in" means Claude Code can run the package manager's upgrade for you in the background, as covered in the auto-update section below.

## Check your version and install type

```bash
claude --version
claude doctor
```

`claude --version` prints the installed version. `claude doctor` is a read-only health check that runs without starting a session. It reports:
- installation health;
- update status;
- settings-file validation;
- any warnings.

Inside a session, `/doctor` runs the same kind of setup diagnostics.

To see which binary you are actually running, list every `claude` on your `PATH`:

```bash
which -a claude
```

On Windows, use `where.exe claude`. The path tells you the install type:

| Path | Install type |
|---|---|
| `~/.local/bin/claude` | Native installer (a symlink into `~/.local/share/claude/versions/`) |
| `%USERPROFILE%\.local\bin\claude.exe` | Native installer on Windows |
| `~/.claude/local/` | Legacy local npm install from older versions; remove it |
| Your npm global prefix | npm global install |

More than one line of output means you have duplicate installs. The fixes are covered further down.

## claude update vs npm install -g

Both commands exist, and the right one depends on your install:

- **Native install:** `claude update` downloads and applies the update immediately, instead of waiting for the background check.
- **npm install:** the documented update is `npm install -g @anthropic-ai/claude-code@latest`. `claude update` also works on an npm install.
- **Never use `npm update -g`.** It respects the semver range from your original install and can silently leave you on a stale version.

As of September 2026, the npm path needs Node.js 22 or later, and it is also the path that collects permission errors. Unless you need Claude Code pinned alongside other global npm tooling, move to the native installer. It has no dependencies and keeps itself current.

## How auto-updates work

Native installs check for updates in the background, download them, and apply them the next time you start Claude Code. npm global installs update themselves the same way when npm's global directory is writable. Package-manager installs don't unless you opt in.

### Release channels

| Channel | What you get |
|---|---|
| `"latest"` (default) | New features as soon as they are released |
| `"stable"` | A version about a week old that skips releases with major regressions |

Change the channel in `/config` under Auto-update channel, or in [settings.json](/guides/configuration/claude-code-settings-permissions):

```json
{ "autoUpdatesChannel": "stable" }
```

Homebrew picks the channel by cask instead of by setting. `claude-code` tracks stable and `claude-code@latest` tracks latest.

### Version floors and admin limits

`minimumVersion` sets a floor. Auto-updates and `claude update` refuse any version below it. The docs pair it with the stable channel. The version number below is the docs' example value, not a recommendation:

```json
{ "autoUpdatesChannel": "stable", "minimumVersion": "2.1.100" }
```

When you switch from `latest` to `stable` in `/config`, Claude Code offers to keep you on your current version and sets `minimumVersion` for you. Organizations can enforce `requiredMinimumVersion` and `requiredMaximumVersion` through managed settings, and user or project settings can't override those.

### Package-manager auto-updates

Homebrew and WinGet can update in the background too. Set `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE=1` in your environment, or in the `env` block of settings.json, and Claude Code runs the package manager's upgrade for you. apt, dnf and apk installs never auto-update. Updates arrive through your normal system upgrade and still need elevated privileges.

### Turn auto-updates off

Add this to settings.json:

```json
{ "env": { "DISABLE_AUTOUPDATER": "1" } }
```

This stops only the background check; `claude update` and `claude install` still work when you run them. To block every update path, manual ones included, set `DISABLE_UPDATES=1` instead. That suits locked-down machines where updates come from IT.

## Update each install type

### Native installer

```bash
claude update
```

The installer manages `~/.local/bin/claude` as a symlink into `~/.local/share/claude/versions/`. `claude update` installs the new version there and applies it immediately.

### npm

```bash
npm install -g @anthropic-ai/claude-code@latest
```

Don't prefix this with `sudo`. A root-owned global install leaves files in the npm prefix that break future installs. The fix for `EACCES` is in the errors section below.

### Homebrew

```bash
brew upgrade claude-code
brew upgrade claude-code@latest
```

Run the line that matches the cask you installed: `claude-code` for stable, `claude-code@latest` for the latest channel.

### WinGet

```powershell
winget upgrade Anthropic.ClaudeCode
```

Close Claude Code first. Windows locks the running executable, so an upgrade can fail while a session is open.

### apt, dnf and apk

```bash
sudo apt update && sudo apt upgrade claude-code
sudo dnf upgrade claude-code
apk update && apk upgrade claude-code
```

These go through your system's package manager, not through Claude Code.

## Move from npm to the native installer

The setup docs don't provide a one-step migration command. The path is to uninstall the npm copy, install natively, and check that only one `claude` remains:

```bash
npm uninstall -g @anthropic-ai/claude-code
curl -fsSL https://claude.ai/install.sh | bash
```

On Windows, install with PowerShell instead:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Then run `which -a claude` again; it should list only `~/.local/bin/claude`. If an older version left a `~/.claude/local/` directory, remove it:

```bash
rm -rf ~/.claude/local
```

If your shell now says `claude` isn't found, add `~/.local/bin` to your `PATH` using the fix in the errors section. For a fresh machine, [Installing Claude Code](/guides/getting-started/installing-claude-code) walks through the whole setup.

## Pin a version or roll back

The native installer accepts a version or a channel. In this example, `2.1.89` is the docs' sample value; swap in the version you need:

```bash
curl -fsSL https://claude.ai/install.sh | bash -s 2.1.89
curl -fsSL https://claude.ai/install.sh | bash -s stable
```

On npm, add the version to the package name with standard npm syntax: `npm install -g @anthropic-ai/claude-code@<version>`.

As of September 2026, the docs don't describe a dedicated rollback command. To go back, reinstall the version you want with the installer's version argument. If you want to stay there, set `DISABLE_AUTOUPDATER` afterwards.

For finer control, replace `~/.local/bin/claude` with your own launcher script or symlink. Updates still land under `~/.local/share/claude/versions/`, but your launcher decides which version runs. Fleets should pin through `requiredMinimumVersion` and `requiredMaximumVersion` in managed settings instead.

## Fix update errors

### npm left you on an old version

You probably ran `npm update -g`. Rerun the update with the explicit tag:

```bash
npm install -g @anthropic-ai/claude-code@latest
```

### EACCES or permission errors with npm

Don't reach for `sudo npm install -g`. You have three fixes:
- Point npm at a user-writable prefix with `npm config set prefix ~/.npm-global`, then add `~/.npm-global/bin` to your `PATH`.
- Install Node through nvm, which avoids the problem entirely.
- Switch to the native installer, the simplest fix of the three.

### "command not found: claude" after switching installs

The native binary lives in `~/.local/bin`, and that directory isn't on your `PATH`. For zsh, the macOS default:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

For bash on Linux:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc
```

For Windows PowerShell, then restart the terminal:

```powershell
$currentPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
[Environment]::SetEnvironmentVariable('PATH', "$currentPath;$env:USERPROFILE\.local\bin", 'User')
```

### The wrong version runs after an update

There are three likely causes:
- **Duplicate installs.** `which -a claude` (or `where.exe claude`) lists every copy. Remove the ones you don't want.
- **No restart.** A background update applies on the next startup, so restart the session.
- **A custom launcher.** If you replaced `~/.local/bin/claude` yourself, it may point at an old version. Remove it and let Claude Code manage the link again:

```bash
rm ~/.local/bin/claude
claude update
```

To remove duplicate installs, use the line for each copy you don't want:

```bash
rm -f ~/.local/bin/claude && rm -rf ~/.local/share/claude   # native (macOS/Linux)
npm uninstall -g @anthropic-ai/claude-code                  # npm global
rm -rf ~/.claude/local                                      # legacy local npm
brew uninstall --cask claude-code                           # Homebrew
winget uninstall Anthropic.ClaudeCode                       # WinGet
```

### WinGet upgrade fails

Windows locks the executable while Claude Code runs. Exit every session, then rerun `winget upgrade Anthropic.ClaudeCode`.

### Updates refuse to run

Check three settings:
- **`DISABLE_UPDATES`** blocks every update path, including `claude update`.
- **`minimumVersion`** makes the updater refuse anything below it.
- **`requiredMaximumVersion`**, on managed machines, caps the version and can't be overridden locally.

`claude doctor` validates your settings files and reports update status, so run it before editing anything.

### Homebrew or Linux packages never update

This is expected. They don't auto-update by default. Run the package manager's upgrade from the table at the top, or, for Homebrew and WinGet, set `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE=1`.

For problems beyond updating, such as auth, context limits or MCP servers, see [Claude Code troubleshooting](/guides/troubleshooting/claude-code-troubleshooting).

## See what changed

Anthropic publishes release notes in the [Claude Code changelog](https://code.claude.com/docs/en/changelog). Claude Code ships frequently, so compare the changelog against your `claude --version` rather than trusting a version number quoted in a blog post, including this one. If new releases keep disrupting your work, switch to the `stable` channel, which skips releases with major regressions.

## Next steps

Once you're current:
- [25 Claude Code tips](/guides/getting-started/claude-code-tips) covers the shortcuts and power features worth learning next.
- [Claude Code slash commands](/guides/configuration/claude-code-slash-commands) explains `/config`, `/doctor` and the rest of the built-ins.
- [Adding MCP servers](/guides/mcp/claude-code-mcp-setup) helps when `/doctor` flags your MCP servers.
- [Running Claude Code in CI](/guides/advanced/claude-code-ci-github-actions) covers automation. There, pin the version with the installer's version argument so an update doesn't change behavior mid-pipeline.
