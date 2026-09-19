"""Compare real browser captures with the user-supplied screenshots.
Usage: python scripts/verify-screenshots.py /absolute/path/to/captures
Capture: messages.jpg; at 440 CSS pixels, DPR 1.
No screenshot content is substituted into the recreation.
"""
from PIL import Image, ImageCms, ImageChops, ImageDraw
from pathlib import Path
from scipy.ndimage import binary_fill_holes
import numpy as np
import json, io, sys
capture_dir=Path(sys.argv[1]);out=Path('docs/verification');out.mkdir(parents=True,exist_ok=True)
cases=[('messages','messages.jpg',554,(160,52,435,537))]
results={"environment":"Chrome on Linux; 440 CSS px wide; DPR 1; Apple system font unavailable; fallback font and native Linux emoji; JPEG browser captures","methodology":"sRGB conversion, reference downsample to 440 px width; primary bubble silhouette via blue mask with enclosed holes filled; errors measured in 8-bit RGB without registration or image warping","notes":["Full-height reference overlays are available interactively in the demo.","Saved full-conversation and keyboard comparisons cover the top 936 of 956 logical pixels because of the QA viewport.","Silhouette IoU is geometry only, not a text-fidelity or overall similarity score.","Live status-island content and Liquid Glass are not recreated exactly."],"cases":{}}
for kind,file,height,roi in cases:
 orig=Image.open('public/references/'+file)
 if orig.info.get('icc_profile'):orig=ImageCms.profileToProfile(orig,ImageCms.ImageCmsProfile(io.BytesIO(orig.info['icc_profile'])),ImageCms.createProfile('sRGB'),outputMode='RGB')
 orig=orig.convert('RGB').resize((440,round(orig.height/3)),Image.Resampling.LANCZOS).crop((0,0,440,height))
 actual=Image.open(capture_dir/(kind+'.jpg')).convert('RGB').crop((0,0,440,height))
 orig.save(out/(kind+'-original.jpg'),quality=96);actual.save(out/(kind+'-recreation.jpg'),quality=96)
 Image.blend(orig,actual,.5).save(out/(kind+'-overlay.jpg'),quality=96)
 ImageChops.difference(orig,actual).save(out/(kind+'-difference.jpg'),quality=96)
 side=Image.new('RGB',(900,height+34),'#f4f6f9');side.paste(orig,(0,34));side.paste(actual,(460,34));draw=ImageDraw.Draw(side);draw.text((14,11),'ORIGINAL',fill='#586879');draw.text((474,11),'HTML RECREATION',fill='#586879');side.save(out/(kind+'-side-by-side.jpg'),quality=95)
 a=np.asarray(orig).astype(float);b=np.asarray(actual).astype(float);delta=np.abs(a-b);fg=(a.max(axis=2)>20)|(b.max(axis=2)>20)
 x0,y0,x1,y1=roi;ar=a[y0:y1,x0:x1];br=b[y0:y1,x0:x1]
 def mask(t):return binary_fill_holes((t[:,:,2]>110)&(t[:,:,2]-t[:,:,0]>45)&(t[:,:,2]-t[:,:,1]>25))
 ma,mb=mask(ar),mask(br);inter=(ma&mb).sum();union=(ma|mb).sum()
 results['cases'][kind]={"compared_dimensions":[440,height],"primary_bubble_roi":list(roi),"primary_sent_bubble_silhouette_iou":round(float(inter/union),5),"canvas_mean_absolute_rgb_error_0_to_255":round(float(delta.mean()),3),"foreground_mean_absolute_rgb_error_0_to_255":round(float(delta[fg].mean()),3),"primary_bubble_mean_absolute_rgb_error_0_to_255":round(float(np.abs(ar-br).mean()),3)}
(out/'metrics.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results['cases'],indent=2))
