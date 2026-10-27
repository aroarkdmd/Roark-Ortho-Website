#!/usr/bin/env bash
# Verifies the legacy-URL redirects and that no real page is affected.
# Usage: scripts/check-redirects.sh https://roark-orthodontics.pages.dev
B="${1:-http://localhost:3000}"
fail=0
ok(){ printf "  PASS  %s\n" "$1"; }
bad(){ printf "  FAIL  %s\n" "$1"; fail=1; }

# path | expected status | expected Location
check(){
  local path="$1" want="$2" loc="$3"
  read -r code got < <(curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' "$B$path")
  got="${got#$B}"
  if [[ "$code" == "$want" && "$got" == "$loc" ]]; then ok "$path -> $code $got"
  else bad "$path -> $code '$got' (expected $want '$loc')"; fi
}

echo "== Old WordPress URLs (with and without trailing slash)"
while IFS='|' read -r from code to; do
  check "$from/" "$code" "$to"
  check "$from"  "$code" "$to"
done <<'LIST'
/treatment-options|301|/treatments
/treatment-options/braces|301|/braces
/treatment-options/invisalign|301|/invisalign
/treatment-options/palatal-expander|301|/palatal-expander
/financing-and-insurance|301|/financing
/book-now|301|/book
/thank-you|301|/contact
/appointment-scheduled|301|/book
/invisalign-franklin|302|/invisalign
/braces-franklin|302|/braces
/first-visit|302|/#patients
/gallery|302|/#gallery
/product-recommendations|302|/invisalign
LIST

echo "== Old URLs that exist on the new site (slash tidy-up, single hop)"
check "/contact/" 301 "/contact"
check "/blog/"    301 "/blog"
check "/"         200 ""

echo "== Ad tracking codes survive the redirect"
check "/invisalign-franklin/?gclid=TEST123&utm_source=google&utm_medium=cpc" 302 "/invisalign?gclid=TEST123&utm_source=google&utm_medium=cpc"
check "/braces-franklin/?gclid=TEST123" 302 "/braces?gclid=TEST123"
check "/treatment-options/invisalign/?gbraid=ABC&utm_campaign=x" 301 "/invisalign?gbraid=ABC&utm_campaign=x"
check "/first-visit/?gclid=TEST123" 302 "/?gclid=TEST123#patients"

echo "== Letter case and trailing slash on current pages"
check "/Treatment-Options/Braces/" 301 "/braces"
check "/braces/"  301 "/braces"
check "/Braces"   301 "/braces"
check "/kids-braces/?utm_source=fb" 301 "/kids-braces?utm_source=fb"
check "/blog/braces-cost-franklin/" 301 "/blog/braces-cost-franklin"

echo "== Every current page still loads directly (no redirect)"
for p in / /about /about/ /treatments /adults /kids-braces /invisalign /invisalign-first /braces \
         /palatal-expander /surgical-orthodontics /financing /areas-we-serve /contact /blog \
         /privacy /blog/invisalign-first-kids /blog/surgical-orthodontics /blog/braces-cost-franklin \
         /book /sitemap.xml /robots.txt /health /static/site.css; do
  check "$p" 200 ""
done

echo "== Things that must stay 404 (no accidental redirects)"
check "/no-such-page"        404 ""
check "/static/missing.css"  404 ""
check "/api/nothing"         404 ""
check "/blog/not-a-post"     404 ""

echo "== Form posts are never redirected"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$B/invisalign-franklin/")
[[ "$code" == "404" ]] && ok "POST /invisalign-franklin/ -> 404" || bad "POST /invisalign-franklin/ -> $code"

echo "== Cache headers"
h=$(curl -sI "$B/treatment-options/braces/" | tr -d '\r' | grep -i '^cache-control' )
[[ "$h" == *"max-age=86400"* ]] && ok "301 cached 1 day ($h)" || bad "301 cache header: $h"
h=$(curl -sI "$B/invisalign-franklin/" | tr -d '\r' | grep -i '^cache-control' )
[[ "$h" == *"no-store"* ]] && ok "302 not cached ($h)" || bad "302 cache header: $h"

echo
[[ $fail == 0 ]] && echo "ALL CHECKS PASSED" || { echo "SOME CHECKS FAILED"; exit 1; }
