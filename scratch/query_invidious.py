import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

yt_id = "XkeuuXM1-V8"

try:
    print("Fetching Invidious instances...")
    url = "https://api.invidious.io/instances.json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req, context=ctx, timeout=8) as response:
        instances_data = json.loads(response.read().decode('utf-8'))
        
    healthy_instances = []
    for item in instances_data:
        domain = item[0]
        meta = item[1]
        
        # stats exists, api is True
        stats = meta.get("stats", {})
        api = meta.get("api", True)
        instance_type = meta.get("type", "https")
        monitor = meta.get("monitor", {})
        
        if api and instance_type == "https" and monitor and monitor.get("uptime", 0) > 90:
            healthy_instances.append(domain)
            
    print(f"Found {len(healthy_instances)} healthy instances.")
    
    for domain in healthy_instances[:8]:
        instance_url = f"https://{domain}/api/v1/videos/{yt_id}"
        print(f"Trying: {instance_url}")
        try:
            req_vid = urllib.request.Request(instance_url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            })
            with urllib.request.urlopen(req_vid, context=ctx, timeout=6) as response_vid:
                data = json.loads(response_vid.read().decode('utf-8'))
                views = data.get("viewCount")
                published = data.get("published")
                published_text = data.get("publishedText")
                print(f"SUCCESS! Views: {views}, Published (timestamp): {published}, PublishedText: {published_text}")
                # print date from timestamp
                import datetime
                if published:
                    print(f"UTC Date from timestamp: {datetime.datetime.utcfromtimestamp(published).isoformat()}")
                break
        except Exception as e:
            print(f"Failed: {e}")
            
except Exception as e:
    print(f"Error: {e}")
