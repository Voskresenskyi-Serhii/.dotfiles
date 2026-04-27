#!/usr/bin/env bash
# install.sh — dotfiles setup for a new machine
# Creates symlinks from $HOME to the dotfiles repo.
# Safe to re-run: skips existing symlinks, warns on conflicts.

set -euo pipefail

DOTFILES="$HOME/.dotfiles"
CONFIG="$DOTFILES/.config"

info()  { echo "  [•] $*"; }
ok()    { echo "  [✓] $*"; }
warn()  { echo "  [!] $*" >&2; }

symlink() {
  local src="$1" dst="$2"
  if [ -L "$dst" ]; then
    ok "Already linked: $dst"
  elif [ -e "$dst" ]; then
    warn "Conflict (not a symlink): $dst — skipping. Remove it manually to link."
  else
    ln -s "$src" "$dst"
    info "Linked: $dst → $src"
  fi
}

echo ""
echo "==> Linking ~/.config entries"

# All config dirs/files that get a direct symlink (entire directory)
CONFIG_LINKS=(
  alacritty
  autostart
  dconf
  dunst
  EOS-greeter.conf
  example.picom.conf
  go
  gtk-3.0
  gtk-4.0
  i3
  mimeapps.list
  nano
  neofetch
  nwg-look
  ohmyposh
  openweather
  pavucontrol.ini
  pulse
  reflector-simple-free-params.txt
  rofi
  Thunar
  user-dirs.dirs
  user-dirs.locale
  welcome.conf
  xfce4
  xsettingsd
)

for entry in "${CONFIG_LINKS[@]}"; do
  symlink "$CONFIG/$entry" "$HOME/.config/$entry"
done

echo ""
echo "==> Setting up VS Code user settings (individual file symlinks)"
# VS Code: create real directory structure, symlink only user-facing files.
# This keeps runtime/machine-specific state (state.vscdb, machineid, Cache…)
# out of dotfiles, preventing stale Settings Sync state on new machines.

CODE_USER="$HOME/.config/Code/User"
DOTFILES_CODE_USER="$CONFIG/Code/User"

mkdir -p "$CODE_USER"

CODE_USER_LINKS=(
  settings.json
  keybindings.json
  mcp.json
  tasks.json
  chatLanguageModels.json
  mcp
  snippets
)

for entry in "${CODE_USER_LINKS[@]}"; do
  symlink "$DOTFILES_CODE_USER/$entry" "$CODE_USER/$entry"
done

echo ""
echo "==> Linking home dotfiles"
symlink "$DOTFILES/.zshrc" "$HOME/.zshrc"

echo ""
echo "Done! Open a new shell or run: source ~/.zshrc"
echo ""
echo "Note: VS Code extensions must be installed separately."
echo "      If CachedExtensionVSIXs/ exists, you can run:"
echo "      for f in ~/.dotfiles/.config/Code/CachedExtensionVSIXs/*; do"
echo "        tmp=\"/tmp/\$(basename \"\$f\").vsix\"; cp \"\$f\" \"\$tmp\";"
echo "        code --install-extension \"\$tmp\"; rm \"\$tmp\"; done"
