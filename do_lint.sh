echo '
#/bin/sh
FILES=$(git diff --cached --name-only --diff-filter=ACMR | sed '"'"'s| |\\\\ |g'"'"')
[ -z "$FILES" ] && exit 0

cd main_system
yarn lint
cd ../
echo "$FILES" | xargs git add
exit 0
'>.git/hooks/pre-commit
chmod 777 .git/hooks/pre-commit

echo '
#!/bin/sh
git update-index -g
'>.git/hooks/post-commit
chmod 777 .git/hooks/post-commit
exit 0
