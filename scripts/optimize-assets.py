"""Deterministic lossless branding optimization; never redraw approved artwork."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

logos = Path(__file__).resolve().parent.parent / 'public' / 'assets' / 'logos'
for filename in ('techsonic-official-light-bg.png', 'techsonic-official-dark-bg.png'):
    with Image.open(logos / filename) as source:
        source.thumbnail((360, 260), Image.Resampling.LANCZOS)
        source.save(logos / filename.replace('.png', '.webp'), lossless=True)

for filename, size in [('android-chrome-192x192.png', 192), ('android-chrome-512x512.png', 512), ('apple-touch-icon.png', 180)]:
    with Image.open(logos / filename) as source:
        image = source.resize((size, size), Image.Resampling.LANCZOS)
        image.save(logos / filename, optimize=True)

# Code-native social card: approved mark, type, solid brand colors; no invented artwork.
card = Image.new('RGB', (1200, 630), '#F6F7F5')
draw = ImageDraw.Draw(card)
draw.rectangle((60, 65, 110, 69), fill='#005DAA')
font = lambda size: ImageFont.truetype('C:/Windows/Fonts/arial.ttf', size)
draw.text((130, 52), 'TECHSONIC LLC', fill='#005DAA', font=font(22))
for y, line in [(170, 'Technology Advisory.'), (260, 'Solutions.'), (350, 'Engineering.')]:
    draw.text((60, y), line, fill='#101820' if y != 260 else '#005DAA', font=font(65))
draw.line((60, 510, 1140, 510), fill='#CBD6DB', width=2)
draw.text((60, 550), 'Business needs. Technical execution. Connected.', fill='#52616B', font=font(24))
draw.text((870, 550), 'gotechsonic.com', fill='#005DAA', font=font(24))
with Image.open(logos / 'techsonic-official-light-bg.png').convert('RGBA') as mark:
    mark.thumbnail((140, 100), Image.Resampling.LANCZOS)
    card.paste(mark, (990, 180), mark)
card.save(logos / 'og-image.png', optimize=True)
