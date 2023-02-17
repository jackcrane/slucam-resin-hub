import express from "express";
const app = express();
import { PrismaClient } from "@prisma/client";
import JsBarcode from "jsbarcode";
import { Canvas } from "canvas";
const prisma = new PrismaClient();
import QRCode from "qrcode";

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

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
  } = req.body;
  try {
    const trial = await prisma.trial.create({
      data: {
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

app.delete("/trial/:id/destroy", async (req, res) => {
  const { id } = req.params;
  const trial = await prisma.trial.delete({
    where: {
      id: id,
    },
  });
  res.json(trial);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
