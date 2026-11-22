"""Build the reviewed printable PDFs from the Glenolia project artwork."""
import argparse
import json
from io import BytesIO
import subprocess
from pathlib import Path
from PIL import Image, ImageChops, ImageOps
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from plant_class_content import CURRICULUM, STUDENT, EXTRAS, NSW17, NSW24, NSWSEC, EXCUR, COFFEE

SITE = Path(__file__).resolve().parents[1]
ROOT = SITE.parents[3]
ART = SITE / "public/assets/education"
OUTPUT = ART / "plant-library"
FONTS = ROOT / "Farm Mascot/2026-11-02/Story Library and Classroom Kit V1/output/library/fonts"
GREEN, IVORY, SAGE, INK, COPPER = map(HexColor, ["#2f4a3c","#f5f1e8","#d9dfd0","#3b332d","#b57b5a"])
W, H = A4
MARGIN = 48
WIDTH = W - MARGIN * 2

def paragraph(c, value, y, size=13, width=WIDTH, x=MARGIN, font="Noto", colour=INK):
    style = ParagraphStyle("main", fontName=font, fontSize=size, leading=size*1.48, textColor=colour)
    p=Paragraph(value,style)
    _,h=p.wrap(width,H)
    p.drawOn(c,x,y-h)
    return y-h

def image(c,picture,x,y,w,h):
    im=Image.open(picture).convert("RGB") if isinstance(picture,Path) else picture
    im=ImageOps.contain(im,(round(w*2),round(h*2)),Image.Resampling.LANCZOS)
    sw,sh=im.size[0]/2,im.size[1]/2
    stream=BytesIO()
    im.save(stream,format='JPEG',quality=88,optimize=True)
    stream.seek(0)
    c.drawImage(ImageReader(stream),x+(w-sw)/2,y+(h-sh)/2,sw,sh)

def page(c,mark,title,chapter,number):
    c.setFillColor(IVORY)
    c.rect(0,H-135,W,135,fill=1,stroke=0)
    c.setFillColor(COPPER)
    c.rect(MARGIN,H-98,2,49,fill=1,stroke=0)
    paragraph(c,"THE GLENOLIA",H-35,10,x=MARGIN+13,font="NotoBold",colour=GREEN)
    bottom=paragraph(c,title,H-57,28,x=MARGIN+13,width=WIDTH-13,font="NotoSerif",colour=GREEN)
    paragraph(c,chapter,bottom-2,10,x=MARGIN+13,colour=INK)
    c.setStrokeColor(SAGE)
    c.line(MARGIN,33,W-MARGIN,33)
    c.setFont("Noto",8);c.setFillColor(GREEN)
    c.drawString(MARGIN,20,mark)
    c.drawRightString(W-MARGIN,20,str(number))

def document(item):
    c=Canvas(str(OUTPUT/(item["id"]+".pdf")),pagesize=A4,pageCompression=1)
    c.setAuthor("The Glenolia")
    c.setTitle(item["title"])
    return c

def cover(c,item,range_,description):
    page(c,"CLASSROOM LIBRARY",item["title"],range_,1)
    image(c,ART/(item["art"]+".webp"),MARGIN,384,WIDTH,295)
    y=paragraph(c,description,357,17,font="NotoSerif",colour=GREEN)
    y=paragraph(c,"Start with a dated farmer note or photograph in your class journal. Write the plant ID and what you can observe. For classroom practice, name the model or seed type and label the source.",y-25)
    paragraph(c,"Plant or model ID ______________________     Date ______________________",y-26,12)
    c.showPage()

def lines(c,y,n=4,step=25):
    c.setStrokeColor(SAGE)
    for i in range(n):
        c.line(MARGIN,y-i*step,W-MARGIN,y-i*step)

def drawing(c,y,height=245,split=False,grid=False):
    c.setStrokeColor(HexColor("#a1ad99"))
    c.roundRect(MARGIN,y,WIDTH,height,10,fill=0,stroke=1)
    if split:
        c.line(MARGIN+WIDTH/2,y,MARGIN+WIDTH/2,y+height)
    if grid:
        c.setStrokeColor(SAGE)
        for k in range(1,12):
            c.line(MARGIN+k*WIDTH/12,y,MARGIN+k*WIDTH/12,y+height)
        for k in range(1,9):
            c.line(MARGIN,y+k*height/9,W-MARGIN,y+k*height/9)

