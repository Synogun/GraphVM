unique_csv() {
    local input="$1"
    local IFS=',' unique_array=()
    local seen=() element

    for element in $input; do
        if [[ ! " ${seen[*]} " =~ " $element " ]]; then
            seen+=("$element")
            unique_array+=("$element")
        fi
    done

    printf "%s\n" "$(IFS=' '; echo "${unique_array[*]}")"
}

# Retrieve the last tag from the git history
OLD_SEMVER_TAG=$1
# echo "Last tag: $OLD_SEMVER_TAG"

# Get commit messages in chronological order (oldest first)
COMMITS=$(git log "refs/tags/$OLD_SEMVER_TAG"..origin/develop --reverse --pretty=format:"%s")
# echo "Commits (chronological order):"
# echo "$COMMITS"

SEMVER_SCOPES=""

# Process each commit one-by-one
while IFS= read -r commit_msg; do
if [[ "$commit_msg" =~ ^feat\((#([0-9]+))?\):\ .+$ ]]; then
    SCOPE=${BASH_REMATCH[1]}
    SEMVER_SCOPES+="Closes ${SCOPE},"
    # echo "scope: $SCOPE from $commit_msg"

elif [[ "$commit_msg" =~ ^fix\((#([0-9]+))?\):\ .+$ ]]; then
    SCOPE=${BASH_REMATCH[1]}
    SEMVER_SCOPES+="Closes ${SCOPE},"
    # echo "scope: $SCOPE from $commit_msg"

elif [[ "$commit_msg" =~ ^chore\((#([0-9]+))?\):\ .+$ ]]; then
    SCOPE=${BASH_REMATCH[1]}
    SEMVER_SCOPES+="Closes ${SCOPE},"

elif [[ "$commit_msg" =~ ^refactor\((#([0-9]+))?\):\ .+$ ]]; then
    SCOPE=${BASH_REMATCH[1]}
    SEMVER_SCOPES+="Closes ${SCOPE},"

elif [[ "$commit_msg" =~ ^docs\((#([0-9]+))?\):\ .+$ ]]; then
    SCOPE=${BASH_REMATCH[1]}
    SEMVER_SCOPES+="Closes ${SCOPE},"
    # echo "scope: $SCOPE from $commit_msg"
fi
done <<< "$COMMITS"

# Remove trailing comma from SEMVER_SCOPES
SEMVER_SCOPES=${SEMVER_SCOPES%,}
echo "$SEMVER_SCOPES"

# Add a check to ensure SEMVER_SCOPES is not empty before processing
if [ -n "$SEMVER_SCOPES" ]; then
    
    SCOPES=$(unique_csv "$SEMVER_SCOPES")

    echo "$SCOPES"
else
    echo ""
fi
