"""Create a GitHub-ready source ZIP without local/hosting identity or dependencies."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
root=Path('.');target=root/'public/downloads/imessage-html-recreation.zip'
skip={'.git','.openai','.sites-runtime','.vinext','.next','.wrangler','node_modules','dist','outputs','work','.agents','.codex','.pnpm-store'}
files=[]
for p in root.rglob('*'):
 if not p.is_file() or any(part in skip for part in p.parts):continue
 if p.parts[:2]==('public','downloads') or p.name.endswith('.tsbuildinfo') or p.name.startswith('.env') or p.name in ['next-env.d.ts','BUILD_SUMMARY.md']:continue
 files.append(p)
with ZipFile(target,'w',ZIP_DEFLATED,compresslevel=8) as z:
 for p in sorted(files):z.write(p,Path('imessage-html-recreation')/p)
 z.writestr('imessage-html-recreation/.openai/hosting.json','{\n  \"d1\": null,\n  \"r2\": null\n}\n')
print(f'{len(files)} source files; {target.stat().st_size:,} bytes')
