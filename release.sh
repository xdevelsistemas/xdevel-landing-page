echo "Removendo a pasta node_modules" &&
yarn --silent rimraf node_modules &&
echo "Obtendo alterações" &&
git pull &&
echo "Instalando dependências" &&
yarn install &&
echo "Executando testes" &&
yarn lint &&
yarn test &&
echo "Obtendo versão e changelog" &&
cp package.json _package.json &&
bump=$(yarn --silent recommended-bump) &&
echo "Parte do SemVer a ser alterada: ${1:-$bump}" &&
npm --no-git-tag-version version ${1:-$bump} &&
yarn rimraf package-lock.json &&
echo "Gerando changelog" &&
yarn --silent changelog &&
git add CHANGELOG.md &&
version=$(yarn --silent json -f package.json version) &&
git commit -m "docs(changelog): v$version" &&
mv -f _package.json package.json &&
echo "Versão: ${3:-$version}" &&
echo "Criando tag no git" &&
npm version ${1:-$bump} -m "chore(release): v%s" &&
yarn rimraf package-lock.json &&
git push --follow-tags &&
echo "Github Release" &&
yarn conventional-github-releaser -p ${2:-$preset}
