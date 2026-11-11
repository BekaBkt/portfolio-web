// One fullscreen fragment shader renders the whole world:
// sky + stars + sun/moon, three mountain ridges, reflective water and a
// raymarched, slowly morphing iridescent orb.

export const vertexSource = /* glsl */ `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const fragmentSource = /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2  uRes;
uniform float uTime;
uniform vec3  uCamPos;
uniform vec3  uCamF;
uniform vec3  uCamR;
uniform vec3  uCamU;
uniform float uFocal;

uniform vec3  uSkyTop;
uniform vec3  uSkyHor;
uniform vec3  uSun;
uniform vec3  uSunDir;
uniform float uDisc;
uniform vec3  uWater;
uniform vec3  uMtnFar;
uniform vec3  uMtnNear;
uniform float uStars;
uniform float uAlpenglow;

uniform vec3  uOrbPos;
uniform float uOrbR;
uniform float uOrbGlow;
uniform float uWave;
uniform float uIntro;
uniform float uPx;
uniform float uGlitter;

const float PI = 3.14159265;

float hash11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2  hash22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }

float noise1(float x) {
  float i = floor(x); float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hash11(i), hash11(i + 1.0), u);
}

float noise2(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), u.x),
             mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), u.x), u.y);
}

// ridged 1D fbm for mountain silhouettes
float ridge(float x, float seed) {
  float h = 0.0; float a = 0.5; float f = 1.0;
  for (int i = 0; i < 5; i++) {
    float n = noise1(x * f + seed * 17.0);
    n = 1.0 - abs(n * 2.0 - 1.0);
    h += n * n * a;
    f *= 2.07; a *= 0.48;
  }
  return h;
}

// ---------- sky ----------
vec3 skyColor(vec3 rd, bool withStars) {
  float h = rd.y;
  float g = smoothstep(-0.05, 0.55, h);
  vec3 col = mix(uSkyHor, uSkyTop, pow(g, 0.7));

  // warm band hugging the horizon
  col += uSkyHor * 0.25 * exp(-abs(h) * 18.0);

  float s = max(dot(rd, uSunDir), 0.0);
  col += uSun * (pow(s, 4.0) * 0.18 + pow(s, 24.0) * 0.35) * (0.4 + 0.6 * uDisc);
  float disc = smoothstep(0.99955, 0.99975, s);
  col = mix(col, uSun * 1.25, disc * uDisc);
  col += uSun * pow(s, 900.0) * 1.2 * uDisc;

  if (withStars && uStars > 0.001 && h > 0.0) {
    vec2 sp = vec2(atan(rd.x, -rd.z), asin(clamp(h, -1.0, 1.0)));
    for (int layer = 0; layer < 2; layer++) {
      float sc = layer == 0 ? 110.0 : 230.0;
      vec2 uv = sp * sc;
      vec2 id = floor(uv);
      vec2 f = fract(uv) - 0.5;
      float r = hash12(id + float(layer) * 31.7);
      if (r > (layer == 0 ? 0.965 : 0.94)) {
        vec2 off = (hash22(id) - 0.5) * 0.7;
        float d = length(f - off);
        float tw = 0.65 + 0.35 * sin(uTime * (1.0 + r * 3.0) + r * 40.0);
        float b = smoothstep(0.12, 0.0, d) * tw * (layer == 0 ? 1.0 : 0.55);
        col += vec3(0.85, 0.88, 1.0) * b * uStars * smoothstep(0.0, 0.18, h);
      }
    }
  }
  return col;
}

// mountains: returns vec4(color, coverage)
vec4 mountains(vec3 rd) {
  float az = atan(rd.x, -rd.z);
  float h = rd.y;
  vec4 res = vec4(0.0);

  // far range (snow-capped)
  float azF = az * 2.2 - uCamPos.x * 0.0015;
  float eF = 0.012 + ridge(azF, 1.0) * 0.105 * smoothstep(1.6, 0.2, abs(az));
  // mid range
  float azM = az * 3.4 - uCamPos.x * 0.004;
  float eM = 0.006 + ridge(azM, 2.0) * 0.06;
  // near hills
  float azN = az * 5.0 - uCamPos.x * 0.009;
  float eN = 0.002 + ridge(azN, 3.0) * 0.032;

  float aF = smoothstep(eF + uPx, eF - uPx, h);
  float aM = smoothstep(eM + uPx, eM - uPx, h);
  float aN = smoothstep(eN + uPx, eN - uPx, h);
  if (aF > 0.0) {
    float snow = smoothstep(eF - 0.03, eF - 0.006, h) * smoothstep(0.06, 0.1, eF);
    vec3 c = mix(uMtnFar, mix(uSkyHor, vec3(1.0, 0.86, 0.9), 0.5), 0.35);
    c = mix(c, mix(vec3(0.86, 0.88, 0.96), vec3(1.0, 0.72, 0.68), uAlpenglow), snow * 0.55);
    // atmospheric haze toward the base
    c = mix(c, uSkyHor, 0.35 * smoothstep(eF, 0.0, h));
    res = vec4(c, aF);
  }
  if (aM > 0.0) {
    vec3 c = mix(uMtnFar, uMtnNear, 0.45);
    c = mix(c, uSkyHor, 0.22 * smoothstep(eM, 0.0, h));
    res = vec4(mix(res.rgb, c, aM), max(res.a, aM));
  }
  if (aN > 0.0) {
    vec3 c = uMtnNear;
    c = mix(c, uSkyHor, 0.12 * smoothstep(eN, 0.0, h));
    res = vec4(mix(res.rgb, c, aN), max(res.a, aN));
  }
  return res;
}

vec3 environment(vec3 rd, bool withStars) {
  vec3 col = skyColor(rd, withStars);
  vec4 m = mountains(rd);
  return mix(col, m.rgb, m.a);
}

// ---------- water ----------
float waveHeight(vec2 p, float dist) {
  float t = uTime * 0.55;
  float h = 0.0;
  h += sin(dot(p, vec2(0.12, 0.31)) + t * 0.9) * 0.10;
  h += sin(dot(p, vec2(-0.27, 0.18)) + t * 1.1) * 0.07;
  h += sin(dot(p, vec2(0.41, -0.09)) + t * 1.3) * 0.05;
  h += (noise2(p * 0.9 + vec2(t * 0.3, -t * 0.2)) - 0.5) * 0.10 * exp(-dist * 0.03);
  h += (noise2(p * 2.3 - vec2(t * 0.5, t * 0.35)) - 0.5) * 0.045 * exp(-dist * 0.07);
  return h * uWave;
}

vec3 waterNormal(vec2 p, float dist) {
  float e = 0.06 + dist * 0.004;
  float h0 = waveHeight(p, dist);
  float hx = waveHeight(p + vec2(e, 0.0), dist);
  float hz = waveHeight(p + vec2(0.0, e), dist);
  vec3 n = normalize(vec3(h0 - hx, e, h0 - hz));
  return normalize(mix(vec3(0.0, 1.0, 0.0), n, exp(-dist * 0.035)));
}

// ---------- orb ----------
float orbSDF(vec3 p) {
  vec3 q = p - uOrbPos;
  float t = uTime * 0.35;
  float d = length(q) - uOrbR;
  float w = sin(q.x * 2.1 + t) * sin(q.y * 2.4 + t * 1.3) * sin(q.z * 1.9 + t * 0.8);
  w += 0.5 * sin(q.x * 3.7 - t * 1.1) * sin(q.z * 3.1 + t * 0.7);
  return d - w * uOrbR * 0.085;
}

vec3 orbNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  const float e = 0.004;
  return normalize(k.xyy * orbSDF(p + k.xyy * e) + k.yyx * orbSDF(p + k.yyx * e) +
                   k.yxy * orbSDF(p + k.yxy * e) + k.xxx * orbSDF(p + k.xxx * e));
}

// returns (distance along ray, coverage). Coverage < 1 near the silhouette
// gives the orb a soft, antialiased edge.
vec2 traceOrb(vec3 ro, vec3 rd) {
  vec3 oc = ro - uOrbPos;
  float br = uOrbR * 1.3;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - br * br;
  float disc = b * b - c;
  if (disc < 0.0) return vec2(-1.0, 0.0);
  float t = max(-b - sqrt(disc), 0.0);
  float tEnd = -b + sqrt(disc);
  float minD = 1e9;
  float tMin = t;
  for (int i = 0; i < 56; i++) {
    float d = orbSDF(ro + rd * t);
    if (d < minD) { minD = d; tMin = t; }
    if (d < 0.0015) return vec2(t, 1.0);
    t += d * 0.85;
    if (t > tEnd) break;
  }
  float w = max(tMin * uPx * 1.6, 0.002);
  return vec2(tMin, smoothstep(w, 0.0, minD));
}

vec3 shadeOrb(vec3 p, vec3 rd) {
  vec3 n = orbNormal(p);
  float ndv = clamp(dot(n, -rd), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 2.2);
  vec3 refl = environment(reflect(rd, n), false);
  // thin-film iridescence: hue shifts with view angle and slowly with time
  vec3 film = 0.5 + 0.5 * cos(2.0 * PI * (fres * 0.9 + uTime * 0.025 + vec3(0.0, 0.33, 0.67) + dot(n, vec3(0.2, 0.5, 0.1))));
  vec3 body = mix(uWater * 1.4, uSkyHor, 0.35);
  vec3 col = mix(body, refl, 0.62 + 0.3 * fres);
  film = mix(vec3(dot(film, vec3(0.333))), film, 0.55);
  col += film * (0.08 + 0.38 * fres) * mix(vec3(1.0), uSkyHor, 0.35);
  // soft inner light, brighter at night
  col += mix(uSkyHor, vec3(0.75, 0.8, 1.0), 0.5) * pow(ndv, 3.0) * 0.22 * uOrbGlow;
  // sun sparkle
  vec3 h = normalize(uSunDir - rd);
  col += uSun * pow(max(dot(n, h), 0.0), 120.0) * 1.4 * (0.3 + 0.7 * uDisc);
  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 ro = uCamPos;
  vec3 rd = normalize(uCamF * uFocal + uCamR * uv.x + uCamU * uv.y);

  vec2 orb = traceOrb(ro, rd);
  float tWater = rd.y < -0.0001 ? (0.0 - ro.y) / rd.y : 1e9;

  vec3 col;
  if (tWater < 1e8) {
    vec3 p = ro + rd * tWater;
    vec3 n = waterNormal(p.xz, tWater);
    vec3 rr = reflect(rd, n);
    rr.y = abs(rr.y);
    float fres = 0.03 + 0.97 * pow(1.0 - max(dot(-rd, n), 0.0), 5.0);
    vec3 refl = environment(rr, true);
    // reflection of the orb on the water
    vec2 tr = traceOrb(p, rr);
    if (tr.y > 0.0) refl = mix(refl, shadeOrb(p + rr * tr.x, rr), 0.75 * tr.y);
    col = mix(uWater, refl, fres);
    // glitter path under the sun/moon
    float s = max(dot(rr, uSunDir), 0.0);
    col += uSun * pow(s, 260.0) * uGlitter * (0.25 + 0.75 * uDisc);
    // pool of light under the orb
    vec2 dxz = p.xz - uOrbPos.xz;
    col += mix(uSkyHor, vec3(0.7, 0.75, 1.0), 0.4) * exp(-dot(dxz, dxz) * 0.12) * 0.12 * uOrbGlow;
    // distance haze
    float fog = 1.0 - exp(-tWater * 0.011);
    col = mix(col, mix(uSkyHor, uSkyTop, 0.15), fog * 0.85);
  } else {
    col = environment(rd, true);
    // halo around the orb
    vec3 oc = uOrbPos - ro;
    float along = max(dot(oc, rd), 0.0);
    float dd = length(oc - rd * along) - uOrbR;
    col += mix(uSkyHor, vec3(0.8, 0.82, 1.0), 0.5) * exp(-max(dd, 0.0) * 2.2) * 0.07 * uOrbGlow;
  }

  if (orb.y > 0.0 && orb.x < tWater) {
    col = mix(col, shadeOrb(ro + rd * orb.x, rd), orb.y);
  }

  // vignette, intro fade, dithering
  vec2 q = gl_FragCoord.xy / uRes;
  col *= 0.82 + 0.18 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.25);
  col *= uIntro;
  col += (hash12(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) / 255.0 * 2.5;
  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
