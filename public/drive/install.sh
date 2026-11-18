#!/bin/sh
set -eu

RELEASE_REPOSITORY="Saasolution-sl/SaaSolution"
INSTALL_ROOT="${XDG_DATA_HOME:-$HOME/.local/share}/saasolution-drive"
BIN_ROOT="${XDG_BIN_HOME:-$HOME/.local/bin}"

fail() {
  printf '%s\n' "SaaSolution Drive installer: $*" >&2
  exit 1
}

command -v curl >/dev/null 2>&1 || fail "curl is required."
command -v tar >/dev/null 2>&1 || fail "tar is required."

case "$(uname -m)" in
  x86_64|amd64) ARCH="x86_64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *) fail "unsupported architecture: $(uname -m)" ;;
esac

ASSET_NAME="saasolution-drive-linux-${ARCH}.tar.gz"
CHECKSUM_NAME="${ASSET_NAME}.sha256"
API_URL="https://api.github.com/repos/${RELEASE_REPOSITORY}/releases/latest"
RELEASE_JSON="$(curl -fsSL -H 'Accept: application/vnd.github+json' "$API_URL")" || fail "no public Linux release is available yet."
ASSET_URL="$(printf '%s' "$RELEASE_JSON" | grep -o 'https://[^\"]*/'"${ASSET_NAME}" | head -n 1 || true)"
CHECKSUM_URL="$(printf '%s' "$RELEASE_JSON" | grep -o 'https://[^\"]*/'"${CHECKSUM_NAME}" | head -n 1 || true)"

[ -n "$ASSET_URL" ] || fail "${ASSET_NAME} is not part of the latest release."
[ -n "$CHECKSUM_URL" ] || fail "the required checksum file is missing."

TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT HUP INT TERM
curl -fL "$ASSET_URL" -o "$TEMP_DIR/$ASSET_NAME"
curl -fL "$CHECKSUM_URL" -o "$TEMP_DIR/$CHECKSUM_NAME"

if command -v sha256sum >/dev/null 2>&1; then
  (cd "$TEMP_DIR" && sha256sum -c "$CHECKSUM_NAME")
elif command -v shasum >/dev/null 2>&1; then
  EXPECTED="$(awk '{print $1}' "$TEMP_DIR/$CHECKSUM_NAME")"
  ACTUAL="$(shasum -a 256 "$TEMP_DIR/$ASSET_NAME" | awk '{print $1}')"
  [ "$EXPECTED" = "$ACTUAL" ] || fail "checksum verification failed."
else
  fail "sha256sum or shasum is required to verify the download."
fi

rm -rf "$INSTALL_ROOT"
mkdir -p "$INSTALL_ROOT" "$BIN_ROOT"
tar -xzf "$TEMP_DIR/$ASSET_NAME" -C "$INSTALL_ROOT"
[ -x "$INSTALL_ROOT/saasolution-drive" ] || fail "the release does not contain the expected executable."
ln -sf "$INSTALL_ROOT/saasolution-drive" "$BIN_ROOT/saasolution-drive"

printf '%s\n' "SaaSolution Drive was installed to $INSTALL_ROOT."
printf '%s\n' "Run it with: saasolution-drive"
