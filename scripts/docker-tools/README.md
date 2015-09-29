# docker-tools
A collection of scripts that help manage docker

# Tips:
See https://medium.com/@porteneuve/mastering-git-subtrees-943d29a798ec

## Adding this repo as a subtree:
```
git remote add docker-tools git@github.com:GoBoundless/docker-tools.git
git fetch docker-tools
git read-tree --prefix=scripts/docker-tools -u docker-tools/master
```

## Fetching updates from this repo:
```
git fetch docker-tools
git merge -s subtree --squash docker-tools/master
git commit -m "Updated docker-tools"
```
