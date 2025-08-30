#!/bin/sh

#PLUGINS_DIR="${1:-.}"
PLUGINS_DIR="${PLUGINS_DIR:-./plugins}"
RELATIVE_PATH_PREFIX="${RELATIVE_PATH_PREFIX:-/plugins}"

# Create temporary files for storing data
ES_TEMP=$(mktemp)
SYSTEM_TEMP=$(mktemp)
ALL_NAMES_TEMP=$(mktemp)
PLUGINS_TEMP=$(mktemp)

# Cleanup on exit
trap 'rm -f "$ES_TEMP" "$SYSTEM_TEMP" "$ALL_NAMES_TEMP" "$PLUGINS_TEMP"' EXIT

# Collect .js (not system)
find "$PLUGINS_DIR" -type f -name "*.js" ! -name "*.system.js" -print0 | while IFS= read -r -d '' file; do
    base_name=$(basename "$file" .js)
    echo "$base_name|$file" >> "$ES_TEMP"
done

# Collect .system.js
find "$PLUGINS_DIR" -type f -name "*.system.js" -print0 | while IFS= read -r -d '' file; do
    base_name=$(basename "$file" .system.js)
    echo "$base_name|$file" >> "$SYSTEM_TEMP"
done

# Get all unique names
cut -d'|' -f1 "$ES_TEMP" "$SYSTEM_TEMP" | sort -u > "$ALL_NAMES_TEMP"

# Generate plugins array
first_plugin=true
echo "[" > "$PLUGINS_TEMP"

while IFS= read -r name; do
    [ -z "$name" ] && continue

    es_file=$(grep "^$name|" "$ES_TEMP" | cut -d'|' -f2)
    system_file=$(grep "^$name|" "$SYSTEM_TEMP" | cut -d'|' -f2)

    # Try to extract @id from the plugin file
    plugin_file_path="${es_file:-$system_file}"
    if [ -f "$plugin_file_path" ]; then
        extracted_id=$( grep -E '^\s?\* @id[[:space:]]+' "$plugin_file_path" | sed -n 's/\s*\* @id[[:space:]]\+//p' | head -n1)
    else
        extracted_id=""
    fi

    # Use extracted ID if found, otherwise fallback to $name
    plugin_id="${extracted_id:-$name}"

    # Apply relative path transformation if prefix is set
    [ -n "$es_file" ] && es_file=$(echo "$es_file" | sed "s|$PLUGINS_DIR|$RELATIVE_PATH_PREFIX|")
    [ -n "$system_file" ] && system_file=$(echo "$system_file" | sed "s|$PLUGINS_DIR|$RELATIVE_PATH_PREFIX|")

    # Create plugin JSON
    plugin_json=$(printf '{}\n' | jq -n \
        --arg name "$name" \
        --arg id "$plugin_id" \
        --arg es "$es_file" \
        --arg system "$system_file" \
        '{ name: $name, id: $id } +
          (if $es != "" then {"esSource": $es} else {} end) +
          (if $system != "" then {"systemSource": $system} else {} end)
        ')

    if [ "$first_plugin" = true ]; then
        printf '%s' "$plugin_json" >> "$PLUGINS_TEMP"
        first_plugin=false
    else
        printf ',%s' "$plugin_json" >> "$PLUGINS_TEMP"
    fi
done < "$ALL_NAMES_TEMP"

echo "]" >> "$PLUGINS_TEMP"

# Output headers
echo -e "Content-Type: application/json\r"
echo -e "\r"

# Output body JSON
{
  echo '{
    "manifest_version": 1,
    "name": "Local plugins",
    "plugins": '
      cat "$PLUGINS_TEMP"
      echo '
  }'
} | jq .
