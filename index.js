const fs = require("fs");
const path = require("path");
const svg2ttf = require("svg2ttf");

const directory = 'icons';
const tag = 'ui-icon';

let head = 0xe000;

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

let svg = `

<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
    <metadata>created by inter allied crypsis / acryps</metadata>
    
    <defs>
        <font id="acryps-icons" horiz-adv-x="640">
            <font-face 
                font-family="acryps-icons"
                font-weight="500"
                font-stretch="normal"
                units-per-em="512"
                panose-1="2 0 5 3 0 0 0 0 0 0"
                ascent="448"
                descent="-64"
                bbox="0 0 512 512"
                underline-thickness="25"
                underline-position="-50"
                unicode-range="U+0020-10F8FF"
            />
    
            <missing-glyph />
`;

let css = `

ui-icon {
    display: inline-block;
    font-family: acryps-icons;
}

`;

let html = `
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="out.css">

        <style>

            @font-face {
                font-family: icon;
                src: url('./icons.ttf');
            }

            ui-icon {
                font-family: icon;
            }

        </style>
    </head>

    <body>
`;

for (let file of fs.readdirSync(directory)) {
    const name = file.replace('.svg', '');
    const content = fs.readFileSync(path.join(directory, file)).toString();
    let points = content.match(/d="([A-Z][0-9\.\,\s]+)+Z?"/)[0].split('"')[1];

    points = points.replace(/[0-9\.]+,[0-9\.]+/g, match => [match.split(',')[0], 512 - +match.split(',')[1] - 64])

    svg += `<glyph glyph-name=${JSON.stringify(name)} unicode="&#x${head.toString(16)};" horiz-adv-x="512" d="${points}" />`;
    css += `${tag}[${name}]:before { content: '\\${head.toString(16)}' }\n`;
    html += `${name} <ui-icon ${name}></ui-icon> <br>`;

    head++;
}

svg += `</font></defs></svg>`;

// convert svg font to ttf font
const ttf = Buffer.from(svg2ttf(svg, {}).buffer);

fs.writeFileSync('dist/acryps-icons.svg', svg);
fs.writeFileSync('dist/acryps-icons.ttf', ttf);

fs.writeFileSync('dist/acryps-icons.css', `

${css}

@font-face {
    font-family: acryps-icons;
    src: url('acryps-icons.ttf');
}

`.trim());

fs.writeFileSync('dist/acryps-icons.embedded.css', `

${css}

@font-face {
    font-family: acryps-icons;
    src: url('data:font/ttf;base64,${ttf.toString('base64')}')
}

`.trim());

fs.writeFileSync('dist/acryps-icons.html', html.trim());