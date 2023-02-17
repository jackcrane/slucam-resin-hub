import {
  Button,
  Divider,
  Drawer,
  Image,
  Input,
  InputNumber,
  List,
  Radio,
  Select,
  Space,
  Tabs,
  Typography,
} from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useInterval } from "usehooks-ts";
import ModalTimeline from "./ResinModalTimeline";
import { Between } from "./styleds";

const CreateTrialModal = (props) => {
  const [resins, setResins] = useState([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    fetch("/resins")
      .then((res) => res.json())
      .then((resins) => {
        resins = resins.map((resin) => ({
          label: `${resin.manufacturer} ${resin.name}`,
          value: resin.id,
        }));
        setResins(resins);
      });
  }, [tick]);

  const [resin, setResin] = useState("");
  const [status, setStatus] = useState("");
  const [layerHeight, setLayerHeight] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [bottomLayerCount, setBottomLayerCount] = useState(0);
  const [bottomLayerExposureTime, setBottomLayerExposureTime] = useState(0);
  const [bottomLayerLightOffDelay, setBottomLayerLightOffDelay] = useState(0);
  const [bottomLayerLiftDistance, setBottomLayerLiftDistance] = useState(0);
  const [bottomLayerLiftSpeed, setBottomLayerLiftSpeed] = useState(0);
  const [bottomLayerTransitionCount, setBottomLayerTransitionCount] =
    useState(0);
  const [normalExposureTime, setNormalExposureTime] = useState(0);
  const [normalLightOffDelay, setNormalLightOffDelay] = useState(0);
  const [normalLiftDistance, setNormalLiftDistance] = useState(0);
  const [normalLiftSpeed, setNormalLiftSpeed] = useState(0);
  const [transitionType, setTransitionType] = useState("");
  const [notes, setNotes] = useState("");

  const submit = async () => {
    const f = await fetch("/trial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resinId: resin,
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
      }),
    });
    if (f.status !== 200) {
      alert("Failed to create trial. Details are in the console.");
      await f.json().then((f) => console.log(f));
      return;
    } else {
      alert("Trial created successfully!");
      props.onClose();
      props.onTrialCreated();
    }
  };

  return (
    <Drawer
      title={"Record a new trial"}
      placement="right"
      closable={true}
      onClose={props.onClose}
      open={props.visible}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Title level={4}>Resin information</Typography.Title>
        <Select
          placeholder="Select a resin"
          showSearch
          optionFilterProp="name"
          showArrow
          filterOption={(input, option) => {
            return JSON.stringify(option)
              .toLowerCase()
              .includes(input.toLowerCase());
          }}
          style={{ width: "100%" }}
          options={resins}
          onChange={(e) => setResin(e)}
        />
        <Divider />
        <Typography.Title level={4}>Status</Typography.Title>
        <Select
          placeholder="Select a status"
          showSearch
          optionFilterProp="name"
          showArrow
          filterOption={(input, option) => {
            return JSON.stringify(option)
              .toLowerCase()
              .includes(input.toLowerCase());
          }}
          style={{ width: "100%" }}
          options={[
            { label: "⏳ In progress", value: "IN_PROGRESS" },
            { label: "✅ Success", value: "SUCCESS" },
            { label: "🟡 Partial failure", value: "PARTIAL" },
            { label: "❌ Failure", value: "FAILURE" },
            { label: "❌ Under exposed", value: "UNDER_EXPOSED" },
            { label: "❌ Over exposed", value: "OVER_EXPOSED" },
            {
              label: "❌ First layer under exposed",
              value: "FIRST_LAYER_UNDER_EXPOSED",
            },
            {
              label: "❌ First layer over exposed",
              value: "FIRST_LAYER_OVER_EXPOSED",
            },
          ]}
          onChange={(e) => setStatus(e)}
        />
        <Divider />
        <Typography.Title level={4}>Print Config</Typography.Title>
        <InputNumber
          style={{ width: "100%" }}
          addonBefore="Layer Height"
          addonAfter="mm"
          onInput={(e) => {
            setLayerHeight(parseFloat(e));
          }}
        />
        <InputNumber
          style={{ width: "100%" }}
          addonBefore="Speed"
          addonAfter="mm/min"
          onInput={(e) => setSpeed(parseFloat(e))}
        />
        <Divider />
        <Typography.Title level={4}>Bottom Layer</Typography.Title>
        <InputNumber
          style={{ width: "100%" }}
          addonBefore="Layer Count"
          onInput={(e) => setBottomLayerCount(parseInt(e))}
        />
        <InputNumber
          style={{ width: "100%" }}
          addonBefore="Exposure Time"
          addonAfter="s"
          onInput={(e) => setBottomLayerExposureTime(parseFloat(e))}
        />
        <InputNumber
          style={{ width: "100%" }}
          addonBefore="Light Off Delay"
          addonAfter="s"
          onInput={(e) => setBottomLayerLightOffDelay(parseFloat(e))}
        />
        <InputNumber
          style={{ width: "100%" }}
          addonBefore="Lift Distance"
          addonAfter="mm"
          onInput={(e) => setBottomLayerLiftDistance(parseFloat(e))}
        />
        <InputNumber
          style={{ width: "100%" }}
          addonBefore="Lift Speed"
          addonAfter="mm/min"
          onInput={(e) => setBottomLayerLiftSpeed(parseFloat(e))}
        />
        <InputNumber
          style={{ width: "100%" }}
          addonBefore="Transition Count"
          onInput={(e) => setBottomLayerTransitionCount(parseInt(e))}
        />
        <Divider />
        <Typography.Title level={4}>Normal Layer</Typography.Title>
        <InputNumber
          style={{ width: "100%" }}
          addonBefore="Exposure Time"
          addonAfter="s"
          onInput={(e) => setNormalExposureTime(parseFloat(e))}
        />
        <InputNumber
          style={{ width: "100%" }}
          addonBefore="Light Off Delay"
          addonAfter="s"
          onInput={(e) => setNormalLightOffDelay(parseFloat(e))}
        />
        <InputNumber
          style={{ width: "100%" }}
          addonBefore="Lift Distance"
          addonAfter="mm"
          onInput={(e) => setNormalLiftDistance(parseFloat(e))}
        />
        <InputNumber
          style={{ width: "100%" }}
          addonBefore="Lift Speed"
          addonAfter="mm/min"
          onInput={(e) => setNormalLiftSpeed(parseFloat(e))}
        />
        <Divider />
        <Typography.Title level={4}>Notes</Typography.Title>
        <Input.TextArea
          placeholder="Notes"
          onInput={(e) => setNotes(e.target.value)}
        />
        <Divider />
        <Button type="primary" onClick={submit}>
          Create trial
        </Button>
      </Space>
    </Drawer>
  );
};

export default CreateTrialModal;
