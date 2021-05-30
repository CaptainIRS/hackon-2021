const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { Ottoman } = require("ottoman");
const bodyParser = require("body-parser");
const { generateCertificate } = require('./utils/certificateGenerator');

const {
  PORT,
  IP,
  couchbaseBucket,
  couchbasePassword,
  couchbaseUsername,
  couchbaseString,
} = require("./env");

const schema = require("./schema");
const resolvers = require("./resolvers");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Online Class
const spawn = require("child_process").spawn;
const fetch = require("node-fetch");
app.use("/classes", express.static("public"));
const server = require("http").createServer(app);
const io = require("socket.io")(server);

spawn("ffmpeg", ["-h"]).on("error", function () {
  console.error(
    "FFMpeg not found in system cli; please install ffmpeg properly or make a softlink to ./!"
  );
  process.exit(-1);
});

io.on("connection", function (socket) {
  socket.emit("message", "Hello from mediarecorder-to-rtmp server!");
  socket.emit("message", "Please set rtmp destination before start streaming.");

  var ffmpeg_process,
    feedStream = false;
  socket.on("config_rtmpDestination", function (m) {
    if (typeof m != "string") {
      socket.emit("fatal", "rtmp destination setup error.");
      return;
    }
    var regexValidator = /^rtmp:\/\/[^\s]*$/;
    if (!regexValidator.test(m)) {
      socket.emit("fatal", "rtmp address rejected.");
      return;
    }
    socket._rtmpDestination = m;
    socket.emit("message", "rtmp destination set to:" + m);
  });
  socket.on("config_vcodec", function (m) {
    if (typeof m != "string") {
      socket.emit("fatal", "input codec setup error.");
      return;
    }
    if (!/^[0-9a-z]{2,}$/.test(m)) {
      socket.emit("fatal", "input codec contains illegal character?.");
      return;
    }
    socket._vcodec = m;
  });

  socket.on("start", function () {
    if (ffmpeg_process || feedStream) {
      socket.emit("fatal", "stream already started.");
      return;
    }
    if (!socket._rtmpDestination) {
      socket.emit("fatal", "no destination given.");
      return;
    }

    var framerate = socket.handshake.query.framespersecond;
    var audioBitrate = parseInt(socket.handshake.query.audioBitrate);
    var audioEncoding = "64k";
    if (audioBitrate == 11025) {
      audioEncoding = "11k";
    } else if (audioBitrate == 22050) {
      audioEncoding = "22k";
    } else if (audioBitrate == 44100) {
      audioEncoding = "44k";
    }
    console.log(audioEncoding, audioBitrate);
    console.log("framerate on node side", framerate);
    //var ops = [];
    if (framerate == 1) {
      var ops = [
        "-i",
        "-",
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-tune",
        "zerolatency",
        //'-max_muxing_queue_size', '1000',
        //'-bufsize', '5000',
        "-r",
        "1",
        "-g",
        "2",
        "-keyint_min",
        "2",
        "-x264opts",
        "keyint=2",
        "-crf",
        "25",
        "-pix_fmt",
        "yuv420p",
        "-profile:v",
        "baseline",
        "-level",
        "3",
        "-c:a",
        "aac",
        "-b:a",
        audioEncoding,
        "-ar",
        audioBitrate,
        "-f",
        "flv",
        socket._rtmpDestination,
      ];
    } else if (framerate == 15) {
      // eslint-disable-next-line
      var ops = [
        "-i",
        "-",
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-tune",
        "zerolatency",
        "-max_muxing_queue_size",
        "1000",
        "-bufsize",
        "5000",
        "-r",
        "15",
        "-g",
        "30",
        "-keyint_min",
        "30",
        "-x264opts",
        "keyint=30",
        "-crf",
        "25",
        "-pix_fmt",
        "yuv420p",
        "-profile:v",
        "baseline",
        "-level",
        "3",
        "-c:a",
        "aac",
        "-b:a",
        audioEncoding,
        "-ar",
        audioBitrate,
        "-f",
        "flv",
        socket._rtmpDestination,
      ];
    } else {
      // eslint-disable-next-line no-redeclare
      var ops = [
        "-i",
        "-",
        //'-c', 'copy',
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-tune",
        "zerolatency", // video codec config: low latency, adaptive bitrate
        "-c:a",
        "aac",
        "-ar",
        audioBitrate,
        "-b:a",
        audioEncoding, // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
        //'-max_muxing_queue_size', '4000',
        //'-y', //force to overwrite
        //'-use_wallclock_as_timestamps', '1', // used for audio sync
        //'-async', '1', // used for audio sync
        //'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
        //'-strict', 'experimental',
        "-bufsize",
        "5000",

        "-f",
        "flv",
        socket._rtmpDestination,
        /*. original params
			'-i','-',
			'-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'zerolatency',  // video codec config: low latency, adaptive bitrate
			'-c:a', 'aac', '-ar', '44100', '-b:a', '64k', // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
			'-y', //force to overwrite
			'-use_wallclock_as_timestamps', '1', // used for audio sync
			'-async', '1', // used for audio sync
			//'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
			//'-strict', 'experimental', 
			'-bufsize', '1000',
			'-f', 'flv', socket._rtmpDestination
			*/
      ];
    }
    console.log("ops", ops);
    console.log(socket._rtmpDestination);
    ffmpeg_process = spawn("ffmpeg", ops);
    console.log("ffmpeg spawned");
    feedStream = function (data) {
      ffmpeg_process.stdin.write(data);
      //write exception cannot be caught here.
    };

    ffmpeg_process.stderr.on("data", function (d) {
      socket.emit("ffmpeg_stderr", "" + d);
    });
    ffmpeg_process.on("error", function (e) {
      console.log("child process error" + e);
      socket.emit("fatal", "ffmpeg error!" + e);
      feedStream = false;
      socket.disconnect();
    });
    ffmpeg_process.on("exit", function (e) {
      console.log("child process exit" + e);
      socket.emit("fatal", "ffmpeg exit!" + e);
      socket.disconnect();
    });
  });

  socket.on("binarystream", function (m) {
    if (!feedStream) {
      socket.emit("fatal", "rtmp not set yet.");
      ffmpeg_process.stdin.end();
      ffmpeg_process.kill("SIGINT");
      return;
    }
    feedStream(m);
  });
  socket.on("disconnect", function () {
    console.log("socket disconnected!");
    feedStream = false;
    if (ffmpeg_process)
      try {
        ffmpeg_process.stdin.end();
        ffmpeg_process.kill("SIGINT");
        console.log("ffmpeg process ended!");
      } catch (e) {
        console.warn("killing ffmoeg process attempt failed...");
      }
  });
  socket.on("error", function (e) {
    console.log("socket.io error:" + e);
  });
});

