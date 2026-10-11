---
slug: maintain-the-knowledge
titleZh: 如何维护这套知识
titleEn: How this site keeps the knowledge
kicker: 本站
summaryZh: 书、人、篇、义理四层条目；每条可独立增补；先求可检索、可引用，再逐步连向原文与出处。
summaryEn: >-
  Four layers—books, people, chapters, ideas—each entry editable on its own. Searchable first, then
  linked to sources.
relatedBookSlugs: []
relatedPersonSlugs: []
relatedArticleSlugs:
  - what-are-the-twenty-four-histories
  - how-to-read
---

## 四层

第一层是二十四部书：书名、卷数、作者、成书、记载起迄、体例。第二层是史家与纪传人物。第三层是篇目（如《项羽本纪》《经籍志》）。第四层是义理与方法（纪传体、官修、正统）。

目前站点以 Git 上的 Markdown / JSON 维护，schema 与朝代、角色等写在 `content/config.json`。新增人物时，在 `content/people/` 加一篇 Markdown：姓名、时代、所在书与篇、与正史本文/注释/传说的层次。
