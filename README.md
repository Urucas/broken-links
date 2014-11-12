broken-links
============
Simple node package to test broken links on your page.
The command compares the links on your page with the 404 provided.

Requirements
============
Node v.0.11.7

Check nvm <a href="https://github.com/creationix/nvm">https://github.com/creationix/nvm</a> &
co-request <a href="https://github.com/leukhin/co-request">https://github.com/leukhin/co-request</a>

Install
=======
npm install -g broken-links

Usage
=====
```javascript
broken-links -s $SITE_URL -404 $SITE_URL_404
```

Example
=======

```javascript
broken-links -s kuesty.com -404 kuesty.com/error/e404
```

Result

<img src="https://raw.githubusercontent.com/Urucas/broken-links/master/screen.png" />
