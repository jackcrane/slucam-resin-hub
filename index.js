import express from "express";
const app = express();
import { PrismaClient } from "@prisma/client";
import JsBarcode from "jsbarcode";
import { Canvas } from "canvas";
const prisma = new PrismaClient();
import QRCode from "qrcode";
import fetch from "node-fetch";

app.use(express.json());

// Verify request is from St. Louis
app.use(async (req, res, next) => {
  console.log(req.headers);
  const ip = req.headers["x-original-forwarded-for"];
  console.log(ip);
  const response = await fetch(
    `https://api.ipgeolocation.io/ipgeo?apiKey=d20d5b9cf0f8498eae4ac3a5e4c07b40&ip=${ip}`
  );
  const data = await response.json();
  if (data.organization === "St. Louis University") {
    next();
  } else {
    res
      .status(403)
      .send(
        `This is only accessible from IPs at Saint Louis University. Your IP is ${ip} from ${data.city}, ${data.country_name}. If you believe this is an error, please contact jack.crane@slu.edu. If you are on SLU's campus, ensure you are on the slu-users network and not using a VPN.`
      );
  }
});

app.use(express.static("app/build"));

app.post("/resin", async (req, res) => {
  const { name, manufacturer, color, description } = req.body;
  const resin = await prisma.resin.create({
    data: {
      name,
      manufacturer,
      color,
      description,
    },
  });
  res.json(resin);
});

app.get("/resins", async (req, res) => {
  // Return the resin with a count of the number of trials
  let resins = await prisma.resin.findMany({
    include: {
      trials: true,
    },
  });
  resins = resins.map((resin) => ({
    ...resin,
    trials: resin.trials.length,
    inProgress: resin.trials.filter((trial) => trial.status === "IN_PROGRESS")
      .length,
  }));
  res.json(resins);
});

app.get("/resins/:id", async (req, res) => {
  const { id } = req.params;
  const resin = await prisma.resin.findUnique({
    where: {
      id: id,
    },
    include: {
      trials: true,
    },
  });
  res.json(resin);
});

app.get("/resins/:id/barcode", (req, res) => {
  const canvas = new Canvas();
  JsBarcode(canvas, req.params.id);
  res.set("Content-Type", "image/png");
  res.send(canvas.toBuffer());
});

app.get("/resins/:id/qr", async (req, res) => {
  const qrCodeImage = await QRCode.toBuffer(req.params.id, {
    margin: 0,
  });
  res.set("Content-Type", "image/png");
  res.send(qrCodeImage);
});

app.post("/trial", async (req, res) => {
  const {
    printer,
    resinId,
    status,
    layerHeight,
    speed,
    bottomLayerCount,
    bottomLayerExposureTime,
    bottomLayerLightOffDelay,
    bottomLayerLiftDistance,
    bottomLayerLiftSpeed,
    bottomLayerTransitionCount,
    normalExposureTime,
    normalLightOffDelay,
    normalLiftDistance,
    normalLiftSpeed,
    transitionType,
    notes,
    name,
  } = req.body;
  try {
    const trial = await prisma.trial.create({
      data: {
        name,
        printer,
        resinId,
        status,
        layerHeight,
        speed,
        bottomLayerCount,
        bottomLayerExposureTime,
        bottomLayerLightOffDelay,
        bottomLayerLiftDistance,
        bottomLayerLiftSpeed,
        bottomLayerTransitionCount,
        normalExposureTime,
        normalLightOffDelay,
        normalLiftDistance,
        normalLiftSpeed,
        transitionType: "LINEAR",
        notes,
      },
    });

    res.json(trial);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.post("/trial/:id/update", async (req, res) => {
  const { id: trialId } = req.params;
  const {
    status,
    layerHeight,
    speed,
    bottomLayerCount,
    bottomLayerExposureTime,
    bottomLayerLightOffDelay,
    bottomLayerLiftDistance,
    bottomLayerLiftSpeed,
    bottomLayerTransitionCount,
    normalExposureTime,
    normalLightOffDelay,
    normalLiftDistance,
    normalLiftSpeed,
    transitionType,
    notes,
    name,
  } = req.body;
  const trial = await prisma.trial.update({
    where: {
      id: trialId,
    },
    data: {
      name,
      status,
      layerHeight,
      speed,
      bottomLayerCount,
      bottomLayerExposureTime,
      bottomLayerLightOffDelay,
      bottomLayerLiftDistance,
      bottomLayerLiftSpeed,
      bottomLayerTransitionCount,
      normalExposureTime,
      normalLightOffDelay,
      normalLiftDistance,
      normalLiftSpeed,
      transitionType: "LINEAR",
      notes,
    },
  });
  res.json(trial);
});

app.delete("/trials/:id/destroy", async (req, res) => {
  const { id } = req.params;
  const trial = await prisma.trial.delete({
    where: {
      id: id,
    },
  });
  res.json(trial);
});

app.get("/trials", async (req, res) => {
  const trials = await prisma.trial.findMany({
    include: {
      resin: true,
    },
  });
  res.json(trials);
});

app.get("/trials/:id", async (req, res) => {
  const { id } = req.params;
  let trial = await prisma.trial.findUnique({
    where: {
      id: id,
    },
  });
  res.json(trial);
});

app.get("/resins/:id/success", async (req, res) => {
  const { id } = req.params;
  const trial = await prisma.trial.findFirst({
    where: {
      resinId: id,
      status: "SUCCESS",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });
  res.json(trial);
});

app.get("/alltrials/names", async (req, res) => {
  const trials = await prisma.trial.findMany({
    select: {
      name: true,
    },
  });
  const names = trials.map((trial) => trial.name).filter((name) => name);
  res.json(names);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
