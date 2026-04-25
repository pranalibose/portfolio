
import os
import re

event_images = {}
assets_dir = '/Users/pranalibose/data-ai-consultant-website/assets'
for i in range(1, 23):
    folder = f'event{i}'
    path = os.path.join(assets_dir, folder)
    if os.path.exists(path):
        files = sorted([f for f in os.listdir(path) if not f.startswith('.')])
        event_images[i] = [os.path.join('assets', folder, f) for f in files]

def fix_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Rebuild the entire carousel-track block to avoid duplication
    for i in range(1, 23):
        # Precise pattern to find the carousel-track including its broken contents
        # We look for the start of the track and the end before carousel-nav
        pattern = rf'(<div class="carousel-track">)(.*?)(</div>\s*<div class="carousel-nav">)'
        
        def replace_track(match):
            prefix = match.group(1)
            suffix = match.group(3)
            images = event_images.get(i, [])
            
            if not images:
                return match.group(0)
            
            slides_html = ""
            for idx, img_path in enumerate(images):
                if img_path.lower().endswith('.heic') and len(images) > 1:
                    continue
                slides_html += f'\n                            <div class="carousel-slide"><img src="{img_path}" alt="Event {i} Image {idx+1}"></div>'
            
            return f'{prefix}{slides_html}\n                        {suffix}'

        # Use Event X comment as a boundary to ensure we target the right one if possible
        # Or just use the fact that they are sequential.
        # Let's try to be more specific by finding the comment first.
        content = re.sub(pattern, replace_track, content, count=1, flags=re.DOTALL)
        # Note: This 'count=1' trick only works if I loop through the matches correctly.
        # Actually, let's just use the Event X comment as the anchor.
        
    # Second pass: ensure we didn't leave any stray tags. 
    # Actually, let's just use a more reliable way: find Event X, then find the NEXT carousel-track.
    
    # Reset content for a better approach
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        new_lines.append(line)
        
        # Look for Event comment
        match = re.search(r'<!-- Event (\d+) -->', line)
        if match:
            event_num = int(match.group(1))
            # Search for the next carousel-track
            found_track = False
            while i + 1 < len(lines):
                i += 1
                next_line = lines[i]
                if '<div class="carousel-track">' in next_line:
                    new_lines.append(next_line)
                    # Skip everything until carousel-nav
                    while i + 1 < len(lines) and '<div class="carousel-nav">' not in lines[i+1]:
                        i += 1
                    
                    # Inject new images
                    images = event_images.get(event_num, [])
                    for idx, img_path in enumerate(images):
                        if img_path.lower().endswith('.heic') and len(images) > 1:
                            continue
                        new_lines.append(f'                            <div class="carousel-slide"><img src="{img_path}" alt="Event {event_num} Image {idx+1}"></div>\n')
                    
                    new_lines.append('                        </div>\n')
                    found_track = True
                    break
                else:
                    new_lines.append(next_line)
        i += 1

    with open(file_path, 'w') as f:
        f.writelines(new_lines)

fix_file('/Users/pranalibose/data-ai-consultant-website/index.html')
fix_file('/Users/pranalibose/data-ai-consultant-website/speaking.html')
print("Fixed HTML structure for all event carousels.")
