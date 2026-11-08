"""Verify all URLs in topic-resources.json and report dead links or 404s."""
import json
import urllib.request
import urllib.error
import ssl
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOPIC_RESOURCES = ROOT / "app" / "content" / "topic-resources.json"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}

def check_url(url):
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            return url, resp.status, None
    except urllib.error.HTTPError as e:
        return url, e.code, str(e)
    except Exception as e:
        return url, 0, str(e)

def main():
    data = json.loads(TOPIC_RESOURCES.read_text(encoding="utf-8"))
    unique_urls = set()
    for career, topics in data.items():
        for t_slug, t_info in topics.items():
            unique_urls.add(t_info["url"])
            
    print(f"Checking {len(unique_urls)} unique URLs...")
    results = {}
    with ThreadPoolExecutor(max_workers=16) as executor:
        futures = {executor.submit(check_url, u): u for u in unique_urls}
        for future in as_completed(futures):
            url, status, err = future.result()
            results[url] = (status, err)
            if status != 200:
                print(f"[{status}] {url} -> {err}")
            else:
                print(f"[OK 200] {url[:60]}")

    failures = {u: res for u, res in results.items() if res[0] != 200}
    print(f"\nDone. {len(failures)} failures found out of {len(unique_urls)} URLs.")
    Path("url_check_results.json").write_text(json.dumps(results, indent=2), encoding="utf-8")

if __name__ == "__main__":
    main()
