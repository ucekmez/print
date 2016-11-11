import { Docs, Files } from '/imports/api/collections/docs.js';

import PDFtools from 'fili1';
import PDFErrorHandler from 'fili1/src/error/PDFErrorHandler.js';


Meteor.methods({
  user_assign_file_to_doc(fid) {
    const file = Files.findOne(fid);
    var session = PDFtools.startEdit(file.path, {
        media: 'A4',
        writePageMetadataIntoFile: true,
        forceEdit: false,
        checkProportions: false,
    },
    {
        onComplete: function (report) {},
        onError: function (err) {
            PDFErrorHandler(err, true);
        }
    });


    process.on('uncaughtException', session.getErrorHandler());

    session
      .loadImage([
          PDFtools.image("ml", 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/322px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg', true)
      ])

      .loadText([
          PDFtools.text("pumpkin", "BEKLEDİĞİNİZ LEZZET PUMPKIN SPICE\nGERİ DÖNDÜ!", "left", "Arial", 14, 0xffffff),
          PDFtools.text("yildiz", "Yıldızlarla bir asra atılan imza...", "left", "Arial", 14, 0xffffff),
          PDFtools.text("numara", "__", "center", "Arial", 50, 0x00, function (line, page) {
              return line.replace("__", page.index);
          })
      ])

      .loadFont(PDFtools.font('Arial', '/Users/ugur/Desktop/FILISRC/print/data/arial.ttf'))

      .setInfo({
          author: 'PDFtools',
          title: 'PDFtools',
          subject: 'PDFtools',
          creator: 'PDFtools'
      })

      .select("all", function (page) {
          page.setStyle({
              "valign": "top",
              "margin": [10, '15%', 10, '15%'],
              "horizontalSides": {
                  "mode": "singleSided", // doubleSided
                  "startFrom": "right",
                  "swap": "odd"
              }
          })
              .addBanner("ml", "right", {
                  "valign": "top",
                  "align": "center"
              })
              .addText("numara", "right", {
                  "valign": "middle",
                  "align": "center",
                  "scale": "original"
              });
      })


      .save(file.path.split('.')[0] + '_processed.pdf');
  }
});