def student(item,steps):
    c=document(item)
    band=item.get("band")
    cover(c,item,item.get("range", item["type"]),item["desc"])
    for i,(heading,instruction,prompt) in enumerate(steps,1):
        page(c,"THE GLENOLIA CLASSROOM LIBRARY",heading,item.get("range",item["type"]),i+1)
        font_size=17 if band in ("ES1","S1") else 13
        y=paragraph(c,instruction,H-161,font_size)
        paragraph(c,prompt,y-18,12,font="NotoBold",colour=GREEN)
        if (band,i) in {("S2",2),("S4",1)} or (item["id"]=="seed-lab" and i==2):
            c.setFont("NotoBold",9);c.setFillColor(GREEN)
            columns=["Date","Source / pot","Reading / sketch","Method or note"]
            for j,header in enumerate(columns):
                c.drawString(MARGIN+10+j*WIDTH/4,475,header)
            for k in range(1,7):
                lines(c,485-k*42,1)
        else:
            drawing(c,246,246,split=band in ("ES1","S1") and i==2,grid=(band,i) in {("S2",3),("S3",3),("S4",2)})
        lines(c,200,5)
        paragraph(c,"Date and evidence source ____________________________________________",67,10)
        c.showPage()
    c.save()

HANDBOOK=[
 ("Get your class started",[
  ("Pick the first activity","Open the journal and show the current growth stage. Read one dated farmer note or photo. Then download the workbook for your year group. The class can work from a school plant model while waiting for a farm note."),
  ("Keep the evidence clear","Name the plant ID, date, method, units and source each time. A stage drawing illustrates the usual appearance. A dated photo or farmer reading is a distinct source. Keep regional weather estimates, farm-wide observations and individual tree readings clearly labelled."),
  ("Teach together or in pairs","For younger pupils, point or draw and share a noticing aloud. Older learners should record a dated claim, evidence and an uncertainty. Project the class journal and keep account controls on the teacher’s device."),
  ("Look for these signs","A pupil can point to one visible feature, explain where they got the evidence, and describe a question they would investigate next. Give feedback on the method before scoring a claim.")
 ]),
 ("Three lessons from one tree",[
  ("1. Pip investigates a leaf · 20 minutes","Show a dated photo or practise with a classroom plant. Model drawing a leaf edge and labelling a feature. Pairs sketch and compare one feature. Exit check: point to the source and describe one thing you observed."),
  ("2. Dot measures what changes · 30 minutes","Agree on a consistent start and end point and units. Compare two readings only if their source and method support it. If the journal has one reading, record it and plan the next. Exit check: what must stay the same?"),
  ("3. Milla compares growing places · 35 minutes","Compare a dated weather record and a field note. Groups propose a possible factor and one other explanation. Compare two classroom seedlings with one planned change. Exit check: what evidence would support your explanation?")
 ]),
 ("Curriculum for primary classes",[(stage,a+"<br/>"+b+"<br/>"+e) for stage,a,b,e in CURRICULUM[:4]]+[
  ("Planning basis","The 2024 Science and Technology K–6 syllabus starts in 2027. In the 2026 preparation phase schools may implement it early. Check the syllabus your school is using when planning the lesson.")]),
 ("Curriculum for secondary classes",[(stage,a+"<br/>"+b+"<br/>"+e) for stage,a,b,e in CURRICULUM[4:]]+[
  ("Build a defensible claim","Assessment prompt: select a claim about the class plant. Cite the dated observation and method, represent compatible readings, explain one alternative and identify the next evidence you would collect."),
  ("Access and extension","Provide a spoken description alongside a photo. Offer a tactile model, a larger graph, partner recording or an oral report. For extension, compare the effect of grouping dates or changing a graph scale.")]),
 ("Seed trays and orchard visits",[
  ("Use classroom supplies","Use school-supplied bean or pea seeds with adult oversight. Observe seedlings in their pots. Keep classroom materials separate from the orchard trial and follow the school’s handling procedures."),
  ("Field trail and virtual trail","Map three observation stops: the path, a magnolia and the assigned coffee position. Use the atlas and dated notes for a virtual trail. Ask the farm about an in-person visit and discuss the route, accessibility, supervision, facilities and contingencies with your school."),
  ("Complete the school process","Discuss approval and risk assessment before an on-site visit. NSW public schools can use the department’s procedures linked on the next page. Teachers can share practical questions via the portal.")
 ]),
 ("Sources and assessment",[
  ("NESA and NSW Department of Education",f'<link href="{NSW17}">2017 primary outcome references</link> · <link href="{NSW24}">2024 primary outcomes and implementation</link> · <link href="{NSWSEC}">2023 Science 7–10 outcomes</link>. The activities provide classroom opportunities to practise selected outcomes.'),
  ("Farm growing reference",f'Peasley and Webber (2024), <link href="{COFFEE}">Australian Coffee Growers’ Manual</link>, AgriFutures Australia. The field journal supplies this plant’s observations.'),
  ("NSW excursion planning",f'<link href="{EXCUR}">Excursions and variations of routine</link>, NSW Department of Education.'),
  ("Review and plan","Collect a sketch, date, observation and question or claim. A developing response identifies a visible feature. A secure response names a source and explains one change or uncertainty. An extending response proposes a fair next test. Vote in the teacher portal for the next classroom activity.")
 ])
]

