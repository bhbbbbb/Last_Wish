echo '
#/bin/sh
FILES=$(git diff --cached --name-only --diff-filter=ACMR | sed '"'"'s| |\\\\ |g'"'"')
[ -z "$FILES" ] && exit 0

cd main_system
yarn lint
echo "$FILES" | xargs git add

git update-index -g
exit 0
'>.git/hooks/pre-commit
chmod 775 .git/hooks/pre-commit
