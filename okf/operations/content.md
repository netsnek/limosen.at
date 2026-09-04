---
type: OKF Operations
title: Content
description: The jaen patch chain, how the CMS publishes, and what the split with the sibling brand left behind.
tags: [limosen, jaen, cms, content]
timestamp: 2026-09-04T23:30:00+02:00
---

# Content

`jaen-data/patches.txt` is the site's content: one entry per line, either the URL
of a delta the CMS produced or the name of a local file in the same directory.
`gatsby-source-jaen` deep merges them **in file order**, arrays by `id`, so later
wins and the order is not decoration.

```mermaid
sequenceDiagram
    participant E as Editor in the CMS
    participant J as jaen pylon
    participant R as this repository
    participant D as deploy script
    participant P as Cloudflare Pages

    E->>J: Publish
    J->>J: writes the patch, gets a URL
    J->>R: repository_dispatch with the migration URL
    R->>R: appends the URL to jaen-data/patches.txt
    D->>R: reads jaen-data, builds in place
    D->>P: wrangler pages deploy public
```

Two entries are local files rather than URLs: `2025-11-30-1653-sanitised.json`
and `2025-11-30-2039-sanitised.json`. They are sanitised copies of two November
2025 publishes that carried a third client's page metadata, WIENVERS, into the
chain. The local copies keep the images and the media library and drop the
foreign metadata.

A third local file, `2026-09-04-krc-branding.json`, was removed on 2026-09-04.
It sets every page's title and description to the sibling brand's and belongs
only in that brand's repository. It was written while both brands still came out
of one tree and stayed in this list after they were split.

## Images

Two rules that are not guessable from the code:

- **A media node belongs to one page.** `JaenPage.mediaNodes` resolves by
  filtering `MediaNode` on `jaenPageId`, so one node shared across the language
  pages is invisible to all of them and the field falls back to the placeholder
  compiled into the code. One node per page, all carrying the same URL.
- **Uploads go to `osg.netsnek.com`.** `osg.snek.at` still serves
  `/storage/<id>` and answers 404 on every other path, `/graphql` included, so
  an upload against it fails without saying so. The plugin option is
  `storageUrl`. Read every upload back and compare bytes.
