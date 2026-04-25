
import os
import re

# Collect all images from assets/event*
event_images = {}
assets_dir = '/Users/pranalibose/data-ai-consultant-website/assets'
for i in range(1, 23):
    folder = f'event{i}'
    path = os.path.join(assets_dir, folder)
    if os.path.exists(path):
        # Sort files to keep consistency
        files = sorted([f for f in os.listdir(path) if not f.startswith('.')])
        event_images[i] = [os.path.join('assets', folder, f) for f in files]

def update_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Find each <!-- Event X --> block
    for i in range(1, 23):
        pattern = rf'(<!-- Event {i} -->.*?<div class="carousel-track">)(.*?)(</div>)'
        
        def replace_slides(match):
            prefix = match.group(1)
            suffix = match.group(3)
            images = event_images.get(i, [])
            
            # If no images found in folder, try to keep existing or use a default?
            # User says they added all, so let's use them.
            if not images:
                return match.group(0) # Keep as is if empty
            
            slides_html = ""
            for idx, img_path in enumerate(images):
                # Skip HEIC for better compatibility unless it's the only one
                if img_path.lower().endswith('.heic') and len(images) > 1:
                    continue
                slides_html += f'\n                            <div class="carousel-slide"><img src="{img_path}" alt="Event {i} Image {idx+1}"></div>'
            
            return f'{prefix}{slides_html}\n                        {suffix}'

        content = re.sub(pattern, replace_slides, content, flags=re.DOTALL)

    with open(file_path, 'w') as f:
        f.write(content)

update_file('/Users/pranalibose/data-ai-consultant-website/index.html')
update_file('/Users/pranalibose/data-ai-consultant-website/speaking.html')
print("Updated index.html and speaking.html with all event images.")
