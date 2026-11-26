// src/webgl/shaders.ts
var flowingWavesShader = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform bool hasActiveReminders;
uniform bool hasUpcomingReminders;
uniform bool disableCenterDimming;
varying vec2 vTextureCoord;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

  vec2 center = iResolution.xy * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;

  float centerDim = disableCenterDimming ? 1.0 : smoothstep(radius * 0.3, radius * 0.5, dist);

  for(float i = 1.0; i < 10.0; i++){
    uv.x += 0.6 / i * cos(i * 2.5 * uv.y + iTime);
    uv.y += 0.6 / i * cos(i * 1.5 * uv.x + iTime);
  }

  if (hasActiveReminders) {
    fragColor = vec4(vec3(0.1, 0.3, 0.6) / abs(sin(iTime - uv.y - uv.x)), 1.0);
  } else if (hasUpcomingReminders) {
    fragColor = vec4(vec3(0.1, 0.5, 0.2) / abs(sin(iTime - uv.y - uv.x)), 1.0);
  } else {
    fragColor = vec4(vec3(0.1) / abs(sin(iTime - uv.y - uv.x)), 1.0);
  }

  if (!disableCenterDimming) {
    fragColor.rgb = mix(fragColor.rgb * 0.3, fragColor.rgb, centerDim);
  }
}

void main() {
  vec2 fragCoord = vTextureCoord * iResolution;

  vec2 center = iResolution.xy * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;

  if (dist < radius) {
    vec4 color;
    mainImage(color, fragCoord);
    gl_FragColor = color;
  } else {
    discard;
  }
}
`;
var etherShader = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform bool hasActiveReminders;
uniform bool hasUpcomingReminders;
uniform bool disableCenterDimming;
varying vec2 vTextureCoord;

mat2 m(float a){float c=cos(a), s=sin(a);return mat2(c,-s,s,c);}

float map(vec3 p, bool isActive, bool isUpcoming){
    p.xz*= m(t*0.4);p.xy*= m(t*0.3);
    vec3 q = p*2.+t;
    return length(p+vec3(sin(t*0.7)))*log(length(p)+1.) + sin(q.x+sin(q.z+sin(q.y)))*0.5 - 1.;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = fragCoord.xy/min(iResolution.x, iResolution.y) - vec2(.9, .5);
    p.x += 0.4;

    vec3 cl = vec3(0.);
    float d = 2.5;

    for(int i = 0; i <= 5; i++) {
        vec3 p3d = vec3(0, 0, 5.) + normalize(vec3(p, -1.))*d;
        float rz = map(p3d, hasActiveReminders, hasUpcomingReminders);
        float f = clamp((rz - map(p3d+.1, hasActiveReminders, hasUpcomingReminders))*0.5, -.1, 1.);

        vec3 baseColor;
        if(hasActiveReminders) {
            baseColor = vec3(0.05, 0.2, 0.5) + vec3(4.0, 2.0, 5.0)*f;
        } else if(hasUpcomingReminders) {
            baseColor = vec3(0.05, 0.3, 0.1) + vec3(2.0, 5.0, 1.0)*f;
        } else {
            baseColor = vec3(0.1, 0.3, 0.4) + vec3(5.0, 2.5, 3.0)*f;
        }

        cl = cl*baseColor + smoothstep(2.5, .0, rz)*.7*baseColor;
        d += min(rz, 1.);
    }

    float mouseInfluence = 0.0;
    if(iMouse.x > 0.0 || iMouse.y > 0.0) {
        vec2 mousePos = iMouse.xy;
        float mouseDist = length(p - (mousePos*2.0-vec2(1.0))*0.5);
        mouseInfluence = smoothstep(0.6, 0.0, mouseDist);

        if(hasActiveReminders) {
            cl += vec3(0.2, 0.4, 1.0) * mouseInfluence * 0.3;
        } else if(hasUpcomingReminders) {
            cl += vec3(0.2, 1.0, 0.4) * mouseInfluence * 0.3;
        } else {
            cl += vec3(0.5, 0.3, 0.7) * mouseInfluence * 0.3;
        }
    }

    vec2 center = iResolution.xy * 0.5;
    float dist = distance(fragCoord, center);
    float radius = min(iResolution.x, iResolution.y) * 0.5;

    float centerDim = disableCenterDimming ? 1.0 : smoothstep(radius * 0.3, radius * 0.5, dist);

    fragColor = vec4(cl, 1.0);

    if (!disableCenterDimming) {
        fragColor.rgb = mix(fragColor.rgb * 0.3, fragColor.rgb, centerDim);
    }
}

void main() {
  vec2 fragCoord = vTextureCoord * iResolution;

  vec2 center = iResolution.xy * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;

  if (dist < radius) {
    vec4 color;
    mainImage(color, fragCoord);
    gl_FragColor = color;
  } else {
    discard;
  }
}
`;
var shootingStarsShader = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform bool hasActiveReminders;
uniform bool hasUpcomingReminders;
uniform bool disableCenterDimming;
varying vec2 vTextureCoord;

