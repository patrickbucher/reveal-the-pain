PDF_PARAMS= -s --pdf-engine=xelatex -V documentclass=scrartcl -V papersize=a4 -V lang=de -V fontsize=11pt -V geometry=left=2cm,right=2cm,top=2cm,bottom=4cm
FONT_PARAMS=-V mainfont="DejaVu Serif" -V sansfont="DejaVu Sans" -V monofont="DejaVu Sans Mono"
DATE=-V date="`date +'%d.%m.%Y'`"

all: Projektidee_Reveal-the-Pain.pdf Zusammenfassung_Reveal-the-Pain.pdf

Projektidee_Reveal-the-Pain.pdf: Projektidee_Reveal-the-Pain.md
	pandoc $(PDF_PARAMS) $(FONT_PARAMS) $(DATE) $^ -o $@

Zusammenfassung_Reveal-the-Pain.pdf: Zusammenfassung_Reveal-the-Pain.md
	pandoc --toc $(PDF_PARAMS) $(FONT_PARAMS) $(DATE) $^ -o $@

clean:
	rm -f Projektidee_Reveal-the-Pain.pdf Zusammenfassung_Reveal-the-Pain.pdf
