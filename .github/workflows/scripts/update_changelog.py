import sys, os
from pathlib import Path 
# Get the old and new tags from args
if len(sys.argv) < 3:
    print("Usage: fetch_notes.py <old_tag> <new_tag>")
    sys.exit(1)

old_tag = sys.argv[1]
new_tag = sys.argv[2]

header = f"""# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/Synogun/GraphVM/compare/{new_tag}...develop)

<!-- START -->
### Added
### Changed
### Fixed
### Removed
<!-- END -->

"""

filePath = Path('.') / 'CHANGELOG.md'
tmpPath = Path('.')  / 'CHANGELOG.tmp'

if not filePath.is_file():
    print('')
    sys.exit(1)

with open(filePath, 'r') as file:
    notes = file.read().split('\n')

currentNotes = []
with open(tmpPath, 'w+') as file:
    capture = False
    file.write(header)

    for line in notes[7:-1]:
        if line.startswith("## [Unreleased]"):
            file.write(line.replace("Unreleased", new_tag).replace('develop', new_tag))

        elif line.startswith("<!-- START"):
            capture = True
            continue

        elif line.startswith("<!-- END"):
            capture = False
            continue

        elif capture:
            currentNotes.append(line)
            file.write(line)

        elif line.startswith(f"## {old_tag}") and not line.startswith(f"## [1.0.0]"):
            file.write(line.replace('develop', new_tag))

        else:
            file.write(line)
        
        file.write('\n')

currentNotes = "\n".join(currentNotes)

print(currentNotes)
os.remove(filePath)
os.rename(tmpPath, filePath)