void mainImage(out vec4 O, in vec2 fragCoord) {
  O = vec4(0.0, 0.0, 0.0, 1.0);
  vec2 b = vec2(0.0, 0.2);
  vec2 p;
  mat2 R = mat2(1.0, 0.0, 0.0, 1.0);

  vec2 center = iResolution.xy * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;

  float centerDim = disableCenterDimming ? 1.0 : smoothstep(radius * 0.3, radius * 0.5, dist);

  for(int i = 0; i < 20; i++) {
    float fi = float(i) + 1.0;

    float angle = fi + 0.0;
    float c = cos(angle);
    float s = sin(angle);
    R = mat2(c, -s, s, c);

    float angle2 = fi + 33.0;
    float c2 = cos(angle2);
    float s2 = sin(angle2);
    mat2 R2 = mat2(c2, -s2, s2, c2);

    vec2 coord = fragCoord / iResolution.y * fi * 0.1 + iTime * b;
    vec2 frac_coord = fract(coord * R2) - 0.5;
    p = R * frac_coord;
    vec2 clamped_p = clamp(p, -b, b);

    float len = length(clamped_p - p);
    if (len > 0.0) {
      vec4 star = 1e-3 / len * (cos(p.y / 0.1 + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0);
      O += star;
    }
  }

  if (hasActiveReminders) {
    O.rgb = mix(O.rgb, vec3(0.2, 0.4, 1.0), 0.3);
  } else if (hasUpcomingReminders) {
    O.rgb = mix(O.rgb, vec3(0.2, 1.0, 0.4), 0.3);
  }

  if (!disableCenterDimming) {
    O.rgb = mix(O.rgb * 0.3, O.rgb, centerDim);
  }
}

void main() {
  vec2 fragCoord = vTextureCoord * iResolution;

  vec2 center = iResolution.xy * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;

  if (dist < radius) {
    vec4 color;
    mainImage(color, fragCoord);
    gl_FragColor = color;
  } else {
    discard;
  }
}
`;
var wavyLinesShader = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform bool hasActiveReminders;
uniform bool hasUpcomingReminders;
uniform bool disableCenterDimming;
varying vec2 vTextureCoord;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float aspect = iResolution.x / iResolution.y;
    uv.x *= aspect;

    vec2 mousePos = iMouse.xy;
    mousePos.x *= aspect;
    float mouseDist = length(uv - mousePos);
    float mouseInfluence = smoothstep(0.5, 0.0, mouseDist);

    float line = 0.5;

    vec3 lineColor;

    if (hasActiveReminders) {
        lineColor = vec3(0.2, 0.4, 1.0);
    } else if (hasUpcomingReminders) {
        lineColor = vec3(0.2, 1.0, 0.4);
    } else {
        lineColor = vec3(1.0, 1.0, 1.0);
    }

    vec3 finalColor = mix(vec3(0.0, 0.0, 0.0), lineColor, line);

    if (hasActiveReminders) {
        finalColor += vec3(0.1, 0.2, 0.5) * mouseInfluence * line;
    } else if (hasUpcomingReminders) {
        finalColor += vec3(0.1, 0.5, 0.2) * mouseInfluence * line;
    } else {
        finalColor += vec3(0.1, 0.1, 0.1) * mouseInfluence * line;
    }

    fragColor = vec4(finalColor, 1.0);

    vec2 center = iResolution.xy * 0.5;
    float dist = distance(fragCoord, center);
    float radius = min(iResolution.x, iResolution.y) * 0.5;

    float centerDim = disableCenterDimming ? 1.0 : smoothstep(radius * 0.3, radius * 0.5, dist);

    if (!disableCenterDimming) {
        fragColor.rgb = mix(fragColor.rgb * 0.3, fragColor.rgb, centerDim);
    }
}

void main() {
  vec2 fragCoord = vTextureCoord * iResolution;

  vec2 center = iResolution.xy * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;

  if (dist < radius) {
    vec4 color;
    mainImage(color, fragCoord);
    gl_FragColor = color;
  } else {
    discard;
  }
}
`;
var vertexShader = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
varying vec2 vTextureCoord;
void main() {
  gl_Position = aVertexPosition;
  vTextureCoord = aTextureCoord;
}
`;
var shaders = [
  {
    id: 1,
    name: "Flowing Waves",
    fragmentShader: flowingWavesShader,
    color: "#6366f1"
  },
  {
    id: 2,
    name: "Ether",
    fragmentShader: etherShader,
    color: "#8b5cf6"
  },
  {
    id: 3,
    name: "Shooting Stars",
    fragmentShader: shootingStarsShader,
    color: "#ec4899"
  },
  {
    id: 4,
    name: "Wavy Lines",
    fragmentShader: wavyLinesShader,
    color: "#10b981"
  }
];

// src/webgl/sounds.ts
var audioContext = null;
var initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};
var playCompletionSound = () => {
  if (!audioContext) return;
  const masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);
  masterGain.gain.value = 0.12;
  const createCompletionTone = (freq, type, delay, gainValue, duration) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = freq;
    oscillator.connect(gainNode);
    gainNode.connect(masterGain);
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now + delay);
    gainNode.gain.linearRampToValueAtTime(gainValue, now + delay + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(1e-3, now + delay + duration);
    oscillator.start(now + delay);
    oscillator.stop(now + delay + duration);
  };
  const baseFreq = 440;
  createCompletionTone(baseFreq, "sine", 0, 0.3, 0.7);
  createCompletionTone(baseFreq * 1.25, "sine", 0.1, 0.2, 0.6);
  createCompletionTone(baseFreq * 1.5, "sine", 0.2, 0.15, 0.5);
};
export {
  etherShader,
  flowingWavesShader,
  initAudioContext,
  playCompletionSound,
  shaders,
  shootingStarsShader,
  vertexShader,
  wavyLinesShader
};
//# sourceMappingURL=index.js.map