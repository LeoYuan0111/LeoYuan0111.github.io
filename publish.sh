git checkout --orphan publish 
git add -A
git commit -m "update"
git push --force git@github.com:LeoYuan0111/LeoYuan0111.github.io.git publish:main
git checkout main && git branch -D publish