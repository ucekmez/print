# print
scenario : Admin, Reklamveren ve bunlar için reklamlar ekleyebiliyor. İlgili reklamların sayfalara yüklenildiğinde nasıl görüleceği ile ilgili bir önizleme dosyası otomatik oluşturuluyor. Önizleme ardından reklam onaylanırsa, o aşamdan itibaren aktif olarak kullanılabiliyor.
Admin, matbaa ve bu matbaaların dokümanları nereye teslim edeceklerini seçebiliyor (haritadan işaretleyerek).
Kullanıcılar sisteme en fazla 5 dosya ve toplam sayfa sayısı 100ü geçmeyecek şekilde PDF dosya yükleyebiliyorlar. Dosyaların geçerlilik (gerçekten PDF olma) kontrolü yapılabiliyor ve sadece PDF'lere izin verilebiliyor. PDF'ler yüklendikten sonra çıktıların nereden teslim alınacağı, haritadan daha önce eklenmiş konumlardan seçilebiliyor ve kişinin bu seçimlerini onaylaması isteniyor.


# todo
  - Kullanıcının en son onay sayfası henüz yok.
  - Kullanıcının subscription ayarı (ayda en fazla 100 sayfa, ardından 1 ay dolana kadar işlem yapamaması)
  - Henüz kullanıcının upload ettiği pdf'lere reklam yerleştirilmiyor. Bir örneği admindeki reklam önizleme bölümünde var. Oradan bakılabilir.
  - Matbaa ve Reklamveren panelleri yok.
   \_ Matbaa kendi bilgilerini düzenleyebilecek ve ona gönderilen pdf'leri listeleyebilmeli. Bu pdf'leri yazıcıya gönderince, gönderildi şeklinde onaylayabilmeli. Bu bilgi aynı zamanda kullanıcıya da gönderilmeli.
   \_ Reklamveren, kendi reklamlarıyla alakalı istatistiklere ulaşabilmeli. Reklamı kaç defa bastırıldı (onaylanan pdf'ler arasından), reklamının yer aldığı doküman neyle alakalı ve kim tarafından görüldü (kullanıcı profili, yaş cinsiyet bölüm, semt vs.)

  1) extract text from pdf https://github.com/dbashford/textract
  2) convert doc,docx,xls,xlsx,ppt,pptx to pdf
