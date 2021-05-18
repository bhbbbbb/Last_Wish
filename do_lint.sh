echo '
#/bin/sh
cd main_system
yarn lint
'>.git/hooks/pre-commit
chmod 775 .git/hooks/pre-commit
