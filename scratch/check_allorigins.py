import urllib.request
import urllib.parse
import re
import json

yt_url = "https://www.youtube.com/watch?v=XkeuuXM1-V8"
url = f"https://api.allorigins.win/raw?url={urllib.parse.quote_plus(yt_url)}"
print(f"Fetching from AllOrigins: {url}")

req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req, timeout=15) as res:
        html = res.read().decode("utf-8", errors="ignore")
        print("Status:", res.status)
        print("HTML Length:", len(html))
        
        # Save HTML to a scratch file to inspect if needed
        with open("scratch_allorigins_yt.html", "w", encoding="utf-8") as f:
            f.write(html)
            
        # Test the regexes
        view_match = re.search(r'"viewCount"\s*:\s*"(\d+)"', html)
        date_match = re.search(r'itemprop="uploadDate"\s*content="([^"]+)"', html) or \
                     re.search(r'"publishDate"\s*:\s*"([^"]+)"', html)
                     
        print("Views Match:", view_match.group(1) if view_match else "None")
        print("Date Match:", date_match.group(1) if date_match else "None")
        
        # Check if page is robot verification
        if "consent.youtube.com" in html or "google.com/recaptcha" in html:
            print("WARNING: YouTube returned a consent or recaptcha page instead of the watch page!")
            
except Exception as e:
    print("Error:", e)
