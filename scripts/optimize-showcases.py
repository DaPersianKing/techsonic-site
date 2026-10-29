"""Create web previews from approved artwork; preserve full-resolution PNG originals."""
from pathlib import Path
from PIL import Image

assets = Path(__file__).resolve().parent.parent / 'public' / 'assets'
for directory in ('applications', 'workflows'):
    for source in (assets / directory).glob('*.png'):
        with Image.open(source) as image:
            image.thumbnail((640, 640) if directory == 'applications' else (800, 1200), Image.Resampling.LANCZOS)
            image.save(source.with_suffix('.webp'), quality=88, method=6)
