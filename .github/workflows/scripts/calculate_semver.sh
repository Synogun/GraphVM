# Retrieve the last tag from the git history
OLD_SEMVER_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v1.0.0")
# echo "$OLD_SEMVER_TAG"

# Remove the leading 'v' and split version components
VERSION=${OLD_SEMVER_TAG#v}
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"
# echo "${MAJOR}.${MINOR}.${PATCH}"

# Get commit messages in chronological order (oldest first)
COMMITS=$(git log "refs/tags/$OLD_SEMVER_TAG"..origin/develop --reverse --pretty=format:"%s")
# echo "$COMMITS"

# Process each commit one-by-one
while IFS= read -r commit_msg; do
if [[ "$commit_msg" =~ ^feat\(?(#([0-9]+))?\)?:\ .+$ ]]; then
    MINOR=$((MINOR + 1))
    PATCH=0

elif [[ "$commit_msg" =~ ^fix\(?(#([0-9]+))?\)?:\ .+$ ]]; then
    PATCH=$((PATCH + 1))

elif [[ "$commit_msg" =~ ^refactor\(?(#([0-9]+))?\)?:\ .+$ ]]; then
    PATCH=$((PATCH + 1))

elif [[ "$commit_msg" =~ ^chore\(?(#([0-9]+))?\)?:\ .+$ ]]; then
    PATCH=$((PATCH + 1))
fi
done <<< "$COMMITS"
# echo "${OLD_SEMVER_TAG} ---> v${MAJOR}.${MINOR}.${PATCH}"

CALC_SEMVER_FLAG=true
NEW_SEMVER_TAG="v${MAJOR}.${MINOR}.${PATCH}"

if [ "$NEW_SEMVER_TAG" == "$OLD_SEMVER_TAG" ]; then
    CALC_SEMVER_FLAG=false
fi

echo "${OLD_SEMVER_TAG}_${NEW_SEMVER_TAG}_${CALC_SEMVER_FLAG}"
