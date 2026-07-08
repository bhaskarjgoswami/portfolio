/* Sparkles — vanilla port of Aceternity's SparklesCore (tsParticles slim bundle via CDN).
   Props mirrored from the demo: transparent bg, minSize .4, maxSize 1, density 1200, white. */
(function () {
  var host = document.getElementById("clients-sparkles");
  if (!host || !window.tsParticles || !window.loadSlim) return;

  loadSlim(tsParticles)
    .then(function () {
      return tsParticles.load({
      id: "clients-sparkles",
      options: {
        background: { color: { value: "transparent" } },
        fullScreen: { enable: false },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: false, mode: "repulse" },
            resize: true
          },
          modes: {
            push: { quantity: 4 },
            repulse: { distance: 200, duration: 0.4 }
          }
        },
        particles: {
          color: { value: "#ffffff" },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: false,
            speed: { min: 0.1, max: 1 },
            straight: false
          },
          number: {
            density: { enable: true, width: 400, height: 400 },
            value: 1200
          },
          opacity: {
            value: { min: 0.1, max: 1 },
            animation: {
              enable: true,
              speed: 4,
              sync: false,
              mode: "auto",
              startValue: "random",
              destroy: "none"
            }
          },
          shape: { type: "circle" },
          size: { value: { min: 0.4, max: 1 } },
          stroke: { width: 0 }
        },
          detectRetina: true
        }
      });
    })
    .then(function () {
      // Mirrors the framer-motion fade-in from the React version
      host.style.opacity = "1";
    });
})();