def handbook(item):
    c=document(item)
    cover(c,item,"TEACHER HANDBOOK · KINDERGARTEN TO YEAR 10","Plan a first lesson, follow your school’s coffee tree and build a class record across the term.")
    for i,(title,sections) in enumerate(HANDBOOK,2):
        page(c,"THE GLENOLIA CLASSROOM LIBRARY",title,"TEACHER’S FIELD HANDBOOK",i)
        y=H-161
        for heading,body in sections:
            y=paragraph(c,heading,y,15,font="NotoSerif",colour=GREEN)
            y=paragraph(c,body,y-6,12)-22
        assert y>50,(title,y)
        c.showPage()
    c.save()

def colour_book(story,plate,row):
    c=document(story)
    for i,caption in enumerate(story["lines"]):
        page(c,"FREE CLASSROOM COLOURING  /  KINDERGARTEN TO YEAR 2",story["title"],"COLOUR AND TELL THE STORY",i+1)
        paragraph(c,caption,H-163,16,colour=GREEN)
        width,height=plate.size
        left,right=i/3,(i+1)/3
        # Use the whitespace between illustrated panels when objects leave the nominal cell.
        crops={("coffee-cherry",0):(0,.318),("leaf-hunt",1):(.333,.638),
               ("little-tree",0):(0,.369),("little-tree",1):(.373,.665)}
        left,right=crops.get((story["id"],i),(left,right))
        art=plate.crop((round(left*width),round(row*height/2),round(right*width),round((row+1)*height/2))).convert("RGB")
        grey=ImageOps.grayscale(art)
        # Trim the white gutters on the source production sheet.
        occupied=ImageChops.invert(grey).point(lambda x:255 if x>75 else 0).getbbox()
        image(c,art.crop(occupied),MARGIN,205,WIDTH,407)
        paragraph(c,"A detail I noticed",181,13,font="NotoBold",colour=GREEN)
        lines(c,146,3)
        c.showPage()
    c.save()

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("sheets",nargs=4,type=Path,help="Four reviewed production sheets in story order")
    args=parser.parse_args()
    definitions=json.loads(subprocess.check_output(["node","--input-type=module","-e",
        "import {packs,stories} from './public/teachers/plant-library-data.js'; console.log(JSON.stringify({packs,stories}));"],cwd=SITE))
    OUTPUT.mkdir(parents=True,exist_ok=True)
    for name,file in [("Noto","NotoSans-Regular.ttf"),("NotoBold","NotoSans-Bold.ttf"),("NotoSerif","NotoSerifDisplay-Regular.ttf")]:
        pdfmetrics.registerFont(TTFont(name,str(FONTS/file)))
    handbook(definitions["packs"][0])
    for item,steps in zip(definitions["packs"][1:7],STUDENT,strict=True):
        student(item,steps)
    for item in definitions["packs"][7:]:
        student(item,EXTRAS[item["id"]][3])
    for index,story in enumerate(definitions["stories"]):
        with Image.open(args.sheets[index//2]) as plate:
            colour_book(story,plate,index%2)

if __name__=="__main__":
    main()
