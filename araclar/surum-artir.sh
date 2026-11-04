#!/bin/sh
# Yeni sürüm yayınlamadan önce çalıştırın: index.html'deki sürüm numarasını, betiklerin ?v= ekini ve surum.json'u birlikte artırır.
# Açılış ekranı surum.json'daki numara sayfadakinden büyükse sayfayı yeni sürümle yeniden yükler.
set -e
cd "$(dirname "$0")/.."
eski=$(sed -n 's/.*<meta name="surum" content="\([0-9]*\)".*/\1/p' index.html)
yeni=$((eski + 1))
sed -i "s/<meta name=\"surum\" content=\"$eski\">/<meta name=\"surum\" content=\"$yeni\">/; s/?v=$eski\"/?v=$yeni\"/g" index.html
printf '{ "surum": %s }\n' "$yeni" > surum.json
echo "Sürüm $eski -> $yeni"
