echo "--------Checking out deploy branch--------"
git checkout gh-pages
echo "--------Rebasing off master---------------"
git rebase master
echo "--------Pushing deploy branch-------------"
git push origin gh-pages
echo "--------Checking out master---------------"
git checkout master
