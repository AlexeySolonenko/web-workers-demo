//importScripts('imageManips.js');
  function makePixelInverted(r, g, b, a) {
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    return [r, g, b, a];
  };

  function makePixelChroma(r, g, b, a) {
    var max;
    max = Math.max(r, Math.max(g, b));
    if (max === g) {
      return [0, 0, 0, 0];
    } else {
      return [r, g, b, a];
    }
  };

  function makePixelGreyScale(r, g, b, a) {
    var y;
    y = (0.3 * r) + (0.59 * g) + (0.11 * b);
    r = y;
    g = y;
    b = y;
    return [r, g, b, a];
  };

  function makePixelVibrant(r, g, b, a) {
    var amt, avg, bs, gs, mx, rs;
    avg = (r + g + b) / 3.0;
    mx = Math.max(r, Math.max(g, b));
    amt = (mx / 255 * avg / 255) * (-0.4 * 3.0);
    rs = r + (amt * (mx - r));
    gs = g + (amt * (mx - g));
    bs = b + (amt * (mx - b));
    return [rs, gs, bs, a];
  };
  
function manipulate(type, r, g, b, a) {
  
  var func = function() {};



  switch (type) {
    case "invert":
      func = makePixelInverted;
      break;
    case "chroma":
      func = makePixelChroma;
      break;
    case "greyscale":
      func = makePixelGreyScale;
      break;
    case "vibrant":
      func = makePixelVibrant;
      break;
    default:
      console.log("Not a valid image manipulation");
      break;
  }

  return func;
}

this.onmessage = function(e) {
  var imageData = e.data.imageData;
  var type = e.data.type;

  
  try {
    length = imageData.data.length / 4;
    var manipulatePixel = manipulate(type);
    for (i = j = 0, ref = length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      r = imageData.data[i * 4 + 0];
      g = imageData.data[i * 4 + 1];
      b = imageData.data[i * 4 + 2];
      a = imageData.data[i * 4 + 3];
      pixel = manipulatePixel(type, r, g, b, a);
      imageData.data[i * 4 + 0] = pixel[0];
      imageData.data[i * 4 + 1] = pixel[1];
      imageData.data[i * 4 + 2] = pixel[2];
      imageData.data[i * 4 + 3] = pixel[3];
    }
    postMessage(imageData);
  } catch (e) {
    function ManipulationException(message) {
      this.name = "ManipulationException";
      this.message = message;
    };
    throw new ManipulationException('Image manipulation error');
    postMessage(undefined);
  }
}