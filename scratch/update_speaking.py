
import os

file_path = '/Users/pranalibose/data-ai-consultant-website/speaking.html'
with open(file_path, 'r') as f:
    content = f.read()

# Update Modal
old_modal = """    <!-- Modal -->
    <div class="modal" id="eventModal">
        <button class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        <div class="modal-content">
            <div class="modal-image">
                <img src="" alt="" id="modalImg">
            </div>
            <div class="modal-body">
                <p class="event-card-date" id="modalDate"></p>
                <h2 id="modalTitle"></h2>
                <p class="event-card-venue" id="modalVenue"></p>
                <p class="event-card-desc" id="modalDesc"></p>
                <span class="event-tag" id="modalTag"></span>
            </div>
        </div>
    </div>"""

new_modal = """    <!-- Modal -->
    <div class="modal" id="eventModal">
        <button class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        <div class="modal-content">
            <div class="modal-image carousel-container" id="modalCarousel">
                <div class="carousel-track" id="modalCarouselTrack">
                    <!-- Slides will be injected by JS -->
                </div>
                <div class="carousel-nav">
                    <button class="carousel-btn prev"><i class="fa-solid fa-chevron-left"></i></button>
                    <button class="carousel-btn next"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
                <div class="carousel-dots" id="modalCarouselDots"></div>
            </div>
            <div class="modal-body">
                <p class="event-card-date" id="modalDate"></p>
                <h2 id="modalTitle"></h2>
                <p class="event-card-venue" id="modalVenue"></p>
                <p class="event-card-desc" id="modalDesc"></p>
                <span class="event-tag" id="modalTag"></span>
            </div>
        </div>
    </div>"""

content = content.replace(old_modal, new_modal)

# Update Event Cards
import re

def transform_card(match):
    img_tag = match.group(1)
    src = re.search(r'src="([^"]+)"', img_tag).group(1)
    alt = re.search(r'alt="([^"]+)"', img_tag).group(1)
    
    # Create carousel structure with 2 identical images for demo
    new_html = f'''<div class="event-card-image carousel-container">
                        <div class="carousel-track">
                            <div class="carousel-slide"><img src="{src}" alt="{alt} 1"></div>
                            <div class="carousel-slide"><img src="assets/judging.JPG" alt="{alt} 2"></div>
                        </div>
                        <div class="carousel-nav">
                            <button class="carousel-btn prev"><i class="fa-solid fa-chevron-left"></i></button>
                            <button class="carousel-btn next"><i class="fa-solid fa-chevron-right"></i></button>
                        </div>
                        <div class="carousel-dots"></div>
                    </div>'''
    return new_html

# Matches <div class="event-card-image"> ... </div>
pattern = r'<div class="event-card-image">\s*(<img[^>]+>)\s*</div>'
content = re.sub(pattern, transform_card, content)

with open(file_path, 'w') as f:
    f.write(content)
