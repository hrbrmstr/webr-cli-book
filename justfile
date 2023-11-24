render:
  quarto render

sync: render
  rsync -avp ./_book/ bob@rud.is:~/rud.is/books/webr-cli-book/

git:
  git add -A
  git commit -m "chore: auotmation"
  git push
