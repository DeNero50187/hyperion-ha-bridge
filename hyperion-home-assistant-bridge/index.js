const dgram = require("node:dgram");
const server = dgram.createSocket("udp4");
const { getConfig } = require("./get-config.js");

const { lights } = getConfig();
const light_loop = require("./light-loop.js");
const latest_color = require("./latest_color.js");
const { TOKEN, PORT } = require("./env.js");
const rate = require("./rate.js");

server.on("error", (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

const debug = false;
const max_brightness = 0.8;

if (!TOKEN) {
  throw new Error(
    "Provide the Home Assistant Long Lived Token as a HA_TOKEN environment variable. Go to /profile in Home Assistant and scroll down."
  );
}

console.log(
  `Remember to set the Hyperion output controller type to UDPRAW and set it to output ${lights.length} lights`
);

let last_time = Date.now();

server.on("message", (msg, rinfo) => {
  const now = Date.now();
  rate.set((now - last_time) * 0.2 + rate.get() * 0.8);
  last_time = now;
  latest_color.set(Array.from(msg).map((e) => parseInt(e)));
  if (debug) {
    console.log("Received colors:", latest_color.get());
  }
});

server.on("listening", async () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
  for (let i in lights) {
    light_loop(i, max_brightness, debug);
  }
});

server.bind(PORT);
