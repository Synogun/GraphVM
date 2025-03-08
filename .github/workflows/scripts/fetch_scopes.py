import sys

if len(sys.argv) < 3:
    print("Usage: fetch_notes.py <old_tag> <commits>")
    sys.exit(1)

old_tag = sys.argv[1]
commits = sys.argv[2]

semver_scopes = ""
project_commits = 0

# Process each commit one-by-one
for commit in commits.split("\n"):
    if commit.startswith("Closes #"):
        semver_scopes += f"{commit}, "
    elif not commit.startswith("Merge"):
        project_commits += 1

# Remove trailing comma from SEMVER_SCOPES
semver_scopes = semver_scopes.rstrip(", ")

# Add a check to ensure SEMVER_SCOPES is not empty before processing
if semver_scopes == "":
    print(f"${project_commits} project scoped commits")
elif project_commits == 0:
    print(f"{semver_scopes}")
elif semver_scopes == "" and project_commits == 0:
    print("No commits found")
    sys.exit(1)
else:
    print(f"{project_commits} project scoped commits and {semver_scopes}")
