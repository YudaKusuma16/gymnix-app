const Jimp = require('jimp-compact');
const path = require('path');
const fs = require('fs');

async function generateAssets() {
  const rootDir = path.resolve(__dirname, '..');
  const sourcePath = path.resolve(rootDir, '..', 'Logo Gymnix.png');
  const assetsDir = path.resolve(rootDir, 'assets', 'images');

  console.log('Loading source:', sourcePath);
  const sourceImg = await Jimp.read(sourcePath);
  console.log('Source size:', sourceImg.bitmap.width, 'x', sourceImg.bitmap.height);

  // 1. Copy original file to assets/images/logo-gymnix.png
  fs.copyFileSync(sourcePath, path.resolve(assetsDir, 'logo-gymnix.png'));
  console.log('Copied original to assets/images/logo-gymnix.png');

  // 2. Extract Squircle (centered at 1408, 768, size 668x668)
  const squircle = sourceImg.clone().crop(1074, 434, 668, 668);
  await squircle.writeAsync(path.resolve(assetsDir, 'logo-gymnix-squircle.png'));
  console.log('Saved logo-gymnix-squircle.png (668x668)');

  // 3. Extract the white GX emblem on transparent background
  // GX mark is between x: [1190, 1625], y: [600, 905]
  const minX = 1190, maxX = 1625, minY = 600, maxY = 905;
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const gxRaw = new Jimp(w, h, 0x00000000);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const c = Jimp.intToRGBA(sourceImg.getPixelColor(x, y));
      // Base background color is { r: 20, g: 22, b: 35 }
      const ar = (c.r - 20) / 235;
      const ag = (c.g - 22) / 233;
      const ab = (c.b - 35) / 220;
      let a = (ar + ag + ab) / 3;

      if (a < 0.03) a = 0;
      else if (a > 0.98) a = 1;

      if (a > 0) {
        const intA = Math.round(a * 255);
        gxRaw.setPixelColor(Jimp.rgbaToInt(255, 255, 255, intA), x - minX, y - minY);
      }
    }
  }
  gxRaw.autocrop();
  console.log('Extracted GX emblem dimensions:', gxRaw.bitmap.width, 'x', gxRaw.bitmap.height);
  const gxWidth = gxRaw.bitmap.width;
  const gxHeight = gxRaw.bitmap.height;

  // 4. Generate icon.png (1024x1024)
  // Background: #141623 (R: 20, G: 22, B: 35)
  // Scaled GX emblem: width 640px
  const icon1024 = new Jimp(1024, 1024, Jimp.rgbaToInt(20, 22, 35, 255));
  const gxForIconW = 640;
  const gxForIconH = Math.round((gxForIconW / gxWidth) * gxHeight);
  const gxResized1024 = gxRaw.clone().resize(gxForIconW, gxForIconH, Jimp.RESIZE_BICUBIC);
  const posX1024 = Math.round((1024 - gxForIconW) / 2);
  const posY1024 = Math.round((1024 - gxForIconH) / 2) - 12; // slight optical centering
  icon1024.composite(gxResized1024, posX1024, posY1024);
  await icon1024.writeAsync(path.resolve(assetsDir, 'icon.png'));
  console.log('Generated icon.png (1024x1024)');

  // 5. Generate android-icon-foreground.png (512x512)
  // Transparent background, GX width: 300px (fits safely inside 330px circle)
  const androidFg = new Jimp(512, 512, 0x00000000);
  const gxForAndroidW = 300;
  const gxForAndroidH = Math.round((gxForAndroidW / gxWidth) * gxHeight);
  const gxResized512 = gxRaw.clone().resize(gxForAndroidW, gxForAndroidH, Jimp.RESIZE_BICUBIC);
  const posX512 = Math.round((512 - gxForAndroidW) / 2);
  const posY512 = Math.round((512 - gxForAndroidH) / 2) - 6;
  androidFg.composite(gxResized512, posX512, posY512);
  await androidFg.writeAsync(path.resolve(assetsDir, 'android-icon-foreground.png'));
  console.log('Generated android-icon-foreground.png (512x512)');

  // 6. Generate android-icon-background.png (512x512)
  const androidBg = new Jimp(512, 512, Jimp.rgbaToInt(20, 22, 35, 255));
  await androidBg.writeAsync(path.resolve(assetsDir, 'android-icon-background.png'));
  console.log('Generated android-icon-background.png (512x512)');

  // 7. Generate android-icon-monochrome.png (512x512)
  // Same as foreground
  await androidFg.writeAsync(path.resolve(assetsDir, 'android-icon-monochrome.png'));
  console.log('Generated android-icon-monochrome.png (512x512)');

  // 8. Generate splash-icon.png (GX mark on transparent background)
  // Dimensions proportional (e.g. width 300)
  await gxResized512.writeAsync(path.resolve(assetsDir, 'splash-icon.png'));
  console.log('Generated splash-icon.png');

  // 9. Generate expo-logo.png (used in animated-icon component)
  // Let's make it 228 x proportional height (228 * 284 / 420 = 154)
  const gxExpoLogo = gxRaw.clone().resize(228, Math.round((228 / gxWidth) * gxHeight), Jimp.RESIZE_BICUBIC);
  await gxExpoLogo.writeAsync(path.resolve(assetsDir, 'expo-logo.png'));
  console.log('Generated expo-logo.png (228x' + gxExpoLogo.bitmap.height + ')');

  // 10. Generate favicon.png (48x48)
  const favicon = new Jimp(48, 48, Jimp.rgbaToInt(20, 22, 35, 255));
  const favW = 34;
  const favH = Math.round((favW / gxWidth) * gxHeight);
  const gxResizedFav = gxRaw.clone().resize(favW, favH, Jimp.RESIZE_BICUBIC);
  const posFavX = Math.round((48 - favW) / 2);
  const posFavY = Math.round((48 - favH) / 2);
  favicon.composite(gxResizedFav, posFavX, posFavY);
  await favicon.writeAsync(path.resolve(assetsDir, 'favicon.png'));
  console.log('Generated favicon.png (48x48)');

  // Remove temporary test files
  const testGx = path.resolve(assetsDir, 'test-gx.png');
  const testSq = path.resolve(assetsDir, 'test-squircle.png');
  if (fs.existsSync(testGx)) fs.unlinkSync(testGx);
  if (fs.existsSync(testSq)) fs.unlinkSync(testSq);
  console.log('Done!');
}

generateAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
