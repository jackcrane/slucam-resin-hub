import {
  Button,
  Divider,
  Drawer,
  Image,
  Input,
  List,
  Space,
  Tabs,
  Typography,
} from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import ModalTimeline from "./ResinModalTimeline";
import { Between } from "./styleds";

const CreateResinModal = (props) => {
  const [manufacturer, setManufacturer] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");

  const submit = async () => {
    console.log("Submitting resin", {
      manufacturer,
      name,
      color,
      description,
    });
    const res = await fetch("/resin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        manufacturer,
        name,
        color,
        description,
      }),
    });
    const resin = await res.json();
    props.onClose();
    props.onResinCreated(resin);
  };

  return (
    <Drawer
      title={"Create a new resin"}
      placement="right"
      closable={true}
      onClose={props.onClose}
      open={props.visible}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Title level={4}>Resin information</Typography.Title>
        <Input
          addonBefore="Manufacturer"
          placeholder="Resin manufacturer"
          onInput={(e) => setManufacturer(e.target.value)}
        />
        <Input
          addonBefore="Name"
          placeholder="Resin name"
          onInput={(e) => setName(e.target.value)}
        />
        <Input
          addonBefore="Color"
          placeholder="Resin color"
          onInput={(e) => setColor(e.target.value)}
        />
        <Divider />
        <Typography.Title level={4}>Description</Typography.Title>
        <Input.TextArea
          placeholder="Optional resin description"
          onInput={(e) => setDescription(e.target.value)}
        />
        <Divider />
        <Button type="primary" onClick={submit}>
          Create resin
        </Button>
      </Space>
    </Drawer>
  );
};

export default CreateResinModal;
