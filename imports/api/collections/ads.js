import { FilesCollection } from 'meteor/ostrio:files';


export const Ads = new FilesCollection({
  collectionName: 'Ads',
  allowClientCode: false,
  storagePath: function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return '/Users/ugur/Desktop/FILISRC/print/data/ads/files/'+year+'/'+month;
  },
  onBeforeUpload: function(file) {
    // if file size < 10x2 Mbyte and file extension is pdf
    if (file.size <= 10485760*2) {
      if (/jpg|JPG|png|PNG/i.test(file.extension)) {
        return true;
      }else {
        return "452"; // dosya jpg degil
      }
    }else {
      return "453"; // dosya cok buyuk
    }
  }
});