io.on("error", function (e) {
  console.log("socket.io error:" + e);
});

app.get("/getNewRTMPLink/:title", async (req, res) => {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  try {
    const newVideo = await fetch("https://peertube.local/api/v1/videos/live/", {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        Authorization: "Bearer c6ee46d74f99b4c1bd05366fc90c10da9f150eeb",
        "Content-Type": "application/json",
        "Sec-GPC": "1",
      },
      referrer: "https://peertube.local/videos/upload",
      body: `{"name":"${req.params.title}","privacy":3,"nsfw":false,"waitTranscoding":true,"commentsEnabled":true,"downloadEnabled":true,"channelId":1}`,
      method: "POST",
      mode: "cors",
    });
    const videoData = await newVideo.json();
    const { video } = videoData;
    console.log(videoData);
    const RTMPInfo = await fetch(
      `https://peertube.local/api/v1/videos/live/${video.id}`,
      {
        credentials: "include",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.5",
          Authorization: "Bearer c6ee46d74f99b4c1bd05366fc90c10da9f150eeb",
          "Sec-GPC": "1",
        },
        referrer: `https://peertube.local/videos/watch/${video.uuid}`,
        method: "GET",
        mode: "cors",
      }
    );
    const rtmpData = await RTMPInfo.json();
    console.log(rtmpData);
    res.json({
      rtmpUrl: rtmpData.rtmpUrl,
      streamKey: rtmpData.streamKey,
      id: video.id,
      uuid: video.uuid,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

//Ottoman Settings
const ottoman = new Ottoman({ collectionName: "_default" });

ottoman.connect({
  connectionString: couchbaseString,
  bucketName: couchbaseBucket,
  username: couchbaseUsername,
  password: couchbasePassword,
});

ottoman.ensureIndexes();

const Assignment = require("./models/Assignment");
const Course = require("./models/Course");
const Prof = require("./models/Prof");
const Student = require("./models/Student");

const apollo = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  // eslint-disable-next-line
  context: async ({ req }) => {

    let user;
    if (req.headers["x-user"]) {
      let userType = req.headers["x-user"].match(/OU=(.*?),/)[1];
      let id = req.headers["x-user"].match(/CN=(.*?),/)[1];
      user = {
        userType,
        id,
      };
    } else {
      user = null;
    }

    return {
      user,
      Assignment,
      Course,
      Prof,
      Student, //All schemas here
    };
  },
});

apollo.applyMiddleware({ app, path: "/api" });

const port = PORT || 4000;
const host = IP || "localhost";

server.listen(port, host, function () {
  console.log(`SERVER listening on ${host}:${port}`);
});

process.on("uncaughtException", function (err) {
  console.log(err);
});