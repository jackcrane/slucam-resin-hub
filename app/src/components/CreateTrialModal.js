import {
  AutoComplete,
  Button,
  Divider,
  Drawer,
  Image,
  Input,
  InputNumber,
  List,
  message,
  Popconfirm,
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

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetch("/resins")
      .then((res) => res.json())
      .then((resins) => {
        resins = resins.map((resin) => ({
          label: `${resin.manufacturer} ${resin.name} ${resin.color}`,
          value: resin.id,
        }));
        setResins(resins);
      });
  }, [tick]);

  const [resin, setResin] = useState("");
  const [printer, setPrinter] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [layerHeight, setLayerHeight] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [bottomLayerCount, setBottomLayerCount] = useState(null);
  const [bottomLayerExposureTime, setBottomLayerExposureTime] = useState(null);
  const [bottomLayerLightOffDelay, setBottomLayerLightOffDelay] =
    useState(null);
  const [bottomLayerLiftDistance, setBottomLayerLiftDistance] = useState(null);
  const [bottomLayerLiftSpeed, setBottomLayerLiftSpeed] = useState(null);
  const [bottomLayerTransitionCount, setBottomLayerTransitionCount] =
    useState(null);
  const [normalExposureTime, setNormalExposureTime] = useState(null);
  const [normalLightOffDelay, setNormalLightOffDelay] = useState(null);
  const [normalLiftDistance, setNormalLiftDistance] = useState(null);
  const [normalLiftSpeed, setNormalLiftSpeed] = useState(null);
  const [transitionType, setTransitionType] = useState("");
  const [notes, setNotes] = useState("");
  const [trialId, setTrialId] = useState(null);

  useEffect(() => {
    if (props.role === "update") {
      console.log(props);
      fetch(`/trials/${props.trialId}`)
        .then((res) => res.json())
        .then((trial) => {
          setPrinter(trial.printer);
          setResin(trial.resinId);
          setName(trial.name);
          setStatus(trial.status);
          setLayerHeight(trial.layerHeight);
          setSpeed(trial.speed);
          setBottomLayerCount(trial.bottomLayerCount);
          setBottomLayerExposureTime(trial.bottomLayerExposureTime);
          setBottomLayerLightOffDelay(trial.bottomLayerLightOffDelay);
          setBottomLayerLiftDistance(trial.bottomLayerLiftDistance);
          setBottomLayerLiftSpeed(trial.bottomLayerLiftSpeed);
          setBottomLayerTransitionCount(trial.bottomLayerTransitionCount);
          setNormalExposureTime(trial.normalExposureTime);
          setNormalLightOffDelay(trial.normalLightOffDelay);
          setNormalLiftDistance(trial.normalLiftDistance);
          setNormalLiftSpeed(trial.normalLiftSpeed);
          setTransitionType(trial.transitionType);
          setNotes(trial.notes);
          setTrialId(trial.id);
        });
    }
  }, [props]);

  useEffect(() => {
    if (props.resinId) setResin(props.resinId);
  }, [props.resinId]);

  const submit = async () => {
    const f = await fetch(
      props.role === "update" ? `/trial/${trialId}/update` : "/trial",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          printer,
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
      }
    );
    if (f.status !== 200) {
      messageApi.open({
        type: "error",
        content: "Failed to create print. Details are in the console.",
      });
      await f.json().then((f) => console.log(f));
      return;
    } else {
      messageApi.open({
        type: "error",
        content: "Print written successfully!",
      });
      props.onClose();
      props.onTrialCreated();
    }
  };

  const loadSuccessful = async () => {
    const f = await fetch(`/resins/${resin}/success`, {
      method: "GET",
    });
    const fj = await f.json();
    setLayerHeight(fj.layerHeight);
    setPrinter(fj.printer);
    setSpeed(fj.speed);
    setBottomLayerCount(fj.bottomLayerCount);
    setBottomLayerExposureTime(fj.bottomLayerExposureTime);
    setBottomLayerLightOffDelay(fj.bottomLayerLightOffDelay);
    setBottomLayerLiftDistance(fj.bottomLayerLiftDistance);
    setBottomLayerLiftSpeed(fj.bottomLayerLiftSpeed);
    setBottomLayerTransitionCount(fj.bottomLayerTransitionCount);
    setNormalExposureTime(fj.normalExposureTime);
    setNormalLightOffDelay(fj.normalLightOffDelay);
    setNormalLiftDistance(fj.normalLiftDistance);
    setNormalLiftSpeed(fj.normalLiftSpeed);
    setTransitionType(fj.transitionType);
  };

  return (
    <>
      <Drawer
        title={
          props.role === "update" ? "Update a print" : "Record a new print"
        }
        placement="right"
        closable={true}
        onClose={props.onClose}
        open={props.visible}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Title level={4}>Print information</Typography.Title>
          <Input
            addonBefore="Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            style={{ width: "100%" }}
          />
          <Select
            placeholder="Select a printer"
            showArrow
            style={{ width: "100%" }}
            options={[
              {
                name: "Phrozen",
                value: "PHROZEN",
              },
              {
                name: "Photon",
                value: "PHOTON",
              },
            ]}
            onChange={(e) => setPrinter(e)}
            value={printer}
          />
          <Divider />
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
            value={resin}
          />
          <Popconfirm
            title="Load the successful print settings?"
            description="This will overwrite all the settings below."
            onConfirm={loadSuccessful}
            okText="Yes"
            cancelText="No"
            style={{ maxWidth: 300 }}
          >
            <Button style={{ width: "100%" }}>
              Load successful print settings
            </Button>
          </Popconfirm>
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
            value={status}
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
            value={layerHeight}
          />
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="Speed"
            addonAfter="mm/min"
            onInput={(e) => setSpeed(parseFloat(e))}
            value={speed}
          />
          <Divider />
          <Typography.Title level={4}>Bottom Layer</Typography.Title>
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="Layer Count"
            onInput={(e) => setBottomLayerCount(parseInt(e))}
            value={bottomLayerCount}
          />
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="Exposure Time"
            addonAfter="s"
            onInput={(e) => setBottomLayerExposureTime(parseFloat(e))}
            value={bottomLayerExposureTime}
          />
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="Light Off Delay"
            addonAfter="s"
            onInput={(e) => setBottomLayerLightOffDelay(parseFloat(e))}
            value={bottomLayerLightOffDelay}
          />
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="Lift Distance"
            addonAfter="mm"
            onInput={(e) => setBottomLayerLiftDistance(parseFloat(e))}
            value={bottomLayerLiftDistance}
          />
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="Lift Speed"
            addonAfter="mm/min"
            onInput={(e) => setBottomLayerLiftSpeed(parseFloat(e))}
            value={bottomLayerLiftSpeed}
          />
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="Transition Count"
            onInput={(e) => setBottomLayerTransitionCount(parseInt(e))}
            value={bottomLayerTransitionCount}
          />
          <Divider />
          <Typography.Title level={4}>Normal Layer</Typography.Title>
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="Exposure Time"
            addonAfter="s"
            onInput={(e) => setNormalExposureTime(parseFloat(e))}
            value={normalExposureTime}
          />
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="Light Off Delay"
            addonAfter="s"
            onInput={(e) => setNormalLightOffDelay(parseFloat(e))}
            value={normalLightOffDelay}
          />
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="Lift Distance"
            addonAfter="mm"
            onInput={(e) => setNormalLiftDistance(parseFloat(e))}
            value={normalLiftDistance}
          />
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="Lift Speed"
            addonAfter="mm/min"
            onInput={(e) => setNormalLiftSpeed(parseFloat(e))}
            value={normalLiftSpeed}
          />
          <Divider />
          <Typography.Title level={4}>Notes</Typography.Title>
          <Input.TextArea
            placeholder="Notes"
            onInput={(e) => setNotes(e.target.value)}
            value={notes}
          />
          <Divider />
          <Button type="primary" onClick={submit}>
            {props.role === "update" ? "Update print" : "Create print"}
          </Button>
        </Space>
      </Drawer>
    </>
  );
};

export default CreateTrialModal;
