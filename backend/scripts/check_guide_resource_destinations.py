"""Inspect selected public resource destinations; never infer subject-matter approval."""
import concurrent.futures
import json
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urldefrag
from urllib.request import Request, urlopen
from guide_resource_selections import SELECTIONS

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.title=[]; self.in_title=False
    def handle_starttag(self, tag, attrs):
        self.ids.update(v for k,v in attrs if k in ('id','name') and v)
        if tag=='title': self.in_title=True
    def handle_endtag(self, tag):
        if tag=='title': self.in_title=False
    def handle_data(self, data):
        if self.in_title: self.title.append(data)

def check(url):
    try:
        base, anchor=urldefrag(url)
        with urlopen(Request(base,headers={'User-Agent':'Asgard educational resource review'}),timeout=25) as response:
            page=Page(); page.feed(response.read(3000000).decode('utf-8',errors='replace'))
            return url,dict(status=response.status, final_url=response.url, title=''.join(page.title).strip(),
                            anchor_present=not anchor or anchor in page.ids, checked_at=datetime.now(timezone.utc).isoformat())
    except Exception as error:
        return url,dict(error=str(error))

if __name__=='__main__':
    urls=sorted({url for items in SELECTIONS.values() for url in items})
    path=Path(__file__).resolve().parents[1]/'app/content/guide-resource-destinations.json'
    cache=json.loads(path.read_text()) if path.exists() else {}
    pending=[url for url in urls if cache.get(url,{}).get('status')!=200 or not cache.get(url,{}).get('anchor_present')]
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        cache.update(dict(pool.map(check,pending)))
    results={url:cache[url] for url in urls}
    path.write_text(json.dumps(results,indent=2),encoding='utf-8')
    failed={url:r for url,r in results.items() if r.get('status')!=200 or not r.get('anchor_present')}
    print(json.dumps({'destinations':len(results),'failed':failed},indent=2))
