import urllib.request
import urllib.parse
import re

yt_url = "https://www.youtube.com/watch?v=XkeuuXM1-V8"

proxies = [
    ("CodeTabs", "https://api.codetabs.com/v1/proxy?quest="),
    ("Yacdn", "https://yacdn.org/proxy/"),
    ("HTMLDriven", "https://cors-proxy.htmldriven.com/?url="),
    ("ThingProxy", "https://thingproxy.freeboard.io/fetch/")
]

for name, proxy_url in proxies:
    print(f"\nTesting proxy: {name}")
    try:
        url = f"{proxy_url}{urllib.parse.quote_plus(yt_url)}"
        print(f"Fetching: {url}")
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as res:
            html = res.read().decode("utf-8", errors="ignore")
            print("Status:", res.status)
            print("Length:", len(html))
            
            view_match = re.search(r'"viewCount"\s*:\s*"(\d+)"', html)
            date_match = re.search(r'itemprop="uploadDate"\s*content="([^"]+)"', html) or \
                         re.search(r'"publishDate"\s*:\s*"([^"]+)"', html)
                         
            print("Views:", view_match.group(1) if view_match else "None")
            print("Date:", date_match.group(1) if date_match else "None")
            
    except Exception as e:
        print("Failed:", e)
