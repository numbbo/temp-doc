import os
import re

PATH_BBOB_PDF_OLD = 'https://coco.gforge.inria.fr/downloads/download16.00/bbobdocfunctions.pdf'
PATH_BBOB_PDF_NEW = 'https://numbbo.github.io/gforge/downloads/download16.00/bbobdocfunctions.pdf'


def reformat(line, use_div=True, heading_level=4):
    skip = [
        '\\label',
        '%',
        '\\bbobfigs'
    ]
    for s in skip:
        if line.startswith(s):
            return ''
    result = line
    if 'B\\"{u}che' in result:
        result = result.replace('B\\"{u}che', 'Büche')
    if result.startswith('\\noindent'):
        result = line[10:]
    if result.startswith('\\subsection'):
        result = re.sub(r'\\subsection.*\}{F', '', result)
        result = re.sub(r'}]{.*', '', result)
        f = re.findall(r'(?P<num>\d+)', result)[0]  # Store function number
        if use_div:
            # Surround with div
            result = re.sub(r'(?P<num>\d+)', r'### <a name="F\1"></a>F<sub>\1</sub>',
                            result, count=1)
            result = re.sub(r'\n', f'</h{heading_level}>\n', result)
            result = result.replace(r'### <a',
                                    f'</div>\n\n<div id="text-f{f}">\n<h{heading_level}><a')
        else:
            result = re.sub(r'(?P<num>\d+)', r'### F<sub>\1</sub>',
                            result, count=1)
    if 'href' in result:
        result = re.sub(r'\\href{(\S+)}{\\\(f_({?)(\d+)(}?)\\\) in the (\\)bbob suite\}',
                        r'[f<sub>\3</sub>](\1) in the bbob suite', result)
        result = re.sub(r'\\#', '#', result)
    if 'emph' in result:
        result = re.sub(r'(\\emph{)(.*)(})', r'*\2*', result)
    if '\\%' in result:
        result = result.replace('\\%', '%')
    if '\\(' in result:
        result = re.sub(r'\\\((.*)\\\)', r'$$\1$$', result)
    if '\'' in result:
        result = re.sub(r'``(.*)\'\'', r"'\1'", result)
    if PATH_BBOB_PDF_OLD in result:
        result = result.replace(PATH_BBOB_PDF_OLD, PATH_BBOB_PDF_NEW)
    if '$$' in result:
        result = result.replace('$$', '$')
    if ' bbob ' in result:
        result = result.replace(' bbob ', ' `bbob` ')
    return result


def latex_to_markdown(file_in, file_out, use_div=True, heading_level=4):
    with open(file_in, 'r') as f_in:
        with open(file_out, 'w', encoding='utf-8') as f_out:
            for line in f_in:
                new_line = reformat(line, use_div=use_div, heading_level=heading_level)
                if new_line != '':
                    f_out.write(new_line)
    if use_div:
        # Clean up (put first </div> to the bottom, remove too many empty lines)
        with open(file_out, 'r') as f_in:
            lines = f_in.readlines()
        with open(file_out, 'w') as f_out:
            count_empty = 0
            is_first_div = True
            for line in lines:
                if line == '\n':
                    count_empty += 1
                else:
                    count_empty = 0
                    if is_first_div and line == '</div>\n':
                        line = ''
                        is_first_div = False
                if count_empty <= 1:
                    f_out.write(line)
            f_out.write('</div>\n')


if __name__ == '__main__':
    latex_to_markdown('functions.tex', 'functions_div_h4.md', use_div=True, heading_level=4)
    latex_to_markdown('functions.tex', 'functions.md', use_div=False)
    print('Done!')